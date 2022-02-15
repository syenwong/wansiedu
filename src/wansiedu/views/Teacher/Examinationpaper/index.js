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
import './style.less';
import React, { useContext } from 'react';
import { GlobalTop } from '../../../globalComponents/GlobalTop';
import { ExaPaperContent } from '../../../globalComponents/ExaPaperContent';
import { OperatePannel } from './components/OperatePannel';

export function Examinationpaper () {
    return <div className={'g-homework'}>
        <GlobalTop title={'考试管理'} />
        <OperatePannel />
        <div className={'g-content'}><ExaPaperContent /></div>
    </div>;
}
