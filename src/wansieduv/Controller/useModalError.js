/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/21.
 * Copyright 2021/9/21 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/21
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Modal } from 'antd';

export function useModalError () {
    return (error, msg) => {
        const config = {
            title: error,
            okText: '我知道了'
        };
        if (msg) {
            config.content = msg;
        }
        Modal.error(config);
    };
}
