/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/27.
 * Copyright 2021/9/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/27
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Tag, Tooltip, Table, Radio, Input, Affix } from 'antd';
import { getStudentGrade, formatDateHw, smTr, delayeringSubject, resolveSubjectUrl } from '../../../service/utils';
import { useHistory } from 'react-router-dom';
import { downStudentTimeApi, listStudentTimeApi, updateTaskStatusApi } from '../../../service/api/teacher/homework';
import { GRADE_MAP, HOMEWORK_STATUS_MAP, MARK_PREFIX } from '../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../store';
import { AddSignModal } from '../../../globalComponents/AddSignModal';

const { ckMark } = MARK_PREFIX;
const { Search } = Input;
export function ViewHomework () {
    const { state: { currentHomeWorkData, account, clientHeight }, dispatch } = useContext(EDU_CONTEXT);
    const { id: tid, name: tname, ename } = currentHomeWorkData || {};
    const history = useHistory();
    /*
    *
    * state
    *
    * */
    const [studentsStatusList, setstudentsStatusList] = useState({ done: [], doing: [], expire: [] });
    const [HomeworkStatus, setHomeworkStatus] = useState(['all']);
    const [filterValues, setFilterValues] = useState([]);
    const [datasource, setDataSource] = useState([]);
    const [plazNum, setPlazNum] = useState(0);
    const [allNames, setAllNames] = useState([]);
    const [subjectsNo, setAllSubjectsNo] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState('checkScore');
    /*
    *
    * state end
    *
    * */
    const mkDataSource = () => {
        let allSource = [];
        if (HomeworkStatus) {
            for (const hkStatus of HomeworkStatus) {
                if (studentsStatusList[hkStatus]) {
                    allSource = allSource.concat(studentsStatusList[hkStatus]);
                }
            }
        }
        const source = (allSource || []).filter((item, i, a) => {
            return filterValues.every(ipt => {
                return (item?.account ?? '').includes(ipt) ||
                    (item?.name ?? '').includes(ipt) ||
                    (item?.labels ?? '').includes(ipt) ||
                    (item.startTime && GRADE_MAP[getStudentGrade(item.startTime)] || '').includes(ipt);
            });
        });
        setDataSource(source);
    };
    const HomeworkStatusChange = (e) => {
        const t = e.target.value;
        setHomeworkStatus(t.split(','));
    };
    const searchTable = (v) => {
        setFilterValues(v.split(/\s|,/ig));
    };
    const downStudentTime = async () => {
        try {
            let sidsAr = studentsStatusList.all.map(h => {
                return h.id;
            });
            await downStudentTimeApi(tid, [...new Set(sidsAr)].join(','));
        } catch (e) {
            console.log(e);
        }
    };
    const getAllStudentTimeList = async () => {
        try {
            setLoading(true);
            const _listStudentTime = await listStudentTimeApi(tid);
            for (const listStudentTimeElement of _listStudentTime) {
                listStudentTimeElement.subjectTimeAndAnswersList = delayeringSubject({ data: listStudentTimeElement.subjectTimeAndAnswers, subjectIdKey: 'subjectId' });
            }
            const __listStudentTime = {
                all: [],
                not_start: [],
                done: [],
                doing: [],
                expire: []
            };
            let _AllNames = [];
            let _AllSubjectsNo = {};
            let _AllTypes = {};
            for (const listStudentTimeElement of _listStudentTime) {
                const { status, subjectTimeAndAnswersList, typeDetailsMap } = listStudentTimeElement;
                listStudentTimeElement.totalTime = 0;
                listStudentTimeElement.checkScoreTotal = 0;
                listStudentTimeElement.scoreTotal = 0;
                listStudentTimeElement.subjects = [];
                listStudentTimeElement.types_Maps = [];
                listStudentTimeElement.NoList = [];
                _AllNames.push({
                    text: listStudentTimeElement.name,
                    value: listStudentTimeElement.name
                });
                for (const subjectTimeAndAnswersListElement of subjectTimeAndAnswersList) {
                    const { no, spendTime, checkScore, score, answer_img } = subjectTimeAndAnswersListElement;
                    _AllSubjectsNo[no] = { no, score };
                    listStudentTimeElement.subjects.push(subjectTimeAndAnswersListElement);
                    listStudentTimeElement[`no_${no}`] = subjectTimeAndAnswersListElement;
                    listStudentTimeElement.totalTime += spendTime;
                    listStudentTimeElement.checkScoreTotal += (checkScore === -1 ? 0 : checkScore);
                    listStudentTimeElement.scoreTotal += score;
                    listStudentTimeElement.NoList.push({
                        Noo: no,
                        No: String(no).replaceAll('.', '_'),
                        hasAnswer: Boolean(answer_img),
                        hasChecked: checkScore > -1,
                        hasError: checkScore < score
                    });
                }
                Object.assign(_AllTypes, typeDetailsMap);
                for (const typeDetailsMapElement of Object.values(typeDetailsMap)) {
                    const { type, time, score, checkScore } = typeDetailsMapElement;
                    const ratio = checkScore > -1 ? (checkScore / (time / 60000)).toFixed(2) : 'NA';
                    const typeItem = { time, score, checkScore, ratio };
                    listStudentTimeElement[`type_${type}`] = typeItem;
                    listStudentTimeElement.types_Maps.push(typeItem);
                }
                __listStudentTime[status].push(listStudentTimeElement);
                __listStudentTime.all.push(listStudentTimeElement);
            }
            setAllNames(_AllNames);
            setAllTypes(Object.values(_AllTypes));
            setAllSubjectsNo(Object.values(_AllSubjectsNo).map(t => {
                return { no: t.no, score: t.score };
            }).sort((t1, t2) => Number(t1.no) - Number(t2.no)));
            setstudentsStatusList(__listStudentTime);
            setPlazNum(_listStudentTime?.[0]?.subjectTimeAndAnswersList?.length);
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const updateTaskStatus = async (a) => {
        Modal.confirm({
            title: '?????????????????????' + (a.status === 'done' ? '??????' : '??????'),
            content: a.name + '(' + GRADE_MAP[getStudentGrade(a.startTime)] + ')',
            okText: '??????????????????',
            cancelText: '??????????????????',
            async onOk () {
                try {
                    await updateTaskStatusApi(a, tid);
                    await getAllStudentTimeList();
                } catch (e) {
                    Modal.error({ title: e.message });
                }
            }
        });
    };
    const columns = [
        {
            title: '??????',
            dataIndex: 'name',
            align: 'center',
            width: 66,
            filters: allNames,
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            render (t, a) {
                const labelsAr = ((a?.labels ?? '').replace(account, '').split(',')).filter(l => {
                    return l;
                });
                const grade = GRADE_MAP[getStudentGrade(a.startTime)];
                const labels = '(' + grade + '):' + labelsAr.join(',');
                return <Tooltip placement="top" title={labels} onClick={() => {
                    dispatch({ ViewStudentExamTask: a });
                    const { id } = a;
                    history.push(`/teacher/ViewStudentExamTask/${tid}/${id}`);
                }}>{t}</Tooltip>;
            },
            fixed: 'left'
        },
        ...(subjectsNo.map((l, index) => {
            const { no, score } = l;
            return {
                title: <><p>{no}</p><p>??????<Tag key={index} color={'green'}>{score}</Tag></p> </>,
                dataIndex: `no_${no}`,
                width: 100,
                sorter: (a, b) => {
                    const _filterType = filterType === 'time' ? 'spendTime' : (filterType === 'ratio' ? 'checkScore' : filterType);
                    return a[`no_${no}`]?.[_filterType] - b[`no_${no}`]?.[_filterType];
                },
                render (t, a) {
                    const { spendTime, checkScore } = t;
                    const { stid } = a;
                    return <div className={'detail'} onClick={() => {
                        dispatch({
                            addSubjectSignModalData: Object.assign({}, t, { no, sTid: stid })
                        });
                    }}>
                        <Tag key={index} color={'blue'}>{smTr(spendTime)}</Tag><Tag color={'green'}>{checkScore}</Tag>
                    </div>;
                }
            };
        })),
        ...(allTypes.map((a, index) => {
            const { type, num, score, ratio } = a;
            return {
                title: <div>
                    <p>{type}</p>
                    <p>
                        <Tag color={'blue'}>{num}</Tag>
                        <Tag color={'orange'}>{score}</Tag>
                    </p>
                </div>,
                dataIndex: `type_${type}`,
                width: 180,
                sorter: (a, b) => {
                    return a[`type_${type}`]?.[filterType] - b[`type_${type}`]?.[filterType];
                },
                render (t) {
                    const { time, checkScore, ratio } = t;
                    return <>
                        <Tag color={'volcano'}>{smTr(time)}</Tag>
                        <Tag color={'red'}>{checkScore}</Tag>
                        <Tag color={'blue'}>{ratio === 999999 ? 'NA' : `${ratio}/min`}</Tag>
                    </>;
                }
            };
        })),
        {
            title: '?????????',
            dataIndex: 'totalTime',
            width: 90,
            sorter: (a, b) => a.totalTime - b.totalTime,
            render (t) {
                return <Tag color={'blue'}>{smTr(t)}</Tag>;
            },
            fixed: 'right'
        },
        {
            title: '??????',
            dataIndex: 'checkScoreTotal',
            width: 100,
            sorter: (a, b) => a.checkScoreTotal - b.checkScoreTotal,
            render (t, a) {
                const { checkScoreTotal, scoreTotal } = a;
                return <Tag color={'green'}>{checkScoreTotal} / {scoreTotal}</Tag>;
            },
            fixed: 'right'
        },
        {
            title: '????????????',
            dataIndex: 'doneTime',
            width: 150,
            sorter: (a, b) => a.doneTime - b.doneTime,
            render (t, a, i) {
                return t && formatDateHw(t) || 0;
            },
            fixed: 'right'
        },
        {
            title: '??????',
            dataIndex: 'status',
            align: 'center',
            width: 132,
            render (t, a, i) {
                return <div>
                    {a.doneTime ? <Tooltip placement="top" title={a.doneTime}>{HOMEWORK_STATUS_MAP[t]}</Tooltip> : HOMEWORK_STATUS_MAP[t]}
                    {(t === 'done' || t === 'doing') && <Button type={'primary'} style={{ marginLeft: '8px' }} size={'small'} onClick={() => updateTaskStatus(a)}>{t === 'done' ? '??????' : '??????'}</Button>}
                </div>;
            },
            fixed: 'right'
        }
    ];
    useEffect(() => {
        if (tid) {
            (async () => {
                await getAllStudentTimeList();
            })();
        } else {
            history.push('/teacher/homework');
        }
        dispatch({ currentTeacherNavKey: 'homework' });
    }, []);
    useEffect(() => {
        mkDataSource();
    }, [filterValues, HomeworkStatus, studentsStatusList]);
    return <div className={'g-viewHomeworkDetail'}>
        <Affix>
            <div className={'g-homeworkViewDoneSearch'}>
                <div className={'search'}>
                    <Search className={'searchItem'} placeholder={'??????????????????????????????'} onSearch={searchTable} />
                    <span>??? {datasource.length} ?????????</span>
                    <span style={{ padding: '0px 8px 0 16px' }}>????????????</span>
                    <Radio.Group
                        options={[
                            { label: '??????', value: 'checkScore' },
                            { label: '??????', value: 'time' },
                            { label: '?????????', value: 'ratio' }
                        ]}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                        }}
                        value={filterType}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div className={'operate'}>
                    <h2>{tname} <Tag color={'blue'}>{ename}</Tag></h2>
                    <Radio.Group className={'status'} buttonStyle="solid" value={HomeworkStatus.join(',')} onChange={HomeworkStatusChange}>
                        <Radio.Button value="all">??????</Radio.Button>
                        <Radio.Button value="done">?????????</Radio.Button>
                        <Radio.Button value="doing,not_start">?????????</Radio.Button>
                        <Radio.Button value="expire">?????????</Radio.Button>
                    </Radio.Group>
                    <Button danger onClick={downStudentTime}>?????? Excel</Button>
                </div>
            </div>
        </Affix>
        <Table columns={columns}
               size="small"
               dataSource={datasource || []}
               rowKey={'id'}
               bordered
               loading={loading}
               scroll={{ x: plazNum + 6 * 66, y: clientHeight - 185 }}
               pagination={false} />
        <AddSignModal type={ckMark} callback={getAllStudentTimeList} />
    </div>;
}
