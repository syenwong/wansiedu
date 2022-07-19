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
import { EDU_CONTEXT } from '../../../../store';
import { useLabelsMng } from '../../../../Controller/useLabelsMng';
import { editExamPaperApi } from '../../../../service/api/teacher/exam';
import { useActionHandlerMaps } from '../../../../Controller/useActionHandlerMaps';

const { useForm, Item } = Form;
const { Option } = Select;
export function PaperInfo () {
    const [editEpForm] = useForm();
    const { state } = useContext(EDU_CONTEXT);
    const labelsMng = useLabelsMng();
    const actionHandler = useActionHandlerMaps();
    const {
        currentExaPaper: {
            id, name, labels
        }
    } = state;
    const editExamPaper = async () => {
        try {
            const { paperName, paperLabels } = await editEpForm.validateFields();
            const paperLabelsStr = paperLabels.join(',');
            const params = [paperName, paperLabelsStr];
            if (id) {
                params.push(id);
            }
            const newId = await editExamPaperApi(...params);
            actionHandler('editSubjects', {
                id: newId,
                name: paperName,
                labels: paperLabelsStr
            });
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
    };
    useEffect(() => {
        labelsMng('getLabels');
    }, []);
    useEffect(() => {
        editEpForm.setFieldsValue({
            paperName: name,
            paperLabels: labels ? labels.split(',') : []
        });
    }, [id]);
    return <div className={'editPaper-step-1'}>
        <Divider orientation={'center'}>编辑试卷信息</Divider>
        <Form form={editEpForm} name={'editEp'}
              onFinish={editExamPaper}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}>
            
            <Item label={'试卷名称'} name={'paperName'} rules={[{ required: true }]}>
                <Input type="text" />
            </Item>
            <Item label={'分类标签'} name={'paperLabels'} style={{ width: '100%' }}>
                <Select mode={'multiple'}
                        placeholder="请选择分类">
                    {state?.labels?.exam.map((l, index) => (
                        <Option key={index} value={l.name}>{l.name}</Option>
                    ))}
                </Select>
            </Item>
            <Divider />
            <div className={'u-formBtnWrap'}>
                <Button onClick={() => actionHandler('resetEditExaPaper')}>放弃编辑</Button>
                <Button type={'primary'} htmlType={'submit'}>继续添加题目</Button>
            </div>
        </Form>
    </div>;
}
