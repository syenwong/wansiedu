/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/17.
 * Copyright 2021/8/17 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/17
 * @version */
import { GRADE_MAP } from './STATIC_DATA';
import moment from 'moment';

const now = new Date();
const month = now.getMonth();
const year = now.getFullYear();
export function smTr (t) {
    if (!t || t === 'none' || isNaN(t)) {
        return 0;
    }
    const ms = t % 1000;
    const allSecons = Math.floor(t / 1000);
    const second = allSecons % 60;
    const min = Math.floor(allSecons / 60);
    if (t < 1000) {
        return `${t / 1000}"`;
    } else if (t > 1000 && t < 6000) {
        return `${second}.${ms}"`;
    } else {
        return `${min}'${second}"`;
    }
}
// 通过年级获取入学
export function getStartTimer (grade) {
    return year - (grade - (month >= 8 ? 0 : 1));
}
// 通过入学获取年级
export function getStudentGrade (St) {
    return (GRADE_MAP.find(g => {
        return g[1] === year - St + (month >= 8 ? 0 : 1);
    }))[0];
}
export function formatDateHw (t, f = 'YYYY-MM-DD HH:mm') {
    let _t = t.replace(/-/ig, '/');
    return moment(new Date(_t)).format(f);
}
