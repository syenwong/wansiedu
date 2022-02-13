/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/15.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Affix } from 'antd';
import { ViewExamPaperInfo } from './components/ViewExamPaperInfo';
import { ViewExamPaperSubjects } from './components/ViewExamPaperSubjects';
import { TypeDetailsMap } from './components/TypeDetailsMap';
import { SubjectNav } from './components/SubjectNav';
import { useHistory } from 'react-router-dom';
import { EDU_CONTEXT } from '../../../store';

export function ViewStudentExamTask (props) {
    const tid = props?.match?.params?.tid;
    const history = useHistory();
    const { state: { ViewStudentExamTask } } = useContext(EDU_CONTEXT);
    const [subjects, setSubjects] = useState([]);
    const [subjectNoList, setSubjectNoList] = useState([]);
    useEffect(() => {
        if (!ViewStudentExamTask) {
            history.push('/Teacher/homework');
            return;
        }
        setSubjects(ViewStudentExamTask.subjectTimeAndAnswers);
    }, []);
    return <>
        <div className={'g-TeacherViewExamPaperWrap'}>
            <Affix style={{ position: 'relative', zIndex: 99 }}><ViewExamPaperInfo /></Affix>
            <div className={'g-viewExamPaperSubjectsList'}>
                <Affix offsetTop={42} style={{ width: '10%' }}><SubjectNav subjectNoList={subjectNoList} /></Affix>
                <ViewExamPaperSubjects subjects={subjects} />
                <Affix offsetTop={42} style={{ width: '24%' }}><TypeDetailsMap /></Affix>
            </div>
        </div>
    </>;
}
