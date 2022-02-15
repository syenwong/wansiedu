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
import Ax from './Ax';
import CryptoJS from 'crypto-js';

function setSSAndAx (uid, token, role, account) {
    Ax.setConfigs({
        headers: {
            uid,
            token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    uid && window.localStorage.setItem('wse_uid', uid);
    token && window.localStorage.setItem('wse_token', token);
    role && window.localStorage.setItem('wse_role', role);
    account && window.localStorage.setItem('wse_account', account);
}
export async function loginApi (account, pwd) {
    try {
        const userInfo = await Ax.loginRequest('/user/login', {
            account,
            pwd: CryptoJS.MD5(pwd, 32).toString()
        });
        const { uid, token, role } = userInfo;
        setSSAndAx(uid, token, role, account);
        return { ...userInfo, account };
    } catch (e) {
        throw e;
    }
}
export async function changePwdApi (oldPwd, newPwd) {
    try {
        return await Ax.post('/user/updatePwd', {
            oldPwd,
            newPwd
        });
        // setSSAndAx(uid,token,role);
    } catch (e) {
        throw e;
    }
}
