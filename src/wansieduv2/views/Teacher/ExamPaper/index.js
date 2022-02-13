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
import './style.less';
import React, { useEffect, useContext } from 'react';
import { ExamPaperContent } from '../../../globalComponents/ExamPaperContent/';
import { OperatePannel } from './components/OperatePannel';
import { ExamPaperEditModal } from './components/ExamPaperEditModal';
import { EDU_CONTEXT } from '../../../store';

export function ExamPaper () {
    const { dispatch } = useContext(EDU_CONTEXT);
    useEffect(() => dispatch({ currentTeacherNavKey: 'examPaper' }), []);
    return <div className={'g-globalContent g-homework'}>
        <ExamPaperContent extOperate={<OperatePannel />} />
        <ExamPaperEditModal />
    </div>;
}
