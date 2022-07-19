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
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Tag, Image, Button } from 'antd';
import { UpOutlined, DownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useExamPaperAdmin } from '../../../../../Controller/useExamPaperAdmin';

export function SubjectItem (props) {
    const { subject } = props;
    const { eid, score, remark, type, id, url, No } = subject;
    const examPaperAdmin = useExamPaperAdmin();
    return <div className={'m-subjectItem'}>
        <div className={`subjectInfo`}>
            <div className={'score'}>
                <Tag color="green">{score}分</Tag>
                {Array.isArray(type) && type.length > 0 && <div className={'subjectRemark'}>
                    {type.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </div>}
            </div>
            <div className={'operate'}>
                <Button type={'danger'} size={'small'} onClick={async () => await examPaperAdmin('deleteSubject', No, eid, id)}><DeleteOutlined /></Button>
                <Button type={'primary'} size={'small'} onClick={async () => await examPaperAdmin('updateSubject', 'edit', subject)}><EditOutlined /></Button>
            </div>
        </div>
        {remark && <div className={'subjectRemark'}>
            {remark}
        </div>}
        {url && <div className={'subjectImg'}><Image src={url} alt="" /></div>}
    </div>;
}
