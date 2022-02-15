import { Login } from './Login';
import { Students } from './Admin/Students';
import { Teachers } from './Admin/Teachers';
import { HomeWork } from './Teacher/HomeWork/Index';
import { Classes } from './Teacher/Classes';
import { Tstudents } from './Teacher/Students';
import { Examinationpaper } from './Teacher/Examinationpaper';
import { Index } from './Student';
import { EditHomeWork } from './Teacher/HomeWork/Edit';
import { DoingTask } from './Student/DoingTask';
import { ViewHomework } from './Teacher/HomeWork/ViewHomework';
import { ViewExamDoData } from './Teacher/Examinationpaper/ViewExamDoData';

export default [
    {
        path: '/',
        component: Login,
        exact: true
    },
    // 管理员 - 学生
    {
        path: '/admin/student',
        component: Students
    },
    // 管理员 - 教师
    {
        path: '/admin/teacher',
        component: Teachers
    },
    // 作业管理
    {
        path: '/teacher/homework',
        component: HomeWork
    },
    {
        path: '/teacher/homework_edit',
        component: EditHomeWork
    },
    {
        path: '/teacher/homework_view/:id/:name/:ename',
        component: ViewHomework
    },
    {
        path: '/teacher/exaPaper_view/:id/:name',
        component: ViewExamDoData
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
    // 试卷管理
    {
        path: '/teacher/Examinationpaper',
        component: Examinationpaper
    },
    // 学生
    {
        path: '/student',
        component: Index
    },
    {
        path: '/student_do',
        component: DoingTask
    }
];
