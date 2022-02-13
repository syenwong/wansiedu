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
import { resolveSubjectUrl, serializeSubject } from '../service/utils';


export function useStudentHandlers () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const handlers = {
        async getTaskList () {
            try {
                const studentTaskList = await getTaskListApi();
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
                const _subjectWithTimes = resolveSubjectUrl(subjectWithTimes);
                for (const currentTaskExaPaperElement of _subjectWithTimes) {
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
                const _subjects = serializeSubject(_subjectWithTimes, null, true);
                
                const NoList = [];
                for (const subject of _subjects) {
                    const { isParent, No, checkScore, score, type, subSubjects, answer_img, check_img, anMark_img, ckMark_img, url, parentUrl } = subject;
                    if (isParent === 1 && Array.isArray(subSubjects) && subSubjects.length > 0) {
                        for (const subSubject of subSubjects) {
                            const {
                                type: _sType,
                                No: _sNo,
                                checkScore: _sCheckScore,
                                score: _sScore,
                                answer_img: _sAnswerImg,
                                check_img: _sCheckImg,
                                anMark_img: _sAnMark,
                                ckMark_img: _sCkMark,
                                url: _sUrl,
                                parentUrl
                            } = subSubject;
                            // 题号列表
                            NoList.push({
                                Noo: _sNo,
                                No: _sNo.replaceAll('.', '_'),
                                hasAnswer: Boolean(_sAnswerImg),
                                hasChecked: _sCheckScore > -1,
                                hasError: _sCheckScore < _sScore
                            });
                            // 分类整理
                            if (_sType) {
                                const _typeAr = _sType.split(',');
                                for (const _typeArElement of _typeAr) {
                                    typeDetailsMap[_typeArElement].Nos = typeDetailsMap[_typeArElement].Nos || [];
                                    typeDetailsMap[_typeArElement].Nos.push(_sNo);
                                }
                            }
                            // 题目整理
                            subSubject.url = [_sUrl];
                            if (parentUrl) {
                                subSubject.url.unshift(parentUrl);
                            }
                        }
                    } else {
                        // 题号列表
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
                        // 图片整理
                        subject.url = [url];
                        if (parentUrl) {
                            subSubject.url.unshift(parentUrl);
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
        },
        async resetStudentTaskPaper () {
            dispatch({
                currentTask: null,
                currentTaskExaPaper: null
            });
        }
    };
    return async function (type, c, params) {
        return handlers[type](c, params);
    };
}
