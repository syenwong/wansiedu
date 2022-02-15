/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/8.
 * Copyright 2021/9/8 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/8
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useContext, useState } from 'react';
import { InboxOutlined, FormOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Form, Upload, Input, Button, Image, Modal, Tag } from 'antd';
import { EDU_CONTEXT } from '../../../../../store';
import { editSubjectApi, deleteSubjectApi } from '../../../../../service/api/teacher/exam';
import { useActionHandlerMaps } from '../../../../../globalComponents/useActionHandlerMaps';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Item, useForm } = Form;
let loadingLength_local = 0;
export function SubjectsEdit () {
    const [remarkForm] = useForm();
    /* */
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { currentExaPaper_subjects, eidtModalHeight, currentExaPaper_Info } = state;
    const actionHandler = useActionHandlerMaps();
    /* */
    const [editNumber, setEditNumber] = useState(-1);
    const [addExaImg, setAddExaImg] = useState(null);
    const [addExaImgPreview, setAddExaImgPreview] = useState([]);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [loadingLength, setloadingLength] = useState(0);
    /* */
    const resetEditSubject = () => {
        setAddExaImg(null);
        setAddExaImgPreview('');
        setEditNumber(-1);
        setEditSubjectId(null);
        loadingLength_local = 0;
        setloadingLength(0);
        remarkForm.resetFields();
    };
    // 新增题目
    const editSubject = async () => {
        try {
            const { remark } = await remarkForm.validateFields();
            const params = { eid: currentExaPaper_Info.id };
            let error = '';
            const remarkList = remark && remark.split('&') || '';
            let ilen = addExaImg.length;
            for (let i = 0; i < ilen; i++) {
                let addExaImgElement = addExaImg[i];
                let _remark = '';
                if (remarkList.length === 1) {
                    _remark = remarkList[0];
                } else {
                    _remark = remarkList[i] || '';
                }
                if (addExaImgElement) {
                    const file = new FormData();
                    file.append('file', addExaImgElement, addExaImgElement.name);
                    params.file = file;
                }
                if (_remark) {
                    params.remark = _remark;
                }
                if (editSubjectId) {
                    params.subjectId = editSubjectId;
                } else if (!addExaImg) {
                    error = '缺少照片';
                }
                if (error) {
                    Modal.error({
                        title: error
                    });
                    return false;
                }
                await editSubjectApi(params);
                loadingLength_local += 1;
                setloadingLength(loadingLength_local);
            }
            actionHandler('getSubjectsList', currentExaPaper_Info.id);
            setloadingLength(0);
        } catch (e) {
            // console.log(e);
            Modal.error({
                title: e.message
            });
        }
        resetEditSubject();
    };
    const draggerChangeHandler = (f, fl) => {
        setAddExaImg(fl);
        let PromiseAllList = fl.map((fitem) => {
            return new Promise(resolve => {
                let reader = new FileReader();
                reader.readAsDataURL(fitem);
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
            });
        });
        Promise.all(PromiseAllList).then(_addExaImgPreviewList => {
            setAddExaImgPreview(_addExaImgPreviewList);
        });
    };
    const editPaperItem = (subject, index, editType) => {
        const { url, remark, id } = subject;
        switch (editType) {
            case 'delete':
                Modal.confirm({
                    title: `确定删除第${index + 1}题`,
                    cancelText: '我好像点错了',
                    async onOk () {
                        try {
                            await deleteSubjectApi(currentExaPaper_Info.id, id);
                            actionHandler('getSubjectsList', currentExaPaper_Info.id);
                        } catch (e) {
                        }
                    }
                });
                break;
            default:
                setAddExaImgPreview([url]);
                setEditNumber(index);
                setEditSubjectId(id);
                remarkForm.setFieldsValue({
                    remark
                });
                break;
        }
    };
    const editAreaSize = eidtModalHeight - 120 + 'px';
    const addExaImgPreviewList = (() => {
        let addExaImgPreviewRender = null;
        if (Array.isArray(addExaImgPreview) && addExaImgPreview.length > 0) {
            if (addExaImgPreview.length === 1) {
                addExaImgPreviewRender = <figure className={'draggerImageView'}>
                    <Image width={'100%'} src={addExaImgPreview} />
                </figure>;
            } else {
                addExaImgPreviewRender = <ul className={'draggerImageViewUl'}>
                    {
                        addExaImgPreview.map(i => {
                            return <li>
                                <figure className={'draggerImageViewLi'}>
                                    <Image width={'100%'} src={i} />
                                </figure>
                            </li>;
                        })
                    }
                </ul>;
            }
        }
        return addExaImgPreviewRender;
    })();
    useEffect(() => {
        setEditNumber(-1);
    }, [currentExaPaper_Info]);
    return <div className={'g-editSubjectsWrap'}>
        <div className={'editsubject-header'}>
            <h2>{currentExaPaper_Info.name}</h2>
            <div className={'labels'}>{(currentExaPaper_Info?.labels ? currentExaPaper_Info.labels.split(',') : []).map((l, index) => {
                return <Tag key={index}>{l}</Tag>;
            })}</div>
        </div>
        <div className={'g-editSubjectsContent'}>
            <div className={'m-paparContentList'} style={{ height: editAreaSize }}>
                <ul>{(currentExaPaper_subjects?.data ?? []).map((p, index) => {
                    return <li key={index} className={editNumber === index ? 'editting' : 'nor'}>
                        <div className={'paperContent'}>
                            <h2>
                                <span>
                                    No{index + 1}
                                </span>
                                <div className={'editBtns'}>
                                    
                                    <div onClick={() => editPaperItem(p, index)}><FormOutlined /></div>
                                    <div onClick={() => editPaperItem(p, index, 'delete')}><DeleteOutlined /></div>
                                </div>
                            </h2>
                            <div className={'viewImg'}>
                                <Image width={'100%'} src={p.url} />
                            </div>
                            <p className={'remark'}>{p.remark}</p>
                        </div>
                    </li>;
                })}</ul>
            </div>
            <div className={'pageContentEdit'} style={{ height: editAreaSize }}>
                <h1>
                    <span>
                        第 {(editNumber >= 0 ?
                        editNumber + 1 :
                        ((currentExaPaper_subjects?.data ?? []).length) + 1) + ((addExaImg?.length ?? 0) > 1 ? (' - ' + Number(((currentExaPaper_subjects?.data ?? []).length) + (addExaImg?.length ?? 0))) : '')} 题
                    </span>
                    <Button type={'primary'} onClick={resetEditSubject}><ReloadOutlined /></Button>
                </h1>
                <div className={'DraggerStyle'}>
                    {addExaImgPreviewList}
                    <Dragger beforeUpload={draggerChangeHandler}
                             multiple={true}
                             showUploadList={false}
                             customRequest={(s) => {
                                 return true;
                             }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">单击或拖动文件到此区域</p>
                    </Dragger>
                </div>
                <div className={'loadingLine'}>
                    <div className={'loadingLineInline'} style={{ width: (loadingLength / addExaImg?.length ?? 1) * 100 + '%' }} />
                </div>
                <div className={'editDes'}>
                    <p>备注说明：</p>
                    <Form form={remarkForm} initialValues={{ remark: '' }}>
                        <Item name={'remark'}>
                            <TextArea showCount maxLength={50} />
                        </Item>
                    </Form>
                </div>
                <div className={'u-formBtnWrap'}>
                    <Button type={'primary'} onClick={editSubject}>{(editSubjectId ? '修改' : '添加') + '题目'}</Button>
                </div>
            </div>
        </div>
    </div>;
}
