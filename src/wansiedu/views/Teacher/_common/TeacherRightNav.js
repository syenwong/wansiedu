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
import { DatabaseOutlined, TeamOutlined, FileDoneOutlined, ClusterOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

export function TeacherRightNav (props) {
    const history = useHistory();
    return <RightNav
        currentKey={props.currentKey}
        menus={[
            {
                key: 'homework',
                icon: <FileDoneOutlined />,
                name: '作业管理',
                handler () {
                    history.push('/teacher/homework');
                }
            },
            {
                key: 'student',
                icon: <TeamOutlined />,
                name: '学生管理',
                handler () {
                    history.push('/teacher/student');
                }
            },
            {
                key: 'examinationPaper',
                icon: <DatabaseOutlined />,
                name: '试卷管理',
                handler () {
                    history.push('/teacher/examinationpaper');
                }
            },
            {
                key: 'classes',
                icon: <ClusterOutlined />,
                name: '分类管理',
                handler () {
                    history.push('/teacher/classes');
                }
            }
        ]} />;
}
