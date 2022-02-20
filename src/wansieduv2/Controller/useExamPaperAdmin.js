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
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../store/index';
import { useModalError } from './useModalError';
import { deleteExamPaperApi, deleteSubjectApi, changeSortApi, getExamPapersApi, getSubjectListApi, editSubjectItemApi } from '../service/api/teacher/exam';
import { getSubjectlistApi as getStudentSubjectListApi } from '../service/api/student';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { DEFAULT_SUBJECT } from '../service/STATIC_DATA';

export function useExamPaperAdmin () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const history = useHistory();
    const ModalError = useModalError();
    const handlers = {
        viewExaPaper (exampaper) {
            dispatch({
                currentExamPaper: exampaper,
                ViewExamPaperVisible: true
            });
        },
        resetEditExaPaper () {
            dispatch({
                currentExamPaper: null,
                currentExamPaperSubjects: null,
                ViewExamPaperVisible: false
            });
        },
        async getExamPaperList (_configs = {}) {
            const configs = Object.assign({}, { page: 1, size: 10 }, _configs);
            try {
                dispatch({
                    ExamPaperList: await getExamPapersApi(configs)
                });
            } catch (e) {
                ModalError(e.message);
            }
        },
        deleteExamPaper (c) {
            const that = this;
            Modal.confirm({
                title: <div>确定删除试卷</div>,
                content: c.name,
                cancelText: '我好像点错了',
                okText: '确定删除该试卷',
                async onOk () {
                    try {
                        await deleteExamPaperApi(c.id);
                        await that.getExamPaperList();
                    } catch (e) {
                        ModalError(e.message);
                    }
                }
            });
        },
        // 编辑题目专用
        async getExamSubjectsListForEdit () {
            try {
                const { data = [], total = 0 } = await getSubjectListApi(state.currentExamPaper.id);
                let typeMap = [];
                for (const datum of data) {
                    datum.type = (typeof datum.type === 'string' && datum.type !== '') ? datum.type.split(',') : [];
                    typeMap = typeMap.concat(datum.type);
                }
                const totalNum = (data ?? []).reduce((v1, v2) => {
                    return v1 + v2.score;
                }, 0);
                const currentExamPaperSubjects = { data, totalNum, total, typeMap: [...new Set(typeMap)] };
                dispatch({
                    currentExamPaperSubjects
                });
                return currentExamPaperSubjects;
            } catch (e) {
                throw e;
            }
        },
        async getExamSubjectsList (id, role = 'teacher') {
            const api = role === 'teacher' ? getSubjectListApi : getStudentSubjectListApi;
            try {
                const { data = [], total = 0 } = await api(id);
                let typeMap = [];
                for (const datum of data) {
                    datum.type = (typeof datum.type === 'string' && datum.type !== '') ? datum.type.split(',') : [];
                    typeMap = typeMap.concat(datum.type);
                }
                return { data, total, typeMap: [...new Set(typeMap)] };
            } catch (e) {
                throw e;
            }
        },
        // 试卷列表，转向编辑试卷用
        // 获取当前试卷信息并转向
        async rediectExamPaperOperation (currentExamPaper, path) {
            try {
                dispatch({
                    currentExamPaper
                });
                history.push(`/teacher/${path}`);
            } catch (e) {
                ModalError(e.message);
            }
        },
        async updateSubjectItem (eid, subjectId, subjectItem) {
            const that = this;
            try {
                const { key, value } = subjectItem;
                const requestData = {
                    eid, subjectId
                };
                switch (key) {
                    case 'file':
                        const file = new FormData();
                        file.append('file', value, value.name);
                        requestData.file = file;
                        break;
                    default:
                        requestData[key] = value;
                }
                await editSubjectItemApi(requestData);
                await that.getExamSubjectsListForEdit();
            } catch (e) {
                ModalError(e.message);
            }
        },
        // 编辑/新增题目
        async updateSubject (type, subject) {
            let currentEditSubject = DEFAULT_SUBJECT,
                editSubjectModalVisible = false;
            switch (type) {
                // 新增
                case 'add':
                    currentEditSubject = Object.assign({}, DEFAULT_SUBJECT, subject);
                    editSubjectModalVisible = true;
                    break;
                // 新增子题目
                case 'addSub':
                    currentEditSubject = Object.assign({}, DEFAULT_SUBJECT, subject, { isParent: false, parentId: subject.id });
                    editSubjectModalVisible = true;
                    if (subject.id) {
                        //
                    } else {
                        currentEditSubject = Object.assign({}, DEFAULT_SUBJECT, { isParent: true, No: subject.No });
                        editSubjectModalVisible = true;
                    }
                    break;
                // 编辑
                case 'edit':
                    currentEditSubject = subject;
                    editSubjectModalVisible = true;
                    break;
                // 关闭
                case 'close':
                    currentEditSubject = DEFAULT_SUBJECT;
                    editSubjectModalVisible = false;
                    break;
            }
            dispatch({
                editSubjectModalVisible,
                currentEditSubject
            });
        },
        deleteSubject (n, eid, id) {
            const that = this;
            Modal.confirm({
                title: `确定删除第${n}题`,
                async onOk () {
                    try {
                        await deleteSubjectApi(eid, id);
                        const currentExamPaperSubjects = await that.getExamSubjectsList(eid);
                        dispatch({ currentExamPaperSubjects });
                    } catch (e) {
                        ModalError(e.message());
                    }
                }
            });
        },
        async changeSubjectIndex (id1, id2, eid) {
            const that = this;
            try {
                await changeSortApi(id1, id2, eid);
                const currentExamPaperSubjects = await that.getExamSubjectsList(eid);
                dispatch({ currentExamPaperSubjects });
            } catch (e) {
                ModalError(e.message);
            }
        },
        selectExaPaper (c) {
            dispatch({
                editHomeworkData: Object.assign({}, state.editHomeworkData, { eid: c.id })
            });
        }
    };
    return async (type, ...c) => {
        try {
            return await handlers[type](...c);
        } catch (e) {
            ModalError(e.message);
        }
    };
}
