/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/19.
 * Copyright 2021/9/19 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/19
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { EDIT_TYPES, GRADE_MAP, INITIALVALUES_STUDENT_FORM } from '../../../service/STATIC_DATA';
import { Form, Input, Modal, Select } from 'antd';
import { editTeacherApi } from '../../../service/api/admin/teacher';

export function EditTeacherModal (props) {
    const { isModalVisible, editTeacher, cancelHandler, okHandler } = props;
    const [qrForm] = Form.useForm();
    const [editType, setEditType] = useState(0); //0 新增 1 修改
    // 新增编辑教师
    async function handleOk () {
        try {
            const dataValidate = await qrForm.validateFields();
            await editTeacherApi(dataValidate, editTeacher?.uid);
            Modal.success({
                title: `${EDIT_TYPES[editType]}教师成功`
            });
            okHandler();
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
    }
    function handleCancel () {
        qrForm.resetFields();
        cancelHandler();
    }
    useEffect(() => {
        if (editTeacher) {
            setEditType(1);
            qrForm.setFieldsValue(editTeacher);
        } else {
            setEditType(0);
            qrForm.resetFields();
        }
    }, [editTeacher]);
    return <Modal forceRender
                  getContainer={false}
                  maskClosable={false}
                  title={EDIT_TYPES[editType] + '教师'}
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText={EDIT_TYPES[editType] + '教师'}
                  cancelText={'取消'}>
        <Form name="qrForm" form={qrForm} className={'g-qrForm'}
              initialValues={INITIALVALUES_STUDENT_FORM}
              labelCol={{
                  xs: { span: 24 },
                  sm: { span: 6 }
              }}
              wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 16 }
              }}>
            <Form.Item name="account" label="用户名" rules={[{ required: true, message: '请输入用户名!' }]}>
                <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名!' }]}>
                <Input placeholder="姓名" />
            </Form.Item>
            <Form.Item name="subject" label="学科" rules={[{ required: true, message: '请输入学科!' }]}>
                <Input placeholder="学科" />
            </Form.Item>
        </Form>
    </Modal>;
}
