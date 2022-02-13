/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/23.
 * Copyright 2021/9/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/23
 * @version */
import React from 'react';
import { GlobalTop } from '../../../../globalComponents/GlobalTop';
import { HomeWorkList } from './HomeWorkList';
import { HomeWorkIndexHeader } from './HomeWorkIndexHeader';

export function HomeWork () {
    return <div className={'g-homework'}>
        <GlobalTop title={'作业管理'} />
        <HomeWorkIndexHeader />
        <div className={'g-content'}>
            <HomeWorkList />
        </div>
    </div>;
}
