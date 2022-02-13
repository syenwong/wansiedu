/**
 * File Created by duanmingxue at 2021-09-03.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2021-09-03
 * @version */
import './style.less';
import React, { useContext, useEffect } from 'react';
import { ClassCard } from './ClassCard';
import { useLabelsMng } from '../../../Controller/useLabelsMng';
import { Tabs } from 'antd';
import { EDU_CONTEXT } from '../../../store';

const { TabPane } = Tabs;
export function Classes () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const labelsMng = useLabelsMng();
    useEffect(() => {
        labelsMng('getLabels');
        dispatch({ currentTeacherNavKey: 'classes' });
    }, []);
    return <div className="g-classes">
        <div className={'g-cardsStyle'}>
            <div className={'g-TabList'}>
                <Tabs type="card">
                    <TabPane tab="学生分类标签" key="1">
                        <ClassCard type={'student'} />
                    </TabPane>
                    <TabPane tab="试卷分类标签" key="2">
                        <ClassCard type={'exam'} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>;
}
