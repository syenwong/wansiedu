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
import React from 'react';
import { RightNav } from '../../../globalComponents/RightNav';
import { SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

export function AdminRightNav (props) {
    const history = useHistory();
    return <RightNav
        currentKey={props.currentKey}
        menus={[{
            key: 'student',
            icon: <TeamOutlined />,
            name: '学生管理',
            handler () {
                history.push('/admin/student');
            }
        }, {
            key: 'teacher',
            icon: <SolutionOutlined />,
            name: '教师管理',
            handler () {
                history.push('/admin/teacher');
            }
        }]} />;
}
