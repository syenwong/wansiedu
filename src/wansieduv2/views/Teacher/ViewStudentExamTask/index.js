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
// 工具及存储
import { EDU_CONTEXT } from '../../../store';

// 内部组件
import { ViewExamPaperInfo } from './components/ViewExamPaperInfo';
import { ViewExamPaperSubjects } from './components/ViewExamPaperSubjects';
import { TypeDetailsMap } from './components/TypeDetailsMap';
import { SubjectNav } from './components/SubjectNav';
// 逻辑
import { Affix, Button, message } from 'antd';
import { AddSignModal } from '../../../globalComponents/AddSignModal';
import { MARK_PREFIX } from '../../../service/STATIC_DATA';
import { studentTimeApi } from '../../../service/api/teacher/homework';
import { delayeringSubject } from '../../../service/utils';
import { DrawerInfo } from './components/DrawerInfo';


const { ckMark } = MARK_PREFIX;
export function ViewStudentExamTask (props) {
    const { state: { clientHeight } } = useContext(EDU_CONTEXT);
    const { stid, sid } = props?.match?.params;
    const [studentInfo, setStudentInfo] = useState({});
    
    const viewExaPaperHandler = async () => {
        try {
            const _studentInfo = await studentTimeApi(stid, sid);
            const { subjectTimeAndAnswers, typeDetailsMap } = _studentInfo;
            const subjectTimeAndAnswersList = delayeringSubject({ data: subjectTimeAndAnswers, subjectIdKey: 'subjectId' });
            
            let totalTime = 0;
            let checkScoreTotal = 0;
            let scoreTotal = 0;
            
            const types_Maps = [];
            const NoList = [];
            
            for (const subjectTimeAndAnswersListElement of subjectTimeAndAnswersList) {
                const { no, type, spendTime, checkScore, score, answer_img } = subjectTimeAndAnswersListElement;
                totalTime += spendTime;
                checkScoreTotal += (checkScore === -1 ? 0 : checkScore);
                scoreTotal += score;
                NoList.push({
                    Noo: no,
                    No: String(no).replaceAll('.', '_'),
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
                            typeDetailsMap[_typeArElement].Nos.push(no);
                        }
                    }
                }
            }
            const typeDetailsList = Object.values(typeDetailsMap);
            for (const typeDetailsMapElement of typeDetailsList) {
                const { time, checkScore } = typeDetailsMapElement;
                typeDetailsMapElement.ratio = checkScore > -1 ? (checkScore / (time / 60000)).toFixed(2) : 'NA';
            }
            Object.assign(_studentInfo, { total: subjectTimeAndAnswersList.length, totalTime, NoList, subjectTimeAndAnswersList, checkScoreTotal, scoreTotal, typeDetailsList });
            setStudentInfo(_studentInfo);
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
        <div className={'g-teacherViewStudentExamPaperWrap'}>
            <div className={'layout-studentViewExamPaperWrap-nav'}>
                <Button type={'primary'} onClick={() => window.history.go(-1)}> 返回作业列表 < /Button>
                <SubjectNav subjectNoList={studentInfo?.NoList ?? []} />
            </div>
            <div className={'layout-studentViewExamPaperWrap-content'} style={{ height: `${clientHeight - 54}px` }}>
                <ViewExamPaperSubjects stid={studentInfo.stid} subjects={studentInfo?.subjectTimeAndAnswersList ?? []} />
            </div>
            <div className={'layout-studentViewExamPaperWrap-info'} style={{ height: `${clientHeight - 54}px` }}>
                <Affix offsetTop={49}>
                    <div className={'g-viewExamPaperInfoWrap'}>
                        <ViewExamPaperInfo studentInfo={studentInfo} />
                        <DrawerInfo typeDetailsList={studentInfo?.typeDetailsList} />
                    </div>
                </Affix>
                <TypeDetailsMap typeDetailsList={studentInfo?.typeDetailsList} />
            </div>
        </div>
        <AddSignModal type={ckMark} callback={viewExaPaperHandler} />
    </>;
}
