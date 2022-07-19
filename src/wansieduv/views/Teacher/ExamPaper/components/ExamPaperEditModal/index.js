/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/18.
 * Copyright 2021/11/18 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/18
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../../../../../store';
import { Modal } from 'antd';
import { EditEpForm } from './EditEpForm';

export function ExamPaperEditModal () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { currentExamPaper, editExamPaperModalVisible } = state;
    const editCancel = () => {
        dispatch({ currentExamPaper: null, editExamPaperModalVisible: false });
    };
    const title = `${currentExamPaper?.id ? '修改' : '创建'}试卷`;
    return <Modal visible={editExamPaperModalVisible}
                  maskClosable={false}
                  title={title}
                  width={720}
                  closable={true}
                  footer={null}
                  onCancel={editCancel}>
        {editExamPaperModalVisible && <EditEpForm title={title} editCancel={editCancel} />}
    </Modal>;
}

