/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/22.
 * Copyright 2021/9/22 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/22
 * @version */
import React, { useContext } from 'react';
import { Button, Input } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { TeacherRightNav } from '../../_common/TeacherRightNav';
import { useActionHandlerMaps } from '../../../../globalComponents/useActionHandlerMaps';

export function OperatePannel () {
    const actionHandler = useActionHandlerMaps();
    return <div className={'g-operation'}>
        <div className={'optionwrap'}>
            <Button className={'add'} icon={<FileAddOutlined />} type="primary" onClick={() => {
                actionHandler('editExaPaper');
            }}>新增试卷</Button>
        </div>
        <TeacherRightNav currentKey={'examinationPaper'} />
    </div>;
}

