/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/8.
 * Copyright 2022/1/8 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/8
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button, Image, Upload } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

export function SubjectImg (props) {
    const { url, noUrl, submitSubjectImg } = props;
    return <div className={'m-subjectImg_edit'}>
        {url ? <Image src={url} alt="" /> : noUrl}
        <Upload className={'updateLoad'} showUploadList={false} customRequest={() => {
        }}
                beforeUpload={submitSubjectImg}>
            <Button type={'primary'} icon={<FileImageOutlined />} />
        </Upload>
    </div>;
}
