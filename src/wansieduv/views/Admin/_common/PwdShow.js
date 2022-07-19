/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/20.
 * Copyright 2021/9/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Tag } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export function PwdShow (props) {
    const [show, setShow] = useState(false);
    const [pwdAr] = useState(props.pwd.split(''));
    return <Tag color='red'>
        <span style={{ marginRight: '10px' }}>{show ? props.pwd : pwdAr.map(() => '* ')}</span>
        <span onClick={() => setShow(!show)}>{show ?  <EyeInvisibleOutlined /> :<EyeOutlined /> } </span>
    </Tag>;
}
