/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/29.
 * Copyright 2021/9/29 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/29
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';

export function RouterListener () {
    window.localStorage.setItem('wse_path', location.href.split('#')[1]);
    return null;
}
