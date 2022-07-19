/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/27.
 * Copyright 2021/12/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/27
 * @version */
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../store';
import { Modal } from 'antd';
import { getTaskListApi, getSubjectlistApi } from '../service/api/student';
import { delayeringSubject, resolveSubjectUrl, serializeSubject } from '../service/utils';


export function useStudentHandlers () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const handlers = {
        async getTaskList () {
            try {
                const studentTaskList = await getTaskListApi();
                console.log(studentTaskList);
                dispatch({
                    studentTaskListOrigin: studentTaskList
                });
                return studentTaskList;
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        async viewExaPaper (tid) {
            try {
                const { subjectWithTimes, typeDetailsMap } = await getSubjectlistApi(tid);
                let checkScoreTotal = 0;
                let scoreTotal = 0;
                let totalTime = 0;
                for (const currentTaskExaPaperElement of subjectWithTimes) {
                    const { checkScore, score, time } = currentTaskExaPaperElement;
                    checkScoreTotal += checkScore < 0 ? 0 : checkScore;
                    scoreTotal += score;
                    totalTime += time;
                }
                for (const key of Object.keys(typeDetailsMap)) {
                    const { checkScore, time } = typeDetailsMap[key];
                    typeDetailsMap[key].ratio = checkScore > -1 ? (checkScore / (time / 60000)).toFixed(2) : 'NA';
                    typeDetailsMap[key].key = key;
                }
                const _subjects = delayeringSubject({ data: subjectWithTimes, key: null });
                
                const NoList = [];
                for (const subject of _subjects) {
                    const { No, checkScore, score, type, answer_img } = subject;
                    NoList.push({
                        Noo: No,
                        No: No.replaceAll('.', '_'),
                        hasAnswer: Boolean(answer_img),
                        hasChecked: checkScore > -1,
                        hasError: checkScore < score
                    });
                    // 分类整理
                    if (type) {
                        const typeAr = type.split(',');
                        for (const _typeArElement of typeAr) {
                            if (typeDetailsMap?.[_typeArElement]) {
                                typeDetailsMap[_typeArElement].Nos = typeDetailsMap[_typeArElement].Nos || [];
                                typeDetailsMap[_typeArElement].Nos.push(No);
                            }
                        }
                    }
                }
                NoList.sort((s1, s2) => {
                    return Number(s1.Noo) - Number(s2.Noo);
                });
                const currentTaskExaPaper = {
                    subjects: _subjects,
                    typeDetailsMap,
                    typeDetailsList: Object.values(typeDetailsMap),
                    subjectWithTimes,
                    checkScoreTotal,
                    scoreTotal,
                    totalTime,
                    total: subjectWithTimes.length,
                    NoList
                };
                dispatch({ currentTaskExaPaper });
                return currentTaskExaPaper;
            } catch (e) {
                console.log(e);
            }
        }
    };
    return async function (type, c, params) {
        return handlers[type](c, params);
    };
}
