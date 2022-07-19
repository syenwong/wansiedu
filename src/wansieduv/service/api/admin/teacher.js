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
import Ax from '../Ax.js';
import { DEFAULT_PAGE_SIZE } from '../../STATIC_DATA';
// 新增 、 修改教师
export async function editTeacherApi (_data, uid = null) {
    try {
        const data = Object.assign({}, _data);
        if (uid) {
            data.tid = uid;
        }
        return await Ax.post(`/admin/${uid ? 'update' : 'add'}Teacher`, data);
    } catch (e) {
        throw e;
    }
}
// 获取教师列表
export async function getTeachersListApi (__configs = {}) {
    try {
        const _configs = {};
        for (const config of Object.entries(__configs)) {
            const [k, v] = config;
            if (v) {
                _configs[k] = v;
            }
        }
        return await Ax.get('/admin/listTeacher', _configs);
    } catch (e) {
        throw e;
    }
}
// 删除教师列表
export async function deleteTeacherApi (tid) {
    try {
        return await Ax.post('/admin/delTeacher', { tid });
    } catch (e) {
        throw e;
    }
}
