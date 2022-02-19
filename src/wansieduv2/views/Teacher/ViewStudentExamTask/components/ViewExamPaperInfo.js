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
import { smTr } from '../../../../service/utils';

export function ViewExamPaperInfo () {
    
    const { state: { currentTask, currentTaskExaPaper, ViewStudentExamTask } } = useContext(EDU_CONTEXT);
    const { name, labels = '', createTime } = currentTask || {};
    const { total, checkScoreTotal, scoreTotal, totalTime } = ViewStudentExamTask || {};
   
    return <div className={'g-viewExamPaper_info'}>
        <h4>{name}</h4>
        <p className={'createTime'}> {createTime}</p>
        <div className={'basic'}>
            <span>共 <Tag color={'cyan'}>{total}</Tag> 题 ， </span>
            <span>
                <Tag color={'green'}> {checkScoreTotal}/{scoreTotal} </Tag>分 ，
            </span>
            <span> 总用时：<Tag color={'orange'}> {smTr(totalTime)} </Tag></span>
        </div>
        {
            (typeof labels === 'string' && labels !== '') &&
            <div className={'label'}>
                试卷类型：
                <div className={'item'}>
                    {(labels.split(',').map((t, i) => <Tag key={i}>{t}</Tag>))}
                </div>
            </div>
        }
    
    
    </div>;
}
