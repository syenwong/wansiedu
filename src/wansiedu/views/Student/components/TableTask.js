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
import { Table, Button, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useActionHandlerMaps } from '../../../globalComponents/useActionHandlerMaps';
import { formatDateHw } from '../../../service/utils';

const { Search } = Input;
export function TableTask (props = 'doing') {
    const history = useHistory();
    const { dataType } = props;
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { studentTaskList } = state;
    const [searchData, setSearchData] = useState([]);
    const actionHandler = useActionHandlerMaps();
    const maps = {
        doing (a) {
            return <div className={'taskOption'}>
                <Button type={'primary'} size={'middle'} onClick={() => {
                    dispatch({
                        currentTask: a
                    });
                    history.push(`/student_do`);
                }}>做作业</Button>
            </div>;
        },
        done (a) {
            return <div>
                <span style={{ padding: '0 16px 0 0 ' }}>已完成</span>
                {(new Date().getTime() - new Date(a.doneTime.replace(/-/ig, '/')) > 60 * 60 * 1000) ?
                    <Button type={'primary'} onClick={() => {
                        actionHandler('viewExaPaper', { id: a.id, name: a.examName, labels: a.labels }, 'student');
                    }}>查看试卷</Button> : <Button disabled={true}>完成1小时后查看</Button>}
            </div>;
        },
        expire (a) {
            return <div>过期</div>;
        }
    };
    const operationMap = (a) => {
        return maps[dataType](a);
    };
    const onSearch = (values) => {
        setSearchData(values.split(/,|\s/ig));
    };
    const filterData = () => {
        return (studentTaskList && studentTaskList[dataType] || []).filter(item => {
            return searchData.every((ipt) => {
                return (item?.name ?? '').includes(ipt) ||
                    (item?.exmaName ?? '').includes(ipt) ||
                    (item?.labels ?? '').includes(ipt);
            });
        });
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
            dataIndex: 'name',
            width: '15%'
        },
        {
            title: '试卷名称',
            dataIndex: 'examName',
            width: '15%'
        },
        {
            title: '布置老师',
            dataIndex: 'tname',
            width: '8%'
        },
        {
            title: '布置时间',
            dataIndex: 'createTime',
            width: '15%',
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
                    return '作业时段';
                }
            },
            width: '25%',
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
                    return <span>{formatDateHw(c.doneTime)}</span>;
                } else {
                    return <span>{formatDateHw(c.startTime)} 至 {formatDateHw(c.endTime)}</span>;
                }
            }
        },
        {
            title: '作业完成情况',
            render (t, a, i) {
                return operationMap(a);
            }
        }
    ];
    return <div className={'g-studentHomework'}>
        <Search placeholder={'过滤搜索作业名称，试卷名称，试卷标签'} onSearch={onSearch} style={{ width: '400px', marginBottom: '8px' }} />
        <Table size={'small'} rowKey={'id'} columns={columns} dataSource={filterData()} pagination={false} />
    </div>;
}
