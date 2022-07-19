/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/11.
 * Copyright 2021/12/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/11
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { Form, Button, InputNumber, Input, Upload, Image, Modal } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { SubjectLabels } from './SubjectLabels';
import { editSubjectApi } from '../../../../../service/api/teacher/exam';
import { EDU_CONTEXT } from '../../../../../store';

const { Dragger } = Upload;
const { Item, useForm } = Form;
const { TextArea } = Input;
export function EditForm (props) {
    const { state: { currentExamPaper } } = useContext(EDU_CONTEXT);
    const [editSubject] = useForm();
    const [lables, setLabels] = useState([]);
    const [addExaImg, setAddExaImg] = useState(null);
    const [addExaImgPreview, setAddExaImgPreview] = useState(null);
    const draggerChangeHandler = async (f) => {
        setAddExaImg(f);
        let reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function (e) {
            setAddExaImgPreview(e.target.result);
        };
    };
    // const submitEditSubject = async () => {
    //     try {
    //         const df = await editSubject.validateFields();
    //         console.log(addExaImg);
    //         console.log(df);
    //     } catch (e) {
    //     }
    // };
    const submitEditSubject = async () => {
        try {
            const { remark } = await editSubject.validateFields();
            const params = { eid: currentExamPaper.id, remark };
            const file = new FormData();
            file.append('file', addExaImg, addExaImg.name);
            params.file = file;
            await editSubjectApi(params);
        } catch (e) {
            // console.log(e);
            Modal.error({
                title: e.message
            });
        }
    };
    return <Form form={editSubject} name={'editSubject'} onFinish={submitEditSubject}>
        <div className={'editSubjectWrap'}>
            <div className={'info'}>
                <div className={'num item'}>
                    第一题
                </div>
                <Item name={'score'} className={'item'}>
                    <InputNumber min={1} max={10} />
                </Item>
                <div className={'operate'}>
                    <Button type={'primary'} htmlType={'submit'}>确定</Button>
                </div>
            </div>
            <div className={'subjectImage'}>
                {addExaImgPreview ?
                    <figure className={'draggerImageView'}>
                        <Image src={addExaImgPreview} />
                        <Upload className={'updateLoad'} showUploadList={false}
                                customRequest={() => {
                                }} beforeUpload={draggerChangeHandler}>
                            <Button icon={<UploadOutlined />}>更新</Button>
                        </Upload>
                    </figure> :
                    <Dragger beforeUpload={draggerChangeHandler}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">单击或拖动文件到此区域</p>
                    </Dragger>}
            </div>
            <div className={'remarkContent'}>
                <Item name={'remark'}>
                    <TextArea placeholder={'题目描述'} showCount autoSize maxLength={200} />
                </Item>
            </div>
            <SubjectLabels update={(l) => {
                setLabels(l);
            }} />
        </div>
    </Form>;
}
