/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/20.
 * Copyright 2021/9/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Tag, Input, Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { deleteLabelsApi, editLabelApi } from '../../../service/api/teacher/labels';
import { useGetLabels } from '../../../globalComponents/useGetLabels';

export function ClassTag (props) {
    const [TagFrom] = Form.useForm();
    const { tag: { name, id } } = props;
    const getLabel = useGetLabels();
    const [editTageVisible, setEditTagVisible] = useState(false);
    const delLabel = async (e) => {
        e.preventDefault();
        Modal.confirm({
            title: `确定删除标签"${name}"?`,
            okText: '我确定',
            cancelText: '我好像点错了',
            async onOk () {
                try {
                    await deleteLabelsApi(id);
                    getLabel();
                } catch (e) {
                    Modal.error({
                        title: e.message
                    });
                }
            }
        });
    };
    const editLabel = async () => {
        try {
            const { newLabel } = await TagFrom.validateFields();
            if (newLabel && newLabel !== name) {
                Modal.confirm({
                    title: `确定修改标签"${name}" 变为 "${newLabel}"?`,
                    okText: '我确定',
                    cancelText: '我好像点错了',
                    async onOk () {
                        try {
                            await editLabelApi(id, newLabel);
                            getLabel();
                            setEditTagVisible(false);
                            TagFrom.setFieldsValue({ newLabel: '' });
                        } catch (e) {
                            Modal.error({
                                title: e.message
                            });
                        }
                    }
                });
            } else {
                setEditTagVisible(false);
                TagFrom.setFieldsValue({ newLabel: '' });
            }
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
    };
    return <Tag closable={!editTageVisible}
                className={'m-classTag'}
                onClose={delLabel}>
        {editTageVisible ?
            <div className={'tagInput'}>
                <Form name={'TagFrom'} form={TagFrom}><Form.Item name={'newLabel'}>
                    <Input />
                </Form.Item></Form>
                <div className={'tag-anticon-check'} onClick={editLabel}>
                    <CheckOutlined />
                </div>
            </div> :
            <div className={'tagContent'}
                 onDoubleClick={() => {
                     setEditTagVisible(true);
                     TagFrom.setFieldsValue({ newLabel: name });
                 }}>{name}</div>
        }
    </Tag>;
}
