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
import { ExaPaperContent } from '../../../../globalComponents/ExaPaperContent';
import { EDU_CONTEXT } from '../../../../store';
import { Tag } from 'antd';
import { TAGS_COLORES } from '../../../../service/STATIC_DATA';

export function SelectExaPaper () {
    const { state: { editHomeworkData, ExaPaperList } } = useContext(EDU_CONTEXT);
    const [currentExa, setCurrentExa] = useState(null);
    useEffect(() => {
        const c = Array.isArray(ExaPaperList?.data) && ExaPaperList.data.find(c => {
            return c.id === editHomeworkData.exaPaperId;
        }) || null;
        setCurrentExa(c);
    }, [editHomeworkData, ExaPaperList]);
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
        <ExaPaperContent showType={'homework'} pageSize={8} showSearch={true} />
    </div>;
}
