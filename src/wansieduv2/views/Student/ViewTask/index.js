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
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
// 工具及存储
import { EDU_CONTEXT } from '../../../store';
// 外部组件
import { GlobalTop } from '../../../globalComponents/GlobalTop';
// 内部组件
import { ViewExamPaperInfo } from './components/ViewExamPaperInfo';
import { ViewExamPaperSubjects } from './components/ViewExamPaperSubjects';
import { TypeDetailsMap } from './components/TypeDetailsMap';
import { SubjectNav } from './components/SubjectNav';
// 逻辑
import { useStudentHandlers } from '../../../Controller/useStudentHandlers';
import { Affix, Button, message } from 'antd';
import { AddSignModal } from '../../../globalComponents/AddSignModal';
import { MARK_PREFIX } from '../../../service/STATIC_DATA';

const { anMark } = MARK_PREFIX;
export function ViewTask (props) {
    const tid = props?.match?.params?.tid;
    const history = useHistory();
    const { state: { clientHeight, currentTaskExaPaper } } = useContext(EDU_CONTEXT);
    const { subjects = [], NoList = [] } = currentTaskExaPaper || {};
    const studentHandlers = useStudentHandlers();
    const viewExaPaperHandler = async () => {
        try {
            await studentHandlers('viewExaPaper', tid);
        } catch (e) {
            message.error(e.message);
        }
        
    };
    useEffect(() => {
        (async () => {
            await viewExaPaperHandler();
        })();
    }, []);
    return <>
        <GlobalTop />
        <div className={'g-studentViewExamPaperWrap'}>
            <div className={'layout-studentViewExamPaperWrap-nav'}>
                <Button type={'primary'} onClick={() => history.push('/student/homework')}> 返回作业列表 < /Button>
                <SubjectNav subjectNoList={NoList} />
            </div>
            <div className={'layout-studentViewExamPaperWrap-content'} style={{ height: `${clientHeight - 54}px` }}>
                <ViewExamPaperSubjects stid={tid} subjects={subjects} />
            </div>
            <div className={'layout-studentViewExamPaperWrap-info'} style={{ height: `${clientHeight - 54}px` }}>
                <Affix offsetTop={49}><ViewExamPaperInfo /></Affix>
                <TypeDetailsMap />
            </div>
        </div>
        <AddSignModal type={anMark} callback={viewExaPaperHandler} />
    </>;
}
