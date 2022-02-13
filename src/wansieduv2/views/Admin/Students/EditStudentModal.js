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
import { EDIT_TYPES, GRADE_MAP, GRADE_ORDER, INITIALVALUES_STUDENT_FORM } from '../../../service/STATIC_DATA';
import { Form, Input, Modal, Select } from 'antd';
import { editStudentApi } from '../../../service/api/admin/student';

export function EditStudentModal (props) {
    const { isModalVisible, editStudent, cancelHandler, okHandler } = props;
    const [qrForm] = Form.useForm();
    const [editType, setEditType] = useState(0); //0 新增 1 修改
    // 新增编辑学生
    async function handleOk () {
        try {
            const dataValidate = await qrForm.validateFields();
            await editStudentApi(dataValidate, editStudent?.uid);
            Modal.success({
                title: `${EDIT_TYPES[editType]}学生成功`
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
        if (editStudent) {
            setEditType(1);
            qrForm.setFieldsValue(editStudent);
        } else {
            setEditType(0);
            qrForm.resetFields();
        }
    }, [editStudent]);
    return <Modal forceRender
                  getContainer={false}
                  maskClosable={false}
                  title={EDIT_TYPES[editType] + '学生'}
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText={EDIT_TYPES[editType] + '学生'}
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
            <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请输入学科!' }]}>
                <Select placeholder={'请选择年级'}>
                    {GRADE_ORDER.map(g => {
                        return <Select.Option key={g} value={g}>{GRADE_MAP[g]}</Select.Option>;
                    })}
                </Select>
            </Form.Item>
        </Form>
    </Modal>;
}
