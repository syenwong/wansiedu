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
import { GRADE_ORDER, MARK_PREFIX } from './STATIC_DATA';
import moment from 'moment';

const { anMark, ckMark } = MARK_PREFIX;
const now = new Date();
const month = now.getMonth();
const year = now.getFullYear();
const sortSorts = (s1, s2) => {
    return s1.sort - s2.sort;
};
export function smTr (t, m = '\'', s = '"') {
    if (!t || t === 'none' || isNaN(t)) {
        return 0;
    }
    const ms = t % 1000;
    const allSecons = Math.floor(t / 1000);
    const second = allSecons % 60;
    const min = Math.floor(allSecons / 60);
    if (t <= 1000) {
        return `${(t / 1000).toFixed(2)}${s}`;
    } else if (t > 1000 && t <= 6000) {
        return `${second}${s}`;
    } else {
        return `${min}${m}${second}${s}`;
    }
}
// 通过年级获取入学
export function getStartTimer (grade) {
    return year - (grade - (month >= 8 ? 0 : 1));
}
// 通过入学获取年级
export function getStudentGrade (St) {
    return (GRADE_ORDER.find(g => {
        return g === (year - St + (month >= 8 ? 0 : 1));
    }));
}
export function formatDateHw (t, f = 'YYYY-MM-DD HH:mm') {
    let _t = t.replace(/-/ig, '/');
    return moment(new Date(_t)).format(f);
}
/*
* serializeSubject 的多用
* 1 生成大题 －> 小题的树形结构，小题以 subSubjects 属性做了集合
* 同时 添加 no 属性，表示题号
* */
export function serializeSubject ({ data, key = null, subjectIdKey = 'id' } = {}) {
    const _data = resolveSubjectUrl(data);
    let subjects = [];
    // type 分类 过滤题目
    const resultData = _data.filter(s => {
        if (s.isParent) {
            return true;
        } else {
            return key === null || s.type.includes(key);
        }
    });
    const subjectParents = {};
    const subjectChildren = {};
    for (const sa of resultData) {
        const { parentId } = sa;
        const id = sa[subjectIdKey];
        if (parentId === 0) {
            sa.subSubjects = [];
            subjectParents[id] = sa;
        } else {
            subjectChildren[id] = sa;
        }
    }
    for (const subjectCs of Object.values(subjectChildren)) {
        const { parentId } = subjectCs;
        const parentSubject = subjectParents[parentId];
        if (parentSubject) {
            const purl = parentSubject.url;
            if (purl) {
                subjectCs.parentUrl = purl;
            }
            subjectParents[parentId].subSubjects.push(subjectCs);
        }
    }
    subjects = (Object.values(subjectParents)
        .sort((s1, s2) => s1.sort - s2.sort))
        .filter(s => {
            return !key || !s.isParent || s.subSubjects.length > 0;
        });
    for (const subjectElement of subjects) {
        subjectElement.subSubjects.sort((s1, s2) => s1.sort - s2.sort);
    }
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        subject.No = String(i + 1);
        if (Array.isArray(subject.subSubjects) && subject.subSubjects.length > 0) {
            for (let j = 0; j < subject.subSubjects.length; j++) {
                const subjectElement = subject.subSubjects[j];
                subjectElement.No = `${i + 1}.${j + 1}`;
            }
        }
    }
    return subjects;
}
export const resolveSubjectUrl = (subjects) => {
    for (const sa of subjects) {
        const { answerUrl, checkUrl } = sa;
        /*
           * 批改与答题图片整理
           * */
        let answer_img = '', anMark_img = '', check_img = '', ckMark_img = '';
        // answerUrl
        let answerUrlAr = (answerUrl || '').split(',');
        for (const an_url of answerUrlAr) {
            if (an_url.includes(`${anMark}_`)) {
                anMark_img = an_url;
            } else {
                answer_img = an_url;
            }
        }
        //checkUrl
        let checkUrlAr = (checkUrl || '').split(',');
        for (const ck_url of checkUrlAr) {
            if (ck_url.includes(`${ckMark}_`)) {
                ckMark_img = ck_url;
            } else {
                check_img = ck_url;
            }
        }
        Object.assign(sa, { answer_img, anMark_img, check_img, ckMark_img });
    }
    return subjects;
};

/*
* delayeringSubject 的作用
* 1，先生成属性结构，
* 2,再进行扁平化
* */
export function delayeringSubject ({ data, key = null, subjectIdKey = 'id' }) {
    const _subjects = serializeSubject({ data, key, subjectIdKey });
    const subjectsAsB = Object.values(_subjects).sort(sortSorts);
    const subjectsAsC = {};
    for (let i = 0; i < subjectsAsB.length; i++) {
        const subjectsAsBElement = subjectsAsB[i];
        if (Array.isArray(subjectsAsBElement.subSubjects) && subjectsAsBElement.subSubjects.length > 0) {
            subjectsAsBElement.subSubjects
                .sort(sortSorts)
                .forEach((s, j) => {
                    const no = `${i + 1}.${j + 1}`;
                    s.no = Number(no);
                    subjectsAsC[no] = s;
                });
        } else {
            const no = `${i + 1}`;
            subjectsAsBElement.no = Number(no);
            subjectsAsC[no] = subjectsAsBElement;
        }
    }
    return Object.values(subjectsAsC).sort((s1, s2) => {
        return Number(s1.no) - Number(s2.no);
    });
}
export function launchIntoFullscreen (element) {
    try {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } catch (e) {
        console.log(e);
    }
}
export function launchExitFullscreen () {
    try {
        if (document.exitFullscreen) {
            document?.exitFullscreen();
        } else if (document.mozCancelFullscreen) {
            document.mozCancelFullscreen();
        } else if (element.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (element.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } catch (e) {
        console.log(e);
    }
}

export function findParentNode (_t, nodename, dataType) {
    var c1 = _t.nodeType === 1,
        c2 = _t.nodeName.toLowerCase() === nodename,
        c3 = c1 && c2 && (dataType ? _t.dataset[dataType] === '1' : true);
    
    if (c3) {
        return _t;
    } else if (_t.nodeType === 9) {
        return null;
    } else {
        return findParentNode(_t.parentNode, nodename, dataType);
    }
}
