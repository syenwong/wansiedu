import { createContext } from 'react';

export const defaultState = {
    /* 全局参数 */
    // 用户信息
    account: window.localStorage.getItem('wse_account') || '',
    token: window.localStorage.getItem('wse_token') || '',
    role: window.localStorage.getItem('wse_role') || '',
    // 大操作界面弹窗高度计算
    eidtModalHeight: document.documentElement.clientHeight * .9,
    clientWidth: document.documentElement.offsetWidth,
    clientHeight: document.documentElement.offsetHeight,
    /*
    * 路由信息
    * */
    currentTeacherNavKey: '',
    /*
    *
    * 作业
    *
    * */
    homeworkList: [], // 首页作业列表数据
    //
    homeworkDoneInfo: {},
    //
    editHomeworkData: {
        id: null,
        name: '',
        startTime: '',
        endTime: '',
        sids: [],
        eid: null
    },
    currentHomeWorkData: null,// 当前作业信息，用于批改作业的时候浏览作业信息
    /*
    *
    * 试卷数据
    *
    * */
    // 当前试卷列表
    ExamPaperList: [],
    // * 编辑类型
    viewCurrentExpPaper: null,
    // 教师查看具体学生做题情况的存储
    ViewStudentExamTask: null,
    /*
    * 试卷数据集合
    * 
    * */
    /// 新增-编辑-查看 试卷内容 分拆数据
    currentExamPaperSubjects: null,
    currentExamPaper: null,
    editExamPaperModalVisible: false,
    editSubjectModalVisible: false,
    currentEditSubject: null,
    currentExamPaperSubjectFilterKey: null,
    ViewExamPaperVisible: false,
    /*
    *
    *  学生信息
    * */
    studentTaskListOrigin: [],
    studentTaskList: [],
    currentTask: null,
    exerciseModalType: '',
    exercisingHomeWork: null,
    currentTaskExaPaper: null, // 学生查看作业试卷
    /*
    * 教师标签
     */
    //列表
    labels: {
        exam: [],
        student: []
    },
    canvasRatio: 0.85,
    /* 试卷二次修改的一些数据 */
    addSubjectSignModalData:null
    
};
export const EDU_CONTEXT = createContext(null);
export function reducer (state, data) {
    return { ...state, ...data };
}
