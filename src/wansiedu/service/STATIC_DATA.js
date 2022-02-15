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
export const GRADE_MAP = [
    ['九年级', 9],
    ['八年级', 8],
    ['七年级', 7],
    ['高一', 10],
    ['高二', 11],
    ['高三', 12],
    ['六年级', 6],
    ['五年级', 5],
    ['四年级', 4],
    ['三年级', 3],
    ['二年级', 2],
    ['一年级', 1]
];
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
    done: '已完成',
    doing: '做题中',
    expire: '过期'
};
/*
* 表头信息
* */
export const TAGS_COLORES = ['green', 'magenta', 'blue', 'gold', 'lime', 'red', 'volcano', 'orange', 'cyan', 'geekblue', 'purple'];
