/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/9.
 * Copyright 2021/8/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/9
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './views/App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

ReactDOM.render(
    <ConfigProvider locale={zhCN}><App /></ConfigProvider>,
    document.querySelector('#app')
);
