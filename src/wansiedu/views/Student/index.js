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
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { GlobalTop } from '../../globalComponents/GlobalTop';
import { HomeWorkList } from './components/HomeWorkList';

export function Index () {
    return <div className={'g-myhomework'}>
        <GlobalTop title={''} />
        <div className={'g-content'}>
            <HomeWorkList />
        </div>
    </div>;
}
