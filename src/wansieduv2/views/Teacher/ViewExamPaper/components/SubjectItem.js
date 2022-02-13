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
import React  from 'react';
import { Tag, Image } from 'antd';

export function SubjectItem (props) {
    const { subject } = props;
    const { score, remark, type, url } = subject;
    return <div className={'m-subjectItem'}>
        <div className={`subjectInfo`}>
            <div className={'score'}>
                <Tag color="green">{score}分</Tag>
                {Array.isArray(type) && type.length > 0 && <div className={'subjectRemark'}>
                    {type.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </div>}
            </div>
        </div>
        {remark && <div className={'subjectRemark'}>
            {remark}
        </div>}
        {url && <div className={'subjectImg'}><Image src={url} alt="" /></div>}
    </div>;
}
