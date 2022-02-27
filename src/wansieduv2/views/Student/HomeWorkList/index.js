/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/9.
 * Copyright 2021/9/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/9
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { Tabs, Input } from 'antd';
import { useStudentHandlers } from '../../../Controller/useStudentHandlers';
import { TableTask } from './TableTask';
import { GlobalTop } from '../../../globalComponents/GlobalTop';
import { EDU_CONTEXT } from '../../../store';

const { Search } = Input;
const { TabPane } = Tabs;
export function HomeWorkList () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { studentTaskListOrigin } = state;
    const actionHandler = useStudentHandlers();
    const onSearch = (ipt = '', _studentTaskListOrigin = studentTaskListOrigin) => {
        let _studentTaskList = {};
        if (ipt) {
            for (const entry of Object.entries(_studentTaskListOrigin)) {
                const [dataType, list] = entry;
                _studentTaskList[dataType] = list.filter(item => {
                    return (item?.name ?? '').includes(ipt) ||
                        (item?.tname ?? '').includes(ipt) ||
                        (item?.exmaName ?? '').includes(ipt) ||
                        (item?.labels ?? '').includes(ipt);
                });
            }
        } else {
            _studentTaskList = _studentTaskListOrigin;
        }
        dispatch({
            studentTaskList: _studentTaskList
        });
    };
    useEffect(() => {
        (async () => {
            const r = await actionHandler('getTaskList');
            onSearch('', r);
        })();
        
    }, []);
    return <>
        <GlobalTop />
        <div className={'g-TabList g-studentHomeWork posr'}>
            <Search placeholder={'过滤搜索作业名称，试卷名称，试卷标签'} className={'g-TableTaskSearch'} onSearch={(v) => {
                onSearch(v);
            }} />
            <Tabs type="card">
                <TabPane tab="未完成" key="1">
                    <div className={'g-hwcontent'}>
                        <TableTask dataType={['notStart', 'doing']} operateName={'doing'} />
                    </div>
                </TabPane>
                <TabPane tab="已完成" key="3">
                    <div className={'g-hwcontent'}>
                        <TableTask dataType={'done'} operateName={'done'} />
                    </div>
                </TabPane>
                <TabPane tab="过期" key="4">
                    <div className={'g-hwcontent'}>
                        <TableTask dataType={'expire'} operateName={'expire'} />
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </>;
}
