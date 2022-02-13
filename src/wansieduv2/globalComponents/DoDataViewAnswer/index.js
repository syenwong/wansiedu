/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/9.
 * Copyright 2022/1/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/9
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Tag } from 'antd';
import { EDU_CONTEXT } from '../../store';

export function DoDataViewAnswer (props) {
    const { state: { canvasRatio } } = useContext(EDU_CONTEXT);
    const { viewAnswerContent, modalHeight } = props;
    const { answerUrl, no, checkUrl, type } = viewAnswerContent;
    return <div className={'g-modalDoDataViewAnswer'}>
        <div className={'examInfo'}>
            <h2>第{no}题</h2>
            <div>
                {
                    (type || '').split(',').map((t, i) => {
                        return <Tag key={i}>{t}</Tag>;
                    })
                }
            </div>
        </div>
        {
            answerUrl ?
                <div className={'subjectView'} style={{ width: modalHeight / canvasRatio + 'px', height: modalHeight + 'px' }}>
                    <div className={'qu'}>
                        {
                            viewAnswerContent?.url.map((a, i) => {
                                return <img key={i} src={a} alt="ViewAnswer" />;
                            })
                        }
                    </div>
                    <div className={'an'}>
                        <img src={viewAnswerContent?.answerUrl} alt="ViewAnswer" />
                    </div>
                    {
                        checkUrl
                        &&
                        <div className={'ck'}>
                            <img src={viewAnswerContent?.checkUrl} alt="ViewAnswer" />
                        </div>
                    }
                </div> :
                '未作答'}
    </div>;
}
