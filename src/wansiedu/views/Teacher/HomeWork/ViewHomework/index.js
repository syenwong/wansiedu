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
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Table, Radio, Input } from 'antd';
import { getStudentGrade, formatDateHw, smTr } from '../../../../service/utils';
import { useHistory } from 'react-router-dom';
import { GlobalTop } from '../../../../globalComponents/GlobalTop';
import { FileAddOutlined } from '@ant-design/icons';
import { TeacherRightNav } from '../../_common/TeacherRightNav';
import { downStudentTimeApi, listStudentTimeApi, updateTaskStatusApi } from '../../../../service/api/teacher/homework';
import { HOMEWORK_STATUS_MAP } from '../../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../../store';

const { Search } = Input;
export function ViewHomework (props) {
    const { state } = useContext(EDU_CONTEXT);
    const { match: { params: { id: tid, name: tname, ename } } } = props;
    const history = useHistory();
    const [studentsStatusList, setstudentsStatusList] = useState({ done: [], doing: [], expire: [] });
    const [HomeworkStatus, setHomeworkStatus] = useState('all');
    const [filterValues, setFilterValues] = useState([]);
    const [datasource, setDataSource] = useState([]);
    const [plazNum, setPlazNum] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [allNames, setAllNames] = useState([]);
    const mkDataSource = () => {
        let allSource = (HomeworkStatus && studentsStatusList[HomeworkStatus]) ? studentsStatusList[HomeworkStatus] : [];
        const source = (allSource || []).filter((item, i, a) => {
            return filterValues.every(ipt => {
                return (item?.account ?? '').includes(ipt) ||
                    (item?.name ?? '').includes(ipt) ||
                    (item?.labels ?? '').includes(ipt) ||
                    (item.startTime && getStudentGrade(item.startTime) || '').includes(ipt);
            });
        });
        setDataSource(source);
    };
    const HomeworkStatusChange = (e) => {
        const t = e.target.value;
        setHomeworkStatus(t);
    };
    const searchTable = (v) => {
        setFilterValues(v.split(/\s|,/ig));
    };
    const downStudentTime = async () => {
        try {
            let sidsAr = [];
            if (selectedRow.length === 0) {
                sidsAr = studentsStatusList.all.map(h => {
                    return h.id;
                });
            } else {
                sidsAr = selectedRow.map(r => r.id);
            }
            await downStudentTimeApi(tid, [...new Set(sidsAr)].join(','));
            setSelectedRowKeys([]);
        } catch (e) {
            console.log(e);
        }
    };
    const getAllStudentTimeList = async () => {
        try {
            const _listStudentTime = await listStudentTimeApi(tid);
            const __listStudentTime = {
                all: [],
                done: [],
                doing: [],
                expire: []
            };
            let _AllNames = [];
            for (const listStudentTimeElement of _listStudentTime) {
                const { status, times, subjectNum } = listStudentTimeElement;
                listStudentTimeElement.totalTime = 0;
                _AllNames.push({
                    text: listStudentTimeElement.name,
                    value: listStudentTimeElement.name
                });
                for (let i = 0; i < subjectNum; i++) {
                    let spendTime = times[i].spendTime;
                    listStudentTimeElement[`subjectTime_${i}`] = spendTime;
                    listStudentTimeElement.totalTime += spendTime;
                }
                __listStudentTime[status].push(listStudentTimeElement);
                __listStudentTime.all.push(listStudentTimeElement);
            }
            setAllNames(_AllNames);
            setstudentsStatusList(__listStudentTime);
            setPlazNum(_listStudentTime[0].subjectNum);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const updateTaskStatus = async (a) => {
        Modal.confirm({
            title: '确定修改状态为' + (a.status === 'done' ? '重做' : '完成'),
            content: a.name + ':' + getStudentGrade(a.startTime),
            okText: '确定修改状态',
            cancelText: '我好像点错了',
            async onOk () {
                try {
                    await updateTaskStatusApi(a, tid);
                    getAllStudentTimeList();
                } catch (e) {
                    Modal.error({ title: e.message });
                }
            }
        });
    };
    const columns = [
        {
            title: 'N',
            width: 42,
            align: 'center',
            render (t, c, i) {
                return i + 1;
            },
            fixed: 'left'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            width: 66,
            filters: allNames,
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            render (t, a, i) {
                const labelsAr = ((a?.labels ?? '').replace(state.account, '').split(',')).filter(l => {
                    return l;
                });
                const labels = labelsAr.join(' | ');
                return <Tooltip placement="top" title={labels}>{t}</Tooltip>;
            },
            fixed: 'left'
        },
        ...((new Array(plazNum).fill(0)).map((l, index) => {
            return {
                title: index + 1,
                dataIndex: `subjectTime_${index}`,
                width: 72,
                sorter: (a, b) => {
                    return a[`subjectTime_${index}`] - b[`subjectTime_${index}`];
                },
                render (t, a, i) {
                    return smTr(t);
                }
            };
        })),
        {
            title: 'Total',
            dataIndex: 'totalTime',
            width: 66,
            sorter: (a, b) => a.totalTime - b.totalTime,
            render (t, a, i) {
                return smTr(t);
            },
            fixed: 'right'
        },
        {
            title: '完成时间',
            dataIndex: 'doneTime',
            width: 150,
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
            width: 132,
            render (t, a, i) {
                return <div>
                    {a.doneTime ? <Tooltip placement="top" title={a.doneTime}>{HOMEWORK_STATUS_MAP[t]}</Tooltip> : HOMEWORK_STATUS_MAP[t]}
                    {(t === 'done' || t === 'doing') && <Button type={'primary'} style={{ marginLeft: '8px' }} size={'small'} onClick={() => updateTaskStatus(a)}>{t === 'done' ? '重做' : '完成'}</Button>}
                </div>;
            },
            fixed: 'right'
        }
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: (_selectedRowKeys, _selectedRow) => {
            setSelectedRow(_selectedRow);
            setSelectedRowKeys(_selectedRowKeys);
        }
    };
    useEffect(() => {
        getAllStudentTimeList();
    }, []);
    useEffect(() => {
        mkDataSource();
    }, [filterValues, HomeworkStatus, studentsStatusList]);
    return <div className={'g-homework'}>
        <GlobalTop title={'作业管理'} />
        <div className={'g-operation'}>
            <div className={'optionwrap'}>
                <Button icon={<FileAddOutlined />} style={{ marginRight: '16px' }} onClick={() => {
                    history.push('/teacher/homework');
                }}>返回作业列表</Button>
                <Button icon={<FileAddOutlined />} type="primary" onClick={() => {
                    history.push('/teacher/homework_edit');
                }}>布置作业</Button>
            </div>
            <TeacherRightNav currentKey={'homework'} />
        </div>
        <div className={'g-content'}>
            <div className={'g-homeworkStatusSwitch'}>
                <Radio.Group buttonStyle="solid" value={HomeworkStatus} onChange={HomeworkStatusChange}>
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="done">已完成</Radio.Button>
                    <Radio.Button value="doing">未完成</Radio.Button>
                    <Radio.Button value="expire">已失效</Radio.Button>
                </Radio.Group>
                <h2 style={{ margin: '0 0 0 16px', fontSize: '16px' }}>{tname} | {ename}</h2>
            </div>
            <div className={'g-homeworkViewDoneSearch'}>
                <Search style={{ width: 300 }} placeholder={'学生姓名、标签、年级，可以空格隔开联合搜索'} onSearch={searchTable} />
                <>
                    <div style={{ padding: '0 16px' }}>共 <b style={{ fontWeight: 700 }}>{datasource.length}</b> 条数据</div>
                    <Button danger onClick={downStudentTime}>导出 Excel</Button>
                </>
            </div>
            <Table columns={columns}
                   rowSelection={{
                       type: 'Checkbox',
                       ...rowSelection
                   }}
                   size="small"
                   dataSource={datasource || []}
                   rowKey={'id'}
                   bordered
                   scroll={{ x: plazNum + 6 * 66 }}
                   pagination={false} />
        </div>
    </div>;
}
