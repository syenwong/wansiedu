/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/27.
 * Copyright 2022/2/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/27
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { Button, Drawer, Table, Tag } from 'antd';
import { smTr } from '../../../../service/utils';
import { EDU_CONTEXT } from '../../../../store';

export function DrawerInfo (props) {
    const { state: { clientHeight } } = useContext(EDU_CONTEXT);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { typeDetailsList = [] } = props || {};
    const columns = [
        {
            title: '类型',
            dataIndex: 'type'
            
        },
        {
            title: '总分',
            dataIndex: 'score',
            width: 64
        },
        {
            title: '得分',
            dataIndex: 'checkScore',
            width: 60,
            sorter: (a, b) => a.checkScore - b.checkScore,
            render (t) {
                return <Tag color={'green'}>{t}</Tag>;
            }
        },
        {
            title: '时间',
            dataIndex: 'time',
            width: 60,
            sorter: (a, b) => a.time - b.time,
            render (t) {
                return <Tag color={'blue'}>{smTr(t)}</Tag>;
            }
        },
        {
            title: '得分率',
            dataIndex: 'ratio',
            width: 120,
            sorter: (a, b) => a.ratio - b.ratio,
            render (t) {
                return <Tag color={'orange'}>{t}/min</Tag>;
            }
        }];
    return <>
        <Button type={'primary'} style={{ margin: '10px' }} onClick={() => setDrawerVisible(true)}>分类数据</Button>
        <Drawer placement="right"
                width={640}
                closable={false}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}>
            <Table columns={columns}
                   size="small"
                   dataSource={typeDetailsList}
                   bordered
                   scroll={{ y: clientHeight - 100 }}
                   pagination={false} />
        </Drawer>
    </>;
}
