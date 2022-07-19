/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/22.
 * Copyright 2021/9/22 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/22
 * @version */
import Ax from '../Ax.js';
// 获取试卷列表
export async function getExamPapersApi (_configs = {}) {
    const configs = Object.assign({}, { page: 1, size: 10 }, _configs);
    try {
        return await Ax.get(`/teacher/listExam`, configs);
    } catch (e) {
        throw e;
    }
}
// 编辑试卷
export async function editExamPaperApi ({ name, labels, eid = null } = {}) {
    const data = { name, labels };
    if (eid) {
        data.eid = eid;
    }
    try {
        return await Ax.post(`/teacher/${eid ? 'update' : 'create'}Exam`, data);
    } catch (e) {
        throw e;
    }
}
// 编辑试卷
export async function deleteExamPaperApi (eid) {
    try {
        return await Ax.post(`/teacher/delExam`, { eid });
    } catch (e) {
        throw e;
    }
}
// 题目列表
export async function getSubjectListApi (eid) {
    try {
        return await Ax.get('/teacher/listSubject', { eid });
    } catch (e) {
        throw e;
    }
}
// 更新题目的单项内容
export async function editSubjectItemApi (_requestData) {
    try {
        const {
            eid, subjectId,
            remark, type, score, file
        } = _requestData;
        const requestData = { eid, subjectId };
        if (remark) {
            requestData.remark = remark;
        }
        if (typeof type === 'string') {
            requestData.type = type;
        }
        if (score) {
            requestData.score = score;
        }
        const otherRequest = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        if (file) {
            otherRequest.data = file;
        }
        return await Ax.post(`/teacher/updateSubject`, requestData, otherRequest);
    } catch (e) {
        throw e;
    }
}
// 增加题目
export async function editSubjectApi (params = true) {
    try {
        const {
            eid, subjectId, remark, type, score, parentId, file, isParent
        } = params;
        const requestData = { eid };
        requestData.remark = remark;
        requestData.type = type;
        requestData.score = score;
        requestData.isParent = isParent;
        requestData.parentId = parentId;
        if (subjectId) {
            requestData.subjectId = subjectId;
        }
        const otherRequest = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        if (file) {
            otherRequest.data = file;
        }
        return await Ax.post(`/teacher/${subjectId ? 'update' : 'add'}Subject`, requestData, otherRequest);
    } catch (e) {
        throw e;
    }
}
//删除题目
export async function deleteSubjectApi (eid, subjectId) {
    try {
        return await Ax.post(`/teacher/delSubject`, { eid, subjectId });
    } catch (e) {
        throw e;
    }
}
// /teacher/changeSort
export async function changeSortApi (id1, id2, eid) {
    try {
        return await Ax.post(`/teacher/changeSort`, { subjectIds: [Number(id1), Number(id2)].join(','), eid });
    } catch (e) {
        throw e;
    }
}
export async function listStudentTimeByExamApi (eid) {
    try {
        return await Ax.get(`/teacher/listStudentTimeByExam`, { eid });
    } catch (e) {
        throw e;
    }
}
// /teacher/downStudentTimeByExam 按试卷维度下载作业完成情况
export async function listStudentTimeByExamDownApi (eid, sids, name) {
    try {
        const { data, headers } = await Ax.get(`/teacher/downStudentTimeByExam`, { eid, sids }, {
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
