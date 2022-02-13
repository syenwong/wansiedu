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
import { Button, Modal, Tooltip, Table, Form, Input, Select } from 'antd';
import { formatDateHw, smTr } from '../../../../service/utils';
import { useHistory } from 'react-router-dom';
import { GlobalTop } from '../../../../globalComponents/GlobalTop';
import { FileAddOutlined } from '@ant-design/icons';
import { listStudentTimeByExamApi, listStudentTimeByExamDownApi } from '../../../../service/api/teacher/exam';
import { HOMEWORK_STATUS_MAP } from '../../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../../store';

const { Option } = Select;
const { Item, useForm } = Form;
export function ViewExamDoData (props) {
    const { state } = useContext(EDU_CONTEXT);
    const { match: { params: { id: eid, name: ename } } } = props;
    const [formDoDone] = useForm();
    const history = useHistory();
    const [DataSource, setDataSource] = useState([]);
    const [AllStudents, setAllStudents] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [plazNum, setPlazNum] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allNames, setAllNames] = useState([]);
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
        let key = 0;
        setLoading(true);
        try {
            const Exams = await listStudentTimeByExamApi(eid);
            const _AllStudents = [];
            const _AllNames = [];
            const _Tasks = [];
            for (const exam of Exams) {
                const { task, studentWithTimes } = exam;
                _Tasks.push(task);
                for (const student of studentWithTimes) {
                    student.task = task;
                    student.totalTime = 0;
                    const subjectNum = student.subjectNum;
                    for (let i = 0; i < subjectNum; i++) {
                        let spendTime = student.times[i].spendTime;
                        student[`subjectTime_${i}`] = spendTime;
                        student.totalTime += spendTime;
                    }
                    student.key = key++;
                    _AllStudents.push(student);
                    _AllNames.push({
                        text: student.name,
                        value: student.name
                    });
                }
            }
            setPlazNum(_AllStudents[0]?.subjectNum);
            setAllStudents(_AllStudents);
            setAllNames(_AllNames);
            setTasks(_Tasks);
            setDataSource(_AllStudents);
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const columns = [
        {
            title: 'N',
            width: 45,
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
            width: 72,
            filters: allNames,
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
            width: 72,
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
            width: 72,
            render (t, a, i) {
                return HOMEWORK_STATUS_MAP[t];
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
    return <div className={'g-homework'}>
        <GlobalTop title={'作业管理'} />
        <div className={'g-operation'}>
            <div className={'optionwrap'}>
                <Button icon={<FileAddOutlined />} style={{ marginRight: '16px' }} onClick={() => {
                    history.push('/teacher/ExamPaper');
                }}>返回试卷列表</Button>
            </div>
        </div>
        <div className={'g-content'}>
            <div className={'g-homeworkStatusSwitch'}>
                <h2 style={{ margin: '0 0 0 16px', fontSize: '16px' }}>{ename}</h2>
            </div>
            <div className={'g-searchForm'}>
                <Form name={'formDoDone'} form={formDoDone} onFinish={filterData}>
                    <Item name={'task'}>
                        <Select style={{ width: 240 }} placeholder={'请选择布置作业名称'}>
                            <Option value="">全部</Option>
                            {Tasks.map((T, index) => {
                                return <Option key={index} value={T.id}>{T.name}</Option>;
                            })}
                        </Select>
                    </Item>
                    <Item name={'name'}>
                        <Input style={{ width: 150 }} placeholder={'搜索的学生姓名'} />
                    </Item>
                    <Item name={'labels'}>
                        <Input style={{ width: 150 }} placeholder={'搜索的学生标签分类'} />
                    </Item>
                    <Item name={'status'}>
                        <Select style={{ width: 200 }} placeholder={'请选择完成状态'}>
                            <Option value="">全部</Option>
                            <Option value="done">完成</Option>
                            <Option value="doing">做题中</Option>
                            <Option value="expire">过期</Option>
                        </Select>
                    </Item>
                    <Button style={{ marginRight: '16px' }} type={'primary'} htmlType={'submit'}>筛选</Button>
                    <Button style={{ marginRight: '16px' }} type={'primary'} onClick={resetDataSource}>重置</Button>
                </Form>
                <div style={{ padding: '0 16px' }}>共 <b style={{ fontWeight: 700 }}>{AllStudents.length}</b> 条数据</div>
                <Button danger onClick={downStudentTime}>导出 Excel</Button>
            </div>
            <Table columns={columns}
                   rowSelection={{
                       type: 'Checkbox',
                       ...rowSelection
                   }}
                   loading={loading}
                   size="small"
                   dataSource={DataSource || []}
                   bordered
                   scroll={{ x: plazNum + 6 * 72 }}
                   pagination={false} />
        </div>
    </div>;
};
