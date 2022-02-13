/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/25.
 * Copyright 2021/9/25 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/25
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { EDU_CONTEXT } from '../../../store';
import { Table, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatDateHw } from '../../../service/utils';

export function TableTask (props) {
    const history = useHistory();
    const { dataType, operateName } = props;
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { studentTaskList } = state;
    const maps = {
        doing (a) {
            return <div className={'taskOption'}>
                <Button type={'primary'} size={'middle'} onClick={() => {
                    dispatch({
                        currentTask: a
                    });
                    history.push(`/student/doHomework`);
                }}>答题</Button>
            </div>;
        },
        done (a) {
            return <Button type={'primary'} onClick={async () => {
                dispatch({
                    currentTask: a
                });
                history.push(`/student/viewTask/${a.id}`);
            }}>查看试卷</Button>;
        },
        expire (a) {
            return <div>
                <Tag>已过期</Tag>
                <Button type={'primary'} onClick={async () => history.push(`/student/viewTask/${a.id}`)}>查看试卷</Button>
            </div>;
        }
    };
    const operationMap = (a) => {
        return maps?.[operateName]?.(a);
    };
    const filterData = () => {
        let _studentTaskList = [];
        if (studentTaskList) {
            if (typeof dataType === 'string' && studentTaskList[dataType]) {
                _studentTaskList = studentTaskList[dataType];
            }
            if (Array.isArray(dataType) && studentTaskList[dataType[0]] && studentTaskList[dataType[1]]) {
                _studentTaskList = [...studentTaskList[dataType[0]], ...studentTaskList[dataType[1]]];
            }
        }
        return _studentTaskList;
    };
    const columns = [
        {
            title: 'N',
            width: 42,
            align: 'center',
            render (t, c, i) {
                return i + 1;
            }
        },
        {
            title: '作业名称',
            dataIndex: 'name'
        },
        {
            title: '试卷名称',
            dataIndex: 'examName'
        },
        {
            title: '布置老师',
            dataIndex: 'tname',
            width: 110
        },
        {
            title: '布置时间',
            dataIndex: 'createTime',
            width: 150,
            sorter (a, b) {
                return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
            },
            render (t) {
                return formatDateHw(t);
            }
        },
        {
            title () {
                if (dataType === 'done') {
                    return '完成时间';
                } else {
                    return '有效期';
                }
            },
            width: 200,
            dataIndex: 'startTime',
            sorter: (a, b) => {
                if (dataType === 'done') {
                    return new Date(a.doneTime).getTime() - new Date(b.doneTime).getTime();
                } else {
                    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                }
            },
            render (t, c, i) {
                if (dataType === 'done') {
                    return <span>{c.doneTime ? formatDateHw(c.doneTime) : '-'}</span>;
                } else {
                    return <span>{formatDateHw(c.startTime, 'YYYY-MM-DD')} 至 {formatDateHw(c.endTime, 'YYYY-MM-DD')}</span>;
                }
            }
        },
        {
            title () {
                if (dataType === 'done') {
                    return '开始时间';
                } else {
                    return '时长';
                }
            },
            dataIndex: 'limitTime',
            width: 200,
            render (t, a, i) {
                if (dataType === 'done') {
                    return <span>{a.realStartTime ? formatDateHw(a.realStartTime) : '-'}</span>;
                } else {
                    return t / 60 + ' 分钟';
                }
            }
        },
        {
            title: '作业完成情况',
            width: 220,
            render (t, a, i) {
                return operationMap(a);
            }
        }
    ];
    return <div className={'g-studentHomework'}>
        <Table size={'small'} rowKey={'id'} columns={columns} dataSource={filterData()} pagination={false} />
    </div>;
}
