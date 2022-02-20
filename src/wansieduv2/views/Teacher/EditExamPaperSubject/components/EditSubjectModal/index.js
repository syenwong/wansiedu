/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/12.
 * Copyright 2021/12/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/12
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { EDU_CONTEXT } from '../../../../../store';
import { Button, Form, Image, Input, InputNumber, Modal, Upload } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { SubjectLabels } from './SubjectLabels';
import { editSubjectApi } from '../../../../../service/api/teacher/exam';
import { useExamPaperAdmin } from '../../../../../Controller/useExamPaperAdmin';
import { useModalError } from '../../../../../Controller/useModalError';
import { ScoreInput } from '../../../../../globalComponents/ScoreInput';

const { Dragger } = Upload;
const { Item, useForm } = Form;
export function EditSubjectModal (props) {
    const { eid } = props;
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { editSubjectModalVisible, currentEditSubject, currentExamPaperSubjects } = state;
    const [editSubjectForm] = useForm();
    const [addExaImg, setAddExaImg] = useState(null);
    const [addExaImgPreview, setAddExaImgPreview] = useState(null);
    const [scoreStep, setScoreStep] = useState(1);
    const [isParent, setIsParent] = useState(false);
    const [ModalTitle, setModalTile] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const examPaperAdmin = useExamPaperAdmin();
    const ModalError = useModalError();
    const draggerChangeHandler = async (f) => {
        setAddExaImg(f);
        let reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function (e) {
            setAddExaImgPreview(e.target.result);
        };
    };
    const submitSubject = async () => {
        try {
            setConfirmLoading(true);
            const { score, type = [], remark } = await editSubjectForm.validateFields();
            const requestData = Object.assign({}, currentEditSubject, {
                score,
                remark,
                type: type.join(',')
            });
            if (addExaImg) {
                const file = new FormData();
                file.append('file', addExaImg, addExaImg.name);
                requestData.file = file;
            } else {
                // 编辑的时候泡出异抛
                // 不是编辑的时候，父节点可以不传图片
                if (!currentEditSubject.id && !isParent) {
                    throw {
                        message: '未上传题目图片'
                    };
                }
            }
            await editSubjectApi(requestData);
            const currentExamPaperSubjects = await examPaperAdmin('getExamSubjectsList', eid);
            setAddExaImg(null);
            setConfirmLoading(false);
            setScoreStep(1);
            dispatch({ currentExamPaperSubjects });
            dispatch({
                editSubjectModalVisible: false,
                currentEditSubject: null
            });
        } catch (e) {
            setConfirmLoading(false);
            ModalError(e.message);
        }
    };
    const cancelEditSubject = async () => {
        await examPaperAdmin('updateSubject', 'close');
        editSubjectForm.resetFields();
        setAddExaImg(null);
        setAddExaImgPreview(null);
        setScoreStep(1);
    };
    const setStepsHandler = (e) => {
        const t = e.target;
        const n = Number(t.dataset.n);
        if (t.nodeName.toLowerCase() === 'span' && n) {
            let score = editSubjectForm.getFieldValue('score') + n;
            editSubjectForm.setFieldsValue({
                score
            });
            setScoreStep(n);
        }
    };
    useEffect(() => {
        if (currentEditSubject && editSubjectModalVisible) {
            const { id, remark, score, type, url, isParent, No } = currentEditSubject;
            setIsParent(isParent);
            editSubjectForm.setFieldsValue({
                remark,
                score,
                type
            });
            setAddExaImgPreview(url);
            setModalTile(`${id ? '编辑' : '新增'} 第${No}题 ${isParent ? '题干' : '内容'}`);
        }
    }, [currentEditSubject, editSubjectModalVisible]);
    return <Modal className={'g-editSubjectModal'}
                  maskClosable={false}
                  title={ModalTitle}
                  width={960}
                  visible={editSubjectModalVisible}
                  onCancel={cancelEditSubject}
                  confirmLoading={confirmLoading}
                  onOk={submitSubject}
                  okText={'提交'}
                  cancelText={'取消'}>
        <div className={'editSubjectWrap'}>
            <Form form={editSubjectForm} name={'editSubjectForm'} initialValues={{ score: 0, remark: '', labels: [] }}>
                {
                    !isParent &&
                    <div className={'info'}>
                        <Item name={'score'} className={'item'}>
                            <ScoreInput />
                        </Item>
                        <div className={'steps'} onClick={setStepsHandler}>
                            {
                                [3, 4, 5, 6, 10, 0.5].map((n, i) => {
                                    return <span key={i} data-n={n} className={scoreStep === n ? 'cur' : ''}>{n}</span>;
                                })
                            }
                        </div>
                    </div>
                }
                <div className={'subjectImage'}>
                    {addExaImgPreview ?
                        <figure className={'draggerImageView'}>
                            <Image src={addExaImgPreview} />
                            <Upload className={'updateLoad'} showUploadList={false}
                                    beforeUpload={draggerChangeHandler}>
                                <Button icon={<UploadOutlined />}>更新</Button>
                            </Upload>
                        </figure> :
                        <Dragger beforeUpload={draggerChangeHandler}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{isParent ? '上传题干内容' : '上传题目内容'}</p>
                        </Dragger>}
                </div>
                {
                    !isParent &&
                    <Item name={'type'}>
                        <SubjectLabels />
                    </Item>
                }
            </Form>
        </div>
    </Modal>;
}
