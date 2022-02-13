/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/31.
 * Copyright 2021/12/31 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/31
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Input } from 'antd';

export function ScoreInput ({ value = [], onChange }) {
    const increase = () => {
        onChange?.(Number(value) + 1);
    };
    const reduce = () => {
        onChange?.(Number(value) - 1);
    };
    return <div className={'g-ScoreInput'}>
        <button onClick={reduce} className={'reduce'}>-</button>
        <Input value={value} onInput={(e) => {
            onChange?.(e.target.value);
        }} />
        <button onClick={increase} className={'increase'}>+</button>
        
    </div>;
}
