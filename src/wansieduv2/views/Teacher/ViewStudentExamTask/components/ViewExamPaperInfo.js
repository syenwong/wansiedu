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
import { Button, Tag } from 'antd';
import { useHistory } from 'react-router-dom';
import { smTr } from '../../../../service/utils';

export function ViewExamPaperInfo () {
    const history = useHistory();
    const { state: { currentTask, currentTaskExaPaper } } = useContext(EDU_CONTEXT);
    const { name, labels = '', createTime } = currentTask || {};
    const { total, checkScoreTotal, scoreTotal, totalTime } = currentTaskExaPaper || {};
    return <div className={'g-viewExamPaper_info'}>
        <div className={'viewExamPaper_info_left'}>
            <div className={'basic'}>
                <h4>{name}</h4>
                <span className={'item'}> {createTime}</span>
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
        </div>
        <Button className={'backForward'} type={'primary'} onClick={() => history.push('/student/homework')}> 返回作业列表 < /Button>
    </div>;
}
