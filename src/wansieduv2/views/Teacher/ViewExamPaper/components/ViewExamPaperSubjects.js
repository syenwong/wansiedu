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
import React, { useContext, useEffect, useMemo } from 'react';
import { serializeSubject } from '../../../../service/utils';
import { SubjectItem } from './SubjectItem';
import { EDU_CONTEXT } from '../../../../store';
import { useExamPaperAdmin } from '../../../../Controller/useExamPaperAdmin';
import { Image } from 'antd';

export function ViewExamPaperSubjects () {
    const { state: { currentExamPaper, currentExamPaperSubjects }, dispatch } = useContext(EDU_CONTEXT);
    const { data = [] } = currentExamPaperSubjects || {};
    const examPaperAdmin = useExamPaperAdmin();
    useEffect(() => {
        if (currentExamPaper?.id) {
            examPaperAdmin('getExamSubjectsList', currentExamPaper.id).then((currentExamPaperSubjects) => {
                dispatch({ currentExamPaperSubjects });
            });
        }
    }, [currentExamPaper]);
    const subjects = useMemo(() => serializeSubject(data, null), [data]);
    return <div className={'g-viewExamPaperSubjectsList'} style={{ height: document.documentElement.offsetHeight - 150 }}>
        {
            subjects.length > 0 ?
                <ul className={'g-subjects'}>
                    {subjects.map((s, i) => {
                        return <li key={i} className={'mainSubject'}>
                            <div className={'subjectLabel'}>
                                <span className={'No'}>{i + 1}</span>
                            </div>
                            {
                                s.isParent ?
                                    <>
                                        
                                        {
                                            (s.url || s.remark) &&
                                            <div className={'mainSubject_content'}>
                                                {s.remark && <div className={'subjectRemark'}>
                                                    {s.remark}
                                                </div>}
                                                <Image src={s.url} alt="" />
                                            </div>
                                        }
                                        {
                                            Array.isArray(s.subSubjects) && s.subSubjects.length > 0 ?
                                                <ul className={'subSubject'}>
                                                    {
                                                        s.subSubjects.map((ss, j) => {
                                                            return <li key={j}>
                                                                {
                                                                    Number(ss.parentId) !== 0 &&
                                                                    <span className={'subSubjectNo'}>{ss.No}</span>
                                                                }
                                                                <SubjectItem subject={ss} />
                                                            </li>;
                                                        })
                                                    }
                                                </ul> : '添加小题'
                                        }
                                    </> :
                                    <SubjectItem subject={s} />
                            }
                        </li>;
                    })}
                </ul> :
                <div className={'none'}>暂无题目</div>
        }
    </div>;
}
