/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/15.
 * Copyright 2022/1/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/15
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { EDU_CONTEXT } from '../../../../store';
import { Table, Tag } from 'antd';
import { smTr } from '../../../../service/utils';

export function TypeDetailsMap () {
    const { state: { clientHeight, currentTaskExaPaper } } = useContext(EDU_CONTEXT);
    const { typeDetailsMap = {} } = currentTaskExaPaper || {};
    return <div className={'g-typeDetailsMap'} style={{ height: `${clientHeight - 120}px` }}>
        <div className={'typeDetailsNum'}>
            {Object.values(typeDetailsMap || {}).map((t, i) => {
                return <dl key={i}>
                    <dt>{t.type}</dt>
                    <dd>
                        {
                            (t?.Nos ?? []).map((n, j) => {
                                return <Tag key={j}>{n}</Tag>;
                            })
                        }
                    </dd>
                </dl>;
            })}
        </div>
    </div>;
}
