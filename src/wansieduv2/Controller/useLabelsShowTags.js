/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/10/10.
 * Copyright 2021/10/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/10/10
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Tag } from 'antd';
import { EDU_CONTEXT } from '../store';

export function useLabelsShowTags () {
    const { state } = useContext(EDU_CONTEXT);
    return (labels) => {
        labels.map((l, index) => {
            return l !== state.account ? <Tag key={index}>{l}</Tag> : null;
        });
    };
}
