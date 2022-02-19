/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/16.
 * Copyright 2021/8/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/16
 * @version */

export const EXAPAPER_MODAL_TITLE = {
    add: '新增试卷',
    edit: '编辑试卷',
    view: '查看试卷',
    subject: '编辑题目'
};
export const RoleMaps = {
    'student': '学生',
    'teacher': '教师',
    'admin': '管理员',
    'UNKNOW': '未知身份',
    'exam': '试卷'
};
// 年级列表
export const GRADE_MAP = ['', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高三', '高二', '高一'];
export const GRADE_ORDER = [9, 8, 7, 6, 5, 4, 3, 2, 1];
export const EDIT_TYPES = ['新增', '修改', '删除'];
// 学生列表分页默认数据
export const DEFAULT_PAGE_SIZE = 10;
// 新增学生Form 默认信息
export const INITIALVALUES_STUDENT_FORM = {
    account: '',
    name: '',
    grade: '',
    password: ''
};
export const INIT_TEACHER_FORM = {
    userName: '',
    name: '',
    subject: '',
    password: ''
};
export const HOMEWORK_STATUS_MAP = {
    not_start: '未开始',
    done: '已完成',
    doing: '做题中',
    expire: '过期'
};
/*
* 表头信息
* */
export const TAGS_COLORES = ['green', 'magenta', 'blue', 'gold', 'lime', 'red', 'volcano', 'orange', 'cyan', 'geekblue', 'purple'];
export const DEFAULT_SUBJECT = {
    score: 0,
    url: '',
    parentId: 0,
    isParent: false
};

export const MARK_PREFIX = {
    anMark: 'anMark',
    ckMark: 'ckMark'
};
