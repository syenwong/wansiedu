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
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useActionHandlerMaps } from '../../../globalComponents/useActionHandlerMaps';
import { TableTask } from './TableTask';

const { TabPane } = Tabs;
export function HomeWorkList () {
    const actionHandler = useActionHandlerMaps();
    useEffect(() => {
        actionHandler('getTaskList');
    }, []);
    return <div className={'g-TabList'}>
        <Tabs type="card">
            <TabPane tab="未完成" key="1">
                <div className={'g-hwcontent'}>
                    <TableTask dataType={'doing'} />
                </div>
            </TabPane>
            <TabPane tab="已完成" key="2">
                <div className={'g-hwcontent'}>
                    <TableTask dataType={'done'} />
                </div>
            </TabPane>
            <TabPane tab="过期" key="3">
                <div className={'g-hwcontent'}>
                    <TableTask dataType={'expire'} />
                </div>
            </TabPane>
        </Tabs>
    </div>;
}
