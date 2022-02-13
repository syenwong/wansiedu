/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/9.
 * Copyright 2021/12/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/9
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { Button, Divider, Form, Input, Modal, Select } from 'antd';
import { editExamPaperApi } from '../../../../../service/api/teacher/exam';
import { useLabelsMng } from '../../../../../Controller/useLabelsMng';
import { useExamPaperAdmin } from '../../../../../Controller/useExamPaperAdmin';
import { useModalError } from '../../../../../Controller/useModalError';
import { EDU_CONTEXT } from '../../../../../store';
import { PlusOutlined } from '@ant-design/icons';

const { Item, useForm } = Form;
const { Option } = Select;
export function EditEpForm (props) {
    const { state } = useContext(EDU_CONTEXT);
    const { title, editCancel } = props;
    const [editEpForm] = useForm();
    const { currentExamPaper } = state;
    const labelsMng = useLabelsMng();
    const actionHandler = useExamPaperAdmin();
    const ModalError = useModalError();
    const [addLabelName, setAddLabelName] = useState('');
    const editExamPaper = async () => {
        try {
            const { paperName, paperLabels } = await editEpForm.validateFields();
            const paperLabelsStr = paperLabels.join(',');
            const params = { name: paperName, labels: paperLabelsStr };
            if (currentExamPaper?.id) {
                params.eid = currentExamPaper?.id;
            }
            const newId = await editExamPaperApi(params);
            await actionHandler('getExamPaperList');
            editCancel();
            if (!currentExamPaper?.id) {
                Modal.confirm({
                    title: '是否继续编辑题目?',
                    okText:'确定',
                    cancelText:'取消',
                    onOk () {
                        actionHandler('rediectExamPaperOperation', {
                            id: newId,
                            name: paperName,
                            labels: paperLabelsStr
                        }, 'editExamPaperSubjects');
                    },
                    onCancel () {
                        editCancel();
                    }
                });
            }
        } catch (e) {
            ModalError(e.message);
        }
    };
    const addLabels = async () => {
        const paperLabels = (editEpForm.getFieldValue('paperLabels'));
        paperLabels.push(addLabelName);
        const hasLabel = ((state?.labels ?? {})?.exam ?? []).find(l => {
            return l.name === addLabelName;
        });
        if (!hasLabel) {
            await labelsMng('addLabel', addLabelName, 'exam');
        }
        editEpForm.setFieldsValue({
            paperLabels: [...new Set(paperLabels)]
        });
    };
    useEffect(() => {
        labelsMng('getLabels');
    }, []);
    useEffect(() => {
        if (currentExamPaper && editEpForm) {
            const { name, labels } = currentExamPaper;
            editEpForm.setFieldsValue({
                paperName: name,
                paperLabels: labels ? labels.split(',') : []
            });
        }
    }, [currentExamPaper]);
    return <Form form={editEpForm} name={'editEp'} className={'g-editExamPaperBasicInfo'}
                 onFinish={editExamPaper}>
        <Item label={'试卷名称'} name={'paperName'} rules={[{ required: true }]}>
            <Input type="text" placeholder={'输入试卷名称'} />
        </Item>
        <div className={'addItem'}>
            <Item label={' 分类标签'} name={'paperLabels'} style={{ width: '60%' }}>
                <Select mode={'multiple'}
                        placeholder="选择标签分类">
                    {state?.labels?.exam.map((l, index) => (
                        <Option key={index} value={l.name}>{l.name}</Option>
                    ))}
                </Select>
            </Item>
            <div className={'addItem'}>
                <Input style={{ flex: 'auto' }}
                       onChange={(e) => setAddLabelName(e.target.value)}
                       placeholder={'添加标签分类'} />
                <a style={{ flex: 'none', display: 'block', cursor: 'pointer' }}
                   onClick={addLabels}>
                    <PlusOutlined /> 新增标签
                </a>
            </div>
        </div>
        <Divider />
        <div className={'u-formBtnWrap'}>
            <Button type={'primary'} htmlType={'submit'}>{title}</Button>
            <Button onClick={editCancel}>取消</Button>
        </div>
    </Form>;
}
