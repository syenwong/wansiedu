/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/23.
 * Copyright 2021/9/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/23
 * @version */
import React, { useContext, useEffect, useState } from 'react';
import { ExamPaperContent } from '../../../../globalComponents/ExamPaperContent';
import { EDU_CONTEXT } from '../../../../store';
import { Tag } from 'antd';
import { TAGS_COLORES } from '../../../../service/STATIC_DATA';

export function SelectExaPaper () {
    const { state: { editHomeworkData, ExamPaperList } } = useContext(EDU_CONTEXT);
    const [currentExa, setCurrentExa] = useState(null);
    useEffect(() => {
        const c = Array.isArray(ExamPaperList?.data) && ExamPaperList.data.find(c => {
            return c.id === editHomeworkData.eid;
        }) || null;
        setCurrentExa(c);
    }, [editHomeworkData, ExamPaperList]);
    return <div className={'g-homeworkSelectExaPaper'}>
        {
            currentExa ?
                <div className={'selectedPaper'}>
                    <div className={'selectedPaper-current'}>
                        <p>{currentExa.createTime}</p>
                        <p>{currentExa.name}</p>
                        <p>{(currentExa.labels ? currentExa.labels.split(',') : []).map((l, index) => {
                            return <Tag key={index} color={TAGS_COLORES[index]}>{l}</Tag>;
                        })}</p>
                    </div>
                </div> :
                <div className={'selectedPaper'}>当前未选择试卷</div>
        }
        <ExamPaperContent showType={'homework'} pageSize={8} showSearch={true} />
    </div>;
}
