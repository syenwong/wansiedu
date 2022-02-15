/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/16.
 * Copyright 2021/8/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/16
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';

export function RightNav (props) {
    const { menus = [], currentKey } = props;
    return <div className={'g-rightNav'}>
        <Menu mode="horizontal" selectedKeys={[currentKey]}>
            {menus.map((m) => {
                return <Menu.Item key={m.key} icon={m.icon}
                                  onClick={() => {
                                      m.handler();
                                  }}>
                    {m.name}
                </Menu.Item>;
            })}
        </Menu>
    </div>;
}
