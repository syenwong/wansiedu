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
    const { typeDetailsList = [], typeDetailsMap = {} } = currentTaskExaPaper || {};
    
    const columns = [
        {
            title: '类型',
            dataIndex: 'type'
            
        },
        {
            title: '总分',
            dataIndex: 'score',
            width: '15%'
        },
        {
            title: '得分',
            dataIndex: 'checkScore',
            width: '15%',
            sorter: (a, b) => a.checkScore - b.checkScore,
            render (t) {
                return <Tag color={'green'}>{t}</Tag>;
            }
        },
        {
            title: '时间',
            dataIndex: 'time',
            width: '25%',
            sorter: (a, b) => a.time - b.time,
            render (t) {
                return <Tag color={'blue'}>{smTr(t)}</Tag>;
            }
        },
        {
            title: '得分率',
            dataIndex: 'ratio',
            width: '25%',
            sorter: (a, b) => a.ratio - b.ratio,
            render (t) {
                return <Tag color={'orange'}>{t}/min</Tag>;
            }
        }];
    return <div className={'g-typeDetailsMap'} style={{ height: `${clientHeight - 120}px` }}>
        <Table columns={columns}
               size="small"
               dataSource={typeDetailsList || []}
               bordered
               scroll={{ y: clientHeight - 180 }}
               pagination={false} />
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
