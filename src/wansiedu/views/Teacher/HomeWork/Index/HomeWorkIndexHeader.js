/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/28.
 * Copyright 2021/9/28 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/28
 * @version */
import React from 'react';
import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { TeacherRightNav } from '../../_common/TeacherRightNav';
import { useHistory } from 'react-router-dom';

export function HomeWorkIndexHeader () {
    const history = useHistory();
    const creatHomeWork = () => {
        history.push('/teacher/homework_edit');
    };
    return <div className={'g-operation'}>
        <div className={'optionwrap'}>
            <Button icon={<FileAddOutlined />} type="primary" onClick={creatHomeWork}>布置作业</Button>
        </div>
        <TeacherRightNav currentKey={'homework'} />
    </div>;
}
