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
import React, { useContext, useEffect } from 'react';
import { EDU_CONTEXT } from '../../../store';
import { useHistory } from 'react-router-dom';
import { EditExamPaperInfo } from './components/EditExamPaperInfo';
import { EditExamPaperSubjects } from './components/EditExamPaperSubjects';
import { Affix, message } from 'antd';
import { EditSubjectModal } from './components/EditSubjectModal/';
import { useExamPaperAdmin } from '../../../Controller/useExamPaperAdmin';

export function EditExamPaperSubject () {
    const history = useHistory();
    const { state: { currentExamPaper }, dispatch } = useContext(EDU_CONTEXT);
    const { id } = currentExamPaper || {};
    const examPaperAdmin = useExamPaperAdmin();
    useEffect(() => {
        dispatch({ currentTeacherNavKey: 'examPaper' });
        (async () => {
            if (currentExamPaper?.id) {
                try {
                    await examPaperAdmin('getExamSubjectsListForEdit');
                } catch (e) {
                    message.error(e.message);
                }
            } else {
                history.replace('/teacher/examPaper');
            }
        })();
    }, []);
    return <div className={'g-EditExamPaperWrap'}>
        <div className={'editExamPaperContainer'}>
            <Affix>
                <EditExamPaperInfo />
            </Affix>
            <EditExamPaperSubjects eid={id} />
            <EditSubjectModal eid={id} />
        </div>
    </div>;
}
