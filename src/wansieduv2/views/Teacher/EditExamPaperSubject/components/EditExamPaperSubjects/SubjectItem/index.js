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
import React, { useContext, useState } from 'react';
import { Tag, Image, Button, Upload } from 'antd';
import { UpOutlined, DownOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useExamPaperAdmin } from '../../../../../../Controller/useExamPaperAdmin';
import { SubjectImg } from '../SubjectImg/SubjectImg';
import { EDU_CONTEXT } from '../../../../../../store';
import { SubjectLabels } from './SubjectLabels';
import { Score } from './Score';

export function SubjectItem (props) {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { currentExamPaper } = state;
    const { subject } = props;
    const { eid, score, remark, type, id, url, No } = subject;
    const examPaperAdmin = useExamPaperAdmin();
    const submitSubjectItem = async (key, value) => {
        try {
            await examPaperAdmin('updateSubjectItem', currentExamPaper.id, id, { key, value });
        } catch (e) {
            console.log(e);
        }
    };
    return <div className={'m-subjectItem-edit'}>
        <div className={`subjectInfo`}>
            <Score value={score} onChange={async (s) => {
                await submitSubjectItem('score', s);
            }} />
            <div className={'operate'}>
                <div className={'subjectType'}>
                    <SubjectLabels value={type || []} onChange={async (newTypes) => {
                        if (type.join() !== newTypes.join()) {
                            await submitSubjectItem('type', newTypes.join());
                        }
                    }} />
                </div>
                <Button type={'danger'} size={'small'} onClick={async () => await examPaperAdmin('deleteSubject', No, eid, id)}><DeleteOutlined /></Button>
            </div>
        </div>
        <SubjectImg url={url} submitSubjectImg={async (file) => await submitSubjectItem('file', file)} />
    </div>;
}
