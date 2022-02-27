import Ax from './Ax.js';

export async function getTaskListApi () {
    try {
        return await Ax.get(`/student/listTask`);
    } catch (e) {
        throw e;
    }
}
export async function getSubjectlistApi (sTid) {
    try {
        return await Ax.get(`/student/listSubject`, { sTid });
    } catch (e) {
        throw e;
    }
}
// 开始做题
///student/doneTask
export async function startTaskApi (sTid) {
    try {
        return await Ax.post(`/student/startTask`, { sTid });
    } catch (e) {
        throw e;
    }
}
// /student/addSpend
// 做题目记录停留时间
export async function addSpendApi (sTid, subjectId, spendTime) {
    try {
        return await Ax.post(`/student/addSpend`, { sTid, subjectId, spendTime });
    } catch (e) {
        throw e;
    }
}
// /student/addAnswer
export async function addAnswerApi (params = true) {
    try {
        const {
            sTid, subjectId, file, url
        } = params;
        const requestData = { sTid, subjectId };
        if (url) {
            requestData.url = url;
        }
        const otherRequest = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: file
        };
        return await Ax.post(`/student/addAnswer`, requestData, otherRequest);
    } catch (e) {
        throw e;
    }
}
// 完成做题
///student/doneTask
export async function doneTaskApi (sTid) {
    try {
        return await Ax.post(`/student/doneTask`, { sTid });
    } catch (e) {
        throw e;
    }
}


