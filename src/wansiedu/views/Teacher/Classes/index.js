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
import React, { useEffect } from 'react';
import { GlobalTop } from '../../../globalComponents/GlobalTop';
import { TeacherRightNav } from '../_common/TeacherRightNav';
import { ClassCard } from './ClassCard';
import { useGetLabels } from '../../../globalComponents/useGetLabels';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
export function Classes () {
    const getLablels = useGetLabels();
    useEffect(() => {
        getLablels();
    }, []);
    return <div className="g-classes">
        <GlobalTop title={'分类标签管理'} />
        <div className={'g-operation'}>
            标签管理
            <TeacherRightNav currentKey={'classes'} />
        </div>
        
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
