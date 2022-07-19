/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/9.
 * Copyright 2021/8/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/9
 * @version */
import './global.less';
// eslint-disable-next-line no-unused-vars
import React, { useReducer } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { defaultState, reducer, EDU_CONTEXT } from '../store';
import routers from './routers';

export function App () {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <EDU_CONTEXT.Provider value={{ state, dispatch }}>
        <Router>
            {renderRoutes(routers)}
        </Router>
    </EDU_CONTEXT.Provider>;
}
