/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/20.
 * Copyright 2021/12/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { SubjectItem } from './SubjectItem';
import { EDU_CONTEXT } from '../../../../store';

export function ViewExamPaperSubjects (props) {
    const { subjects } = props;
    const { state: { clientWidth } } = useContext(EDU_CONTEXT);
    const [imgSize] = useState((clientWidth - 32) * .64 - 42 - 48);
    return <>
        {
            subjects.length > 0 ?
                <ul className={'g-subjects'}>
                    {subjects.map((s, i) => {
                        const No = (s?.No ?? '').replace(/\./ig, '_');
                        return <li data-isroot={1} id={`subjectItem_id_${No}`} key={i} className={'mainSubject'}>
                            <div className={'subjectLabel'}>
                                <span className={'No'}>{i + 1}</span>
                            </div>
                            {
                                s.isParent ?
                                    <>
                                        
                                        {
                                            s.remark &&
                                            <div className={'mainSubject_content'}>
                                                {s.remark && <div className={'subjectRemark'}>
                                                    {s.remark}
                                                </div>}
                                            </div>
                                        }
                                        {
                                            Array.isArray(s.subSubjects) && s.subSubjects.length > 0 ?
                                                <ul className={'subSubject'}>
                                                    {
                                                        s.subSubjects.map((ss, j) => {
                                                            const _No = (ss?.No ?? '').replace(/\./ig, '_');
                                                            return <li data-isroot={0} id={`subjectItem_id_${_No}`} key={j}><SubjectItem imgSize={imgSize} subject={ss} /></li>;
                                                        })
                                                    }
                                                </ul> : '无小题'
                                        }
                                    </> :
                                    <SubjectItem imgSize={imgSize} subject={s} />
                            }
                        </li>;
                    })}
                </ul> :
                <div className={'none'}>加载中...</div>
        }
    </>;
}
