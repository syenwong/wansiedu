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
// 获取学生列表
export async function getMyStudentsListApi (__configs = {}) {
    try {
        const _configs = {};
        for (const config of Object.entries(__configs)) {
            const [k, v] = config;
            if (v) {
                _configs[k] = v;
            }
        }
        const configs = Object.assign({}, { page: 1, size: DEFAULT_PAGE_SIZE }, _configs);
        const { total, data } = await Ax.get('/teacher/listStudent', configs);
        const myStudents = [];
        const otherStudents = [];
        let myTotal = 0;
        let otherTotal = 0;
        for (const _student of data) {
            _student.labels = (typeof _student.labels === 'string' && _student.labels.trim() !== '') ?
                _student.labels.split(',') : [];
            if (_student.labels.length > 0) {
                myStudents.push(Object.assign({}, _student));
                myTotal++;
            } else {
                otherStudents.push(Object.assign({}, _student));
                otherTotal++;
            }
        }
        return {
            allStudents: data,
            total,
            myStudents: {
                total: myTotal, students: myStudents
            },
            otherStudents: {
                students: otherStudents, total: otherTotal
            }
        };
    } catch (e) {
        throw e;
    }
}
// 新增 、 修改学生
export async function editStudentApi (_data, uid = null) {
    try {
        const { account, name, labels, startTime } = _data;
        const data = { account, name, startTime };
        if (uid) {
            data.sid = uid;
        }
        data.labels = labels || '';
        return await Ax.post(`/teacher/${uid ? 'update' : 'add'}Student`, data);
    } catch (e) {
        throw e;
    }
}
// 删除学生列表
export async function deleteStudentApi (sid) {
    try {
        return await Ax.post('/teacher/delStudent', { sid });
    } catch (e) {
        throw e;
    }
}
