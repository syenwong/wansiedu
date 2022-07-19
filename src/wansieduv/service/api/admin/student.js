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
import { getStartTimer, getStudentGrade } from '../../utils';
import { GRADE_MAP } from '../../STATIC_DATA';
// 新增 、 修改学生
export async function editStudentApi (_data, uid = null) {
    try {
        const { account, name, grade } = _data;
        const data = { account, name };
        data.startTime = getStartTimer(grade);
        if (uid) {
            data.sid = uid;
        }
        return await Ax.post(`/admin/${uid ? 'update' : 'add'}Student`, data);
    } catch (e) {
        throw e;
    }
}
// 获取学生列表
export async function getStudentsListApi (configs = {}) {
    try {
        const _configs = {};
        for (const config of Object.entries(configs)) {
            const [k, v] = config;
            if (v) {
                _configs[k] = v;
            }
        }
        const { total, data } = await Ax.get('/admin/listStudent', _configs);
        const students = [];
        for (const _student of data) {
            const grade = getStudentGrade(_student.startTime);
            students.push(Object.assign({}, _student, { grade }));
        }
        return { total, students };
    } catch (e) {
        throw e;
    }
}
// 删除学生列表
export async function deleteStudentApi (sid) {
    try {
        return await Ax.post('/admin/delStudent', { sid });
    } catch (e) {
        throw e;
    }
}
