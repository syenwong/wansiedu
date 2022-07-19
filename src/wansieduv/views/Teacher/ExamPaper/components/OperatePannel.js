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
import { Button } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { DEFAULT_EXAMPAPER } from '../../../../store/defaultData';
import { EDU_CONTEXT } from '../../../../store';

export function OperatePannel () {
    const { dispatch } = useContext(EDU_CONTEXT);
    return <Button type="primary"
                   className={'add'}
                   icon={<FileAddOutlined />}
                   onClick={() => dispatch({ currentExamPaper: DEFAULT_EXAMPAPER, editExamPaperModalVisible: true })}>新增试卷</Button>;
}

