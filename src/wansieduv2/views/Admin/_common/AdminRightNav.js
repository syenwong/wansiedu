/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/12.
 * Copyright 2021/8/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/12
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { EDU_CONTEXT } from '../../../store';
import { Menu } from 'antd';

export function AdminRightNav () {
    const history = useHistory();
    const { state: { currentTeacherNavKey }, dispatch } = useContext(EDU_CONTEXT);
    const redirectUrl = (key) => {
        dispatch({
            currentKey: key
        });
        history.push(`/admin/${key}`);
    };
    const menus = [{
        key: 'student',
        icon: <TeamOutlined />,
        name: '学生管理'
    }, {
        key: 'teacher',
        icon: <SolutionOutlined />,
        name: '教师管理'
    }];
    return <div className={'g-rightNav'}>
        <Menu mode="horizontal" selectedKeys={[currentTeacherNavKey]}>
            {menus.map((m) => {
                return <Menu.Item key={m.key} icon={m.icon}
                                  onClick={() => {
                                      redirectUrl(m.key);
                                  }}>
                    {m.name}
                </Menu.Item>;
            })}
        </Menu>
    </div>;
}
