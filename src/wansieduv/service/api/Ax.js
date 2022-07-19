/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/19.
 * Copyright 2021/9/19 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/19
 * @version */
import React from 'react';
import axios from 'axios';

const Ax = {
    _ax: axios,
    headers: {},
    _loginAx: axios.create(),
    _logout () {
        window.localStorage.clear();
        location.replace('/opt/file/');
    },
    setConfigs (configs) {
        this._ax = axios.create(configs);
        this.headers = configs.headers;
    },
    init () {
        const ss_uid = window.localStorage.getItem('wse_uid');
        const ss_token = window.localStorage.getItem('wse_token');
        const ss_role = window.localStorage.getItem('wse_role');
        if (ss_uid && ss_token && ss_role) {
            this.setConfigs({
                headers: {
                    uid: ss_uid,
                    token: ss_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
    },
    async loginRequest (url, params, method = 'post') {
        const _config = Object.assign({}, { url: '/edu' + url, params }, { method });
        try {
            const { data: resData } = await this._loginAx(_config);
            if (resData?.code === 10000) {
                return resData?.data ?? {};
            } else {
                throw resData;
            }
        } catch (e) {
            throw e;
        }
    },
    async request (url, params, method = 'post', otherConfigs = {}) {
        const _config = Object.assign({}, { url: '/edu' + url, params }, { method }, otherConfigs);
        try {
            const { data: resData, headers } = await this._ax(_config);
            if (_config.direct) {
                return { data: resData, headers };
            } else {
                if (this.headers.token && this.headers.uid) {
                    switch (resData?.code) {
                        case 10000:
                            return resData?.data ?? {};
                        case 50004 :
                            this._logout();
                            break;
                        default:
                            throw resData;
                            break;
                    }
                } else {
                    this._logout();
                }
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async get (url, params, otherConfigs) {
        try {
            return await this.request(url, params, 'get', otherConfigs);
        } catch (e) {
            throw e;
        }
    },
    async post (url, params, otherConfigs) {
        try {
            return await this.request(url, params, 'post', otherConfigs);
        } catch (e) {
            throw e;
        }
    }
};
Ax.init();
export default Ax;
