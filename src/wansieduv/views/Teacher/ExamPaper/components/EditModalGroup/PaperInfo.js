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
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { Divider, Modal, Button, Form, Input, Select } from 'antd';
import { EDU_CONTEXT } from '../../../../../store';
import { useLabelsMng } from '../../../../../Controller/useLabelsMng';
import { useActionHandlerMaps } from '../../../../../Controller/useActionHandlerMaps';

const { useForm, Item } = Form;
const { Option } = Select;
const submitEditBtn = {
    'add': '创建试卷',
    'edit': '修改试卷'
};
export function PaperInfo () {
    const [editEpForm] = useForm();
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const labelsMng = useLabelsMng();
    const actionHandler = useActionHandlerMaps();
    const { currentExaPaper } = state;
    useEffect(() => {
        labelsMng('getLabels');
    }, []);
    useEffect(() => {
        if (currentExaPaper) {
            const { name, labels } = currentExaPaper;
            editEpForm.setFieldsValue({
                paperName: name,
                paperLabels: labels ? labels.split(',') : []
            });
        }
    }, [currentExaPaper]);
    return <div className={'editPaper-step-1'}>
    
    </div>;
}
