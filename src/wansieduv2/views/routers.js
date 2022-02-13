import React from 'react';
import { Login } from './Login';
import { App } from './App';
// admin
import { Admin } from './Admin/Admin';
import { Students } from './Admin/Students';
import { Teachers } from './Admin/Teachers';
// teacher
import { Teacher } from './Teacher/Teacher';
import { HomeWork } from './Teacher/HomeWork/';
import { Classes } from './Teacher/Classes';
import { Tstudents } from './Teacher/Students';
import { ExamPaper } from './Teacher/ExamPaper';
import { ViewHomework } from './Teacher/ViewHomework';
import { ViewExamDoData } from './Teacher/ViewExamDoData';
import { EditHomeWork } from './Teacher/EditHomeWork';
import { EditExamPaperSubject } from './Teacher/EditExamPaperSubject';
import { ViewStudentExamTask } from './Teacher/ViewStudentExamTask';
// students
import { Student } from './Student';
import { HomeWorkList } from './Student/HomeWorkList';
import { DoingTask } from './Student/DoingTask/';
import { ViewTask } from './Student/ViewTask';
import { CheckAnswerHomework } from './Teacher/CheckAnswerHomework';
import { HomeworkTrail } from './Teacher/HomeworkTrail/HomeworkTrail';

export default [
    {
        path: '/',
        component: Login,
        exact: true
    },
    {
        path: '/admin',
        component: Admin,
        routes: [
            {
                path: '/admin/student',
                component: Students
            },
            // 管理员 - 教师
            {
                path: '/admin/teacher',
                component: Teachers
            }
        ]
    },
    {
        path: '/teacher',
        component: Teacher,
        routes: [
            /* 作业 */
            // 列表
            {
                path: '/teacher/homework',
                component: HomeWork
            },
            // 编辑
            {
                path: '/teacher/homework_edit',
                component: EditHomeWork
            },
            // 批改
            {
                path: '/teacher/homework_check',
                component: CheckAnswerHomework
            },
            // 查看作业情况
            {
                path: '/teacher/homework_view/',
                component: ViewHomework
            },
            // 查看个人作业情况
            {
                path: '/teacher/ViewStudentExamTask/',
                component: ViewStudentExamTask
            },
            // 查看轨迹
            {
                path: '/teacher/homework_trail/:tid',
                component: HomeworkTrail
            },
            // 学生管理
            {
                path: '/teacher/Student',
                component: Tstudents
            },
            // 班级管理
            {
                path: '/teacher/Classes',
                component: Classes
            },
            /*试卷 */
            // 试卷管理
            {
                path: '/teacher/examPaper',
                exact: true,
                component: ExamPaper
            },
            //试题编辑
            {
                path: '/teacher/editExamPaperSubjects/',
                component: EditExamPaperSubject
            },
            {
                path: '/teacher/examPaper_viewDoData/',
                component: ViewExamDoData
            }
        ]
    },
    {
        path: '/student',
        component: Student,
        routes: [
            {
                path: '/student/homework',
                component: HomeWorkList
            },
            {
                path: '/student/doHomework',
                component: DoingTask
            },
            {
                path: '/student/viewTask/:tid',
                component: ViewTask
            }
        ]
    }
];
