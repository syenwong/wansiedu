/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/25.
 * Copyright 2021/9/25 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/25
 * @version */
import Ax from '../Ax.js';
import { DEFAULT_PAGE_SIZE } from '../../STATIC_DATA';

export async function editHomeWorkApi (configs, id = null) {
    let url = 'createTask';
    if (id) {
        url = 'updateTask';
        Object.assign(configs, { taskId: id });
    }
    try {
        return await Ax.post(`/teacher/${url}`, configs);
    } catch (e) {
        throw e;
    }
}
//
// /teacher/listSids
// 作业关联学生列表
export async function getListSidsApi (tid) {
    try {
        return await Ax.get(`/teacher/listSids`, { taskId: tid });
    } catch (e) {
        throw e;
    }
}
// 获取试卷列表
export async function getHomeWorkListApi (_configs = {}) {
    const configs = Object.assign({}, { size: DEFAULT_PAGE_SIZE }, _configs);
    try {
        return await Ax.get(`/teacher/listTask`, configs);
    } catch (e) {
        throw e;
    }
}
// /teacher/listStudentTime
export async function listStudentTimeApi (taskId) {
    try {
        return await Ax.get(`/teacher/listStudentTime`, { taskId });
    } catch (e) {
        throw e;
    }
}
// downStudentTime
export async function downStudentTimeApi (taskId, sids) {
    try {
        const { data, headers } = await Ax.get(`/teacher/downStudentTime`, { taskId, sids }, {
            direct: true,
            responseType: 'arraybuffer'
        });
        const fileName = decodeURIComponent(headers['content-disposition'].split('=')[1]);
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' }); // 将服务端返回的文件流（二进制）excel文件转化为blob
        let objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        let downFile = document.createElement('a');
        downFile.style.display = 'none';
        downFile.href = objectUrl;
        downFile.download = fileName; // 下载后文件名
        document.body.appendChild(downFile);
        downFile.click();
        document.body.removeChild(downFile); // 下载完成移除元素
        // window.location.href = objectUrl
        window.URL.revokeObjectURL(objectUrl);
    } catch (e) {
        throw e;
    }
}
// /teacher/updateTaskStatus
//变更学生作业状态
export async function updateTaskStatusApi (a, tid) {
    try {
        return await Ax.post(`/teacher/updateTaskStatus`, { taskId: tid, sid: a.id, status: a.status === 'done' ? 'doing' : 'done' });
    } catch (e) {
        throw e;
    }
}
