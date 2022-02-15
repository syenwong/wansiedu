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
import React, { useContext } from 'react';
import { Modal } from 'antd';
import { EDU_CONTEXT } from '../store';
import { PaperInfo } from '../views/Teacher/Examinationpaper/components/EditModalGroup/PaperInfo';
import { SubjectsEdit } from '../views/Teacher/Examinationpaper/components/EditModalGroup/SubjectsEdit';
import { EXAPAPER_MODAL_TITLE } from '../service/STATIC_DATA';
import { useActionHandlerMaps } from './useActionHandlerMaps';
import { ViewExaPaper } from './ViewExaPaper';

const ModalContent = [
    PaperInfo, // 试卷信息编辑
    SubjectsEdit, // 试卷题目编辑
    ViewExaPaper // 查看试卷
];
const ModalWidth = [
    '50%',
    '96%',
    '96%'
];
export function GlobalModal () {
    const { state } = useContext(EDU_CONTEXT);
    const { globalModalRenderIndex } = state;
    const CurrentModalContent = ModalContent[globalModalRenderIndex] || '';
    const actionHandler = useActionHandlerMaps();
    return <Modal
        maskClosable={false}
        title={EXAPAPER_MODAL_TITLE[globalModalRenderIndex]}
        width={ModalWidth[globalModalRenderIndex]}
        closable={true}
        footer={null}
        onCancel={() => {
            actionHandler('resetEditExaPaper');
        }}
        visible={globalModalRenderIndex > -1}>
        <CurrentModalContent />
    </Modal>;
}
