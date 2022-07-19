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
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu } from 'antd';
import { ClusterOutlined, DatabaseOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons';
import { EDU_CONTEXT } from '../../../../store';

export function RightNav () {
    const history = useHistory();
    const { state: { currentTeacherNavKey }, dispatch } = useContext(EDU_CONTEXT);
    const redirectUrl = (key) => {
        dispatch({
            currentKey: key
        });
        history.push(`/teacher/${key}`);
    };
    const menus = [
        {
            key: 'homework',
            icon: <FileDoneOutlined />,
            name: '作业'
        },
        {
            key: 'student',
            icon: <TeamOutlined />,
            name: '学生'
        },
        {
            key: 'examPaper',
            icon: <DatabaseOutlined />,
            name: '试卷'
        },
        {
            key: 'classes',
            icon: <ClusterOutlined />,
            name: '分类'
        }
    ];
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
