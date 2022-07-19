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
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../../../../store';
import { Tag } from 'antd';

export function ViewExamPaperInfo () {
    const { state: { currentExamPaper, currentExamPaperSubjects }, dispatch } = useContext(EDU_CONTEXT);
    const { name, labels = '', createTime } = currentExamPaper || {};
    return <div className={'g-viewExamPaper_info'}>
        <div className={'viewExamPaper_info_left'}>
            <div className={'basic'}>
                <h4>{name}</h4>
                <span className={'item'}> {createTime}</span>
                <span>共 <Tag color={'cyan'}>{currentExamPaperSubjects?.total}</Tag> 题，</span>
                <span>
                    总分<Tag color={'blue'}>{(currentExamPaperSubjects?.data ?? []).reduce((v1, v2) => {
                        return v1 + v2.score;
                    }, 0)}
                </Tag>分
                </span>
            </div>
            <div className={'label'}>
                <div className={'item'}>
                    {labels && (labels.split(',').map((t, i) => <Tag key={i}>{t}</Tag>))}
                </div>
            </div>
        </div>
    </div>;
}
