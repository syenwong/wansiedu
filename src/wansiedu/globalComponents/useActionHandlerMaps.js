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
import { EDU_CONTEXT } from '../store';
import { Modal } from 'antd';
import { deleteExamPaperApi, getExaPapersApi, getSubjectListApi } from '../service/api/teacher/exam';
import { getSubjectlistApi as getStudentSubjectListApi } from '../service/api/student';
import { getTaskListApi } from '../service/api/student';

const editExaPaperOrigin = {
    globalModalRenderIndex: -1,
    currentExaPaper_Info: {
        id: '',
        name: '',
        labels: ''
    },
    currentExaPaper_subjects: []
};
export function useActionHandlerMaps () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const handlers = {
        /*
        * 试卷操作
        */
        __setCurrentExaPaper (c, index) {
            dispatch({
                globalModalRenderIndex: index,
                currentExaPaper_Info: {
                    id: c.id,
                    name: c.name,
                    labels: c.labels
                }
            });
        },
        async getPaperList (_configs = {}) {
            const configs = Object.assign({}, { page: 1, size: 10 }, _configs);
            try {
                const ExaPaperList = await getExaPapersApi(configs);
                dispatch({
                    ExaPaperList
                });
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        editExaPaper (c) {
            if (c) {
                this.__setCurrentExaPaper(c, 0);
            } else {
                const editExaPaper = Object.assign({}, editExaPaperOrigin, { globalModalRenderIndex: 0 });
                dispatch(editExaPaper);
            }
        },
        deleteExaPaper (c) {
            const that = this;
            Modal.confirm({
                title: <div>确定删除试卷</div>,
                content: c.name,
                cancelText: '我好像点错了',
                okText: '确定删除该试卷',
                async onOk () {
                    try {
                        await deleteExamPaperApi(c.id);
                        that.getPaperList();
                    } catch (e) {
                        Modal.error({
                            title: e.message
                        });
                    }
                }
            });
        },
        resetEditExaPaper () {
            dispatch(Object.assign({}, editExaPaperOrigin));
        },
        async getSubjectsList (id, role = 'teacher') {
            const api = role === 'teacher' ? getSubjectListApi : getStudentSubjectListApi;
            try {
                const subjects = await api(id);
                dispatch({
                    currentExaPaper_subjects: subjects
                });
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        editSubjects (s) {
            this.__setCurrentExaPaper(s, 1);
            this.getSubjectsList(s.id);
        },
        async viewExaPaper (c, role) {
            try {
                await this.getSubjectsList(c.id, role);
                this.__setCurrentExaPaper(c, 2);
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        selectExaPaper (c) {
            dispatch({
                editHomeworkData: Object.assign({}, state.editHomeworkData, { exaPaperId: c.id })
            });
        },
        /*
        
        // 学生作业操作
        
        */
        // 作业
        async getTaskList () {
            try {
                const studentTaskList = await getTaskListApi();
                dispatch({
                    studentTaskList: studentTaskList
                });
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        }
    };
    return async function (type, c, params) {
        return handlers[type](c, params);
    };
}
