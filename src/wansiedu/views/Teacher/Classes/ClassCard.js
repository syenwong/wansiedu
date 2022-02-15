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
import React, { useContext } from 'react';
import { Form, Tag, Button, Input } from 'antd';
import { ClassTag } from './ClassTag';
import { addLabelApi } from '../../../service/api/teacher/labels';
import { EDU_CONTEXT } from '../../../store';
import { useGetLabels } from '../../../globalComponents/useGetLabels';

const { Item, useForm } = Form;
export function ClassCard (props) {
    const { type } = props;
    const { state } = useContext(EDU_CONTEXT);
    const getLabels = useGetLabels();
    const [addTagFrom] = useForm();
    const addLabel = async () => {
        try {
            const { tag } = await addTagFrom.validateFields();
            await addLabelApi(tag, type);
            getLabels();
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
        addTagFrom.resetFields();
    };
    return <div className={'g-cardContent'}>
        {state.labels[type].map((t, index) => {
            return <ClassTag key={index} tag={t} />;
        })}
        <Tag className={'m-classTag'}>
            <Form name={'addTagFrom'} form={addTagFrom}>
                <Item name={'tag'}>
                    <Input />
                </Item>
            </Form>
            <Button type={'primary'} onClick={addLabel}>
                新增
            </Button>
        </Tag>
    </div>;
}
