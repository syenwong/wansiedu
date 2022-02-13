/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/13.
 * Copyright 2021/12/13 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/13
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { renderRoutes } from 'react-router-config';
import { GlobalTop } from '../../globalComponents/GlobalTop';
import { AdminRightNav } from './_common/AdminRightNav';

export function Admin (props) {
    return <div className={'g-admin'}>
        <GlobalTop nav={<AdminRightNav />} />
        {renderRoutes(props.route.routes)}
    </div>;
}
