/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/7.
 * Copyright 2021/9/7 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/7
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { EDU_CONTEXT } from '../store';
import { Image, Tag } from 'antd';
import { smTr } from '../service/utils';

export function ViewExaPaper () {
    const {
        state: {
            currentExaPaper: {
                name,
                labels
            },
            currentExaPaper_subjects,
            eidtModalHeight
        }
    } = useContext(EDU_CONTEXT);
    const subjects = Array.isArray(currentExaPaper_subjects) ?
        currentExaPaper_subjects :
        (Array.isArray(currentExaPaper_subjects.data) ? currentExaPaper_subjects.data : []);
    return <div className={'g-editSubjectsWrap'}>
        <div className={'editsubject-header'}>
            <h2>{name}</h2>
            <div className={'labels'}>{(labels ? labels.split(',') : []).map((l, index) => {
                return <Tag key={index}>{l}</Tag>;
            })}</div>
        </div>
        <div className={'m-paparContentList'} style={{ height: eidtModalHeight - 80 + 'px' }}>
            <ul>{(subjects || []).map((p, index) => {
                return <li key={index}>
                    <div className={'paperContent'}>
                        <h2>
                            <span className={'No'}>No{index + 1} </span>
                            {p.time && <span className={'time'}>{smTr(p.time)}</span>}
                        </h2>
                        <div className={'viewImg'} >
                            <Image width={'100%'} src={p.url} />
                        </div>
                        <p className={'remark'}>{p.remark}</p>
                    </div>
                </li>;
            })}</ul>
        </div>
    </div>;
}
