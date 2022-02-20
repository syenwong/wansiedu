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
import { Button, Modal, Tooltip, Table, Form, Input, Select, Tag, Radio } from 'antd';
import { delayeringSubject, formatDateHw, getStudentGrade, smTr } from '../../../service/utils';
import { useHistory } from 'react-router-dom';
import { FileAddOutlined } from '@ant-design/icons';
import { listStudentTimeByExamApi, listStudentTimeByExamDownApi } from '../../../service/api/teacher/exam';
import { GRADE_MAP, HOMEWORK_STATUS_MAP } from '../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../store';
import { DoDataViewAnswer } from '../../../globalComponents/DoDataViewAnswer';

const { Option } = Select;
const { Item, useForm } = Form;
export function ViewExamDoData (props) {
    const { state: { currentExamPaper, account, clientHeight }, dispatch } = useContext(EDU_CONTEXT);
    const { name: ename, id: eid } = currentExamPaper || {};
    const [formDoDone] = useForm();
    const history = useHistory();
    const [DataSource, setDataSource] = useState([]);
    const [AllStudents, setAllStudents] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allNames, setAllNames] = useState([]);
    const [subjectsNo, setAllSubjectsNo] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [viewAnswerVisible, setViewAnswerVisible] = useState(false);
    const [viewAnswerContent, setViewAnswerContent] = useState(null);
    const [filterType, setFilterType] = useState('checkScore');
    const downStudentTime = async () => {
        try {
            let sidsAr = [];
            if (selectedRow.length === 0) {
                sidsAr = AllStudents.map(h => {
                    return h.id;
                });
            } else {
                sidsAr = selectedRow.map(r => r.id);
            }
            await listStudentTimeByExamDownApi(eid, [...new Set(sidsAr)].join(','), ename);
            setSelectedRowKeys([]);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const filterData = async () => {
        const { task, name, labels, status } = formDoDone.getFieldsValue();
        let _dataSource = Object.assign([], AllStudents);
        if (task) {
            _dataSource = _dataSource.filter((d, i) => {
                return d.task.id === task;
            });
        }
        if (labels) {
            const labelsAr = labels.split(/\s/ig);
            _dataSource = _dataSource.filter((d, i) => {
                return labelsAr.every(l => {
                    return d.labels.includes(l);
                });
            });
        }
        if (name) {
            _dataSource = _dataSource.filter((d, i) => {
                return d.name.includes(name);
            });
        }
        if (status) {
            _dataSource = _dataSource.filter((d, i) => {
                return d.status === status;
            });
        }
        setDataSource(_dataSource);
    };
    const resetDataSource = () => {
        formDoDone.resetFields();
        setDataSource(AllStudents);
    };
    const getAllStudentTimeList = async () => {
        setLoading(true);
        try {
            const Exams = await listStudentTimeByExamApi(eid);
            const _AllStudents = [];
            const _AllNames = [];
            const _Tasks = [];
            const _AllSubjectsNo = {};
            const _AllTypes = {};
            for (const exam of Exams) {
                const { task, studentWithTimes } = exam;
                _Tasks.push(task);
                for (const student of studentWithTimes) {
                    student.subjectTimeAndAnswersList = delayeringSubject({ data: student.subjectTimeAndAnswers, subjectIdKey: 'subjectId' });
                    student.task = task;
                    student.totalTime = 0;
                    student.checkScoreTotal = 0;
                    student.scoreTotal = 0;
                    _AllNames.push({
                        text: student.name,
                        value: student.name
                    });
                    for (const subjectTimeAndAnswersListElement of student.subjectTimeAndAnswersList) {
                        const { no, spendTime, checkScore, score } = subjectTimeAndAnswersListElement;
                        _AllSubjectsNo[no] = { no, score };
                        student[`no_${no}`] = subjectTimeAndAnswersListElement;
                        student.totalTime += spendTime;
                        student.checkScoreTotal += (checkScore === -1 ? 0 : checkScore);
                        student.scoreTotal += score;
                    }
                    for (const typeDetailsMapElement of Object.values(student.typeDetailsMap)) {
                        const { type, time, score, checkScore } = typeDetailsMapElement;
                        const ratio = checkScore > -1 ? (checkScore / (time / 60000)).toFixed(2) : 999999;
                        student[`type_${type}`] = { time, score, checkScore, ratio };
                    }
                    Object.assign(_AllTypes, student.typeDetailsMap);
                    _AllStudents.push(student);
                }
            }
            setAllNames(_AllNames);
            setAllTypes(Object.values(_AllTypes));
            setAllSubjectsNo(Object.values(_AllSubjectsNo).map(t => {
                return { no: t.no, score: t.score };
            }));
            setAllStudents(_AllStudents);
            setTasks(_Tasks);
            setDataSource(_AllStudents);
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            width: 72,
            filters: allNames,
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            render (t, a) {
                const labelsAr = ((a?.labels ?? '').replace(account, '').split(',')).filter(l => {
                    return l;
                });
                const grade = GRADE_MAP[getStudentGrade(a.startTime)];
                const labels = '(' + grade + ')' + (labelsAr.join(',') ? ':' + labelsAr.join(',') : '');
                return <Tooltip placement="top" title={labels}>{t}</Tooltip>;
            },
            fixed: 'left'
        },
        ...(subjectsNo.map((l, index) => {
            const { no, score } = l;
            return {
                title: <><p style={{ fontWeight: 700 }}>{no}</p>
                    <p>总分<Tag color={'green'}>{score}</Tag></p> </>,
                dataIndex: `no_${no}`,
                width: 100,
                align: 'center',
                sorter: (a, b) => {
                    const _filterType = filterType === 'time' ? 'spendTime' : (filterType === 'ratio' ? 'checkScore' : filterType);
                    return a[`no_${no}`]?.[_filterType] - b[`no_${no}`]?.[_filterType];
                },
                render (t, a) {
                    const { spendTime, score, checkScore } = t;
                    return <div className={'detail'} onClick={() => {
                        setViewAnswerVisible(true);
                        setViewAnswerContent(t);
                    }}>
                        <Tag color={'blue'}>{smTr(spendTime)}</Tag><Tag color={'green'}>{checkScore}</Tag>
                    </div>;
                }
            };
        })),
        ...(allTypes.map((t, index) => {
            const { type, num, score, checkScore } = t;
            return {
                title: <div><p>{type}</p><p><Tag color={'blue'}>{num}</Tag><Tag color={'orange'}>{score}</Tag></p></div>,
                dataIndex: `type_${type}`,
                width: 180,
                sorter: (a, b) => {
                    return a[`type_${type}`]?.[filterType] - b[`type_${type}`]?.[filterType];
                },
                render (t, a, i) {
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
            title: '总时间',
            dataIndex: 'totalTime',
            width: 90,
            sorter: (a, b) => a.totalTime - b.totalTime,
            render (t) {
                return <Tag color={'blue'}>{smTr(t)}</Tag>;
            },
            fixed: 'right'
        },
        {
            title: '总分',
            dataIndex: 'checkScoreTotal',
            width: 90,
            sorter: (a, b) => a.checkScoreTotal - b.checkScoreTotal,
            render (t, a) {
                const { checkScoreTotal, scoreTotal } = a;
                return <Tag color={'green'}>{checkScoreTotal}/{scoreTotal}</Tag>;
            },
            fixed: 'right'
        },
        {
            title: '完成时间',
            dataIndex: 'doneTime',
            width: 135,
            sorter: (a, b) => a.doneTime - b.doneTime,
            render (t, a, i) {
                return t && formatDateHw(t) || 0;
            },
            fixed: 'right'
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 72,
            render (t, a, i) {
                return <div>
                    {a.doneTime ? <Tooltip placement="top" title={a.doneTime}>{HOMEWORK_STATUS_MAP[t]}</Tooltip> : HOMEWORK_STATUS_MAP[t]}
                </div>;
            },
            fixed: 'right'
        }
    ];
    useEffect(() => {
        if (eid) {
            getAllStudentTimeList();
        } else {
            history.push('/teacher/examPaper');
        }
        dispatch({ currentTeacherNavKey: 'examPaper' });
    }, []);
    return <div className={'g-homeworkviewdodata'}>
        <div className={'g-searchForm g-viewdoDataHeader'}>
            <div className={'optionwrap'}>
                <Form name={'formDoDone'} form={formDoDone} onFinish={filterData}>
                    <Item name={'task'}>
                        <Select style={{ width: 200 }} placeholder={'作业名称'}>
                            <Option value="">全部</Option>
                            {Tasks.map((T, index) => {
                                return <Option key={index} value={T.id}>{T.name}</Option>;
                            })}
                        </Select>
                    </Item>
                    <Item name={'name'}>
                        <Input style={{ width: 100 }} placeholder={'学生姓名'} />
                    </Item>
                    <Item name={'labels'}>
                        <Input style={{ width: 100 }} placeholder={'学生分类'} />
                    </Item>
                    {/*<Item name={'status'}>*/}
                    {/*    <Select style={{ width: 100 }} placeholder={'完成状态'}>*/}
                    {/*        <Option value="">全部</Option>*/}
                    {/*        <Option value="done">完成</Option>*/}
                    {/*        <Option value="doing">做题中</Option>*/}
                    {/*        <Option value="expire">过期</Option>*/}
                    {/*    </Select>*/}
                    {/*</Item>*/}
                    <Button style={{ marginRight: '4px' }} type={'primary'} htmlType={'submit'}>筛选</Button>
                    <Button style={{ marginRight: '4px' }} type={'primary'} onClick={resetDataSource}>重置</Button>
                </Form>
                <div style={{ padding: '0 4px' }}>共 <b style={{ fontWeight: 700 }}>{AllStudents.length}</b> 条数据</div>
                <span style={{ padding: '0px 4px 0 4px' }}>排序选项</span>
                <Radio.Group
                    options={[
                        { label: '分数', value: 'checkScore' },
                        { label: '时间', value: 'time' },
                        { label: '得分率', value: 'ratio' }
                    ]}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                    }}
                    value={filterType}
                    optionType="button"
                    buttonStyle="solid"
                />
            </div>
            <div className="export">
                <h2>{ename}</h2>
                <Button danger onClick={downStudentTime}>导出 Excel</Button>
            </div>
        </div>
        <Table columns={columns}
               loading={loading}
               size="small"
               rowKey={'id'}
               className={'viewExamDoDataTable'}
               dataSource={DataSource || []}
               bordered
               scroll={{ x: (allTypes.length + subjectsNo.length) + 6 * 72, y: clientHeight - 185 }}
               pagination={false} />
        <Modal maskClosable={false}
               title={<div>{ename}</div>}
               width={'auto'}
               closable={true}
               footer={null}
               onCancel={() => setViewAnswerVisible(false)}
               visible={viewAnswerVisible}>
            <DoDataViewAnswer modalHeight={clientHeight - 200} viewAnswerContent={viewAnswerContent} />
        </Modal>
    </div>;
}
