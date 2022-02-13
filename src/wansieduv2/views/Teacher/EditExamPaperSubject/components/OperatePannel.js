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
import { Button, Modal } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export function OperatePannel () {
    const history = useHistory();
    return <div className={'g-operation'}>
        <div className={'optionwrap'}>
            <Button type="primary"
                    className={'add'}
                    icon={<FileAddOutlined />}
                    onClick={() => Modal.confirm({
                        title: '确定放回试卷列表?',
                        okText: '确定返回',
                        cancelText: '继续编辑',
                        onOk () {
                            history.push('/teacher/ExamPaper');
                        }
                    })}>返回试卷列表</Button>
        </div>
    </div>;
}

