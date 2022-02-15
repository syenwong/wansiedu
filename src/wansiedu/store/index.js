import { createContext } from 'react';

export const defaultState = {
    /* 全局参数 */
    // 用户信息
    account: window.localStorage.getItem('wse_account') || '',
    token: window.localStorage.getItem('wse_token') || '',
    role: window.localStorage.getItem('wse_role') || '',
    // 大操作界面弹窗高度计算
    eidtModalHeight: document.documentElement.clientHeight * .9,
    eidtModalWidth: document.documentElement.clientWidth,
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
        exaPaperId: null
    },
    /*
    *
    * 试卷数据
    *
    * */
    // 当前试卷列表
    ExaPaperList: [],
    // * 编辑类型
    viewCurrentExpPaper: null,
    // global
    globalModalRenderIndex: -1,
    /*
    * 试卷数据集合
    * 
    * */
    /// 新增-编辑-查看 试卷内容 分拆数据
    currentExaPaper_subjects: [],
    currentExaPaper_Info: {
        id: '',
        name: '',
        labels: ''
    },
    /*
    *
    *  学生信息
    * */
    studentTaskList: [],
    currentTask: null,
    exerciseModalType: '',
    exercisingHomeWork: null,
    /*
    * 教师标签
     */
    //列表
    labels: {
        exam: [],
        student: []
    }
};
export const EDU_CONTEXT = createContext(null);
export function reducer (state, data) {
    return { ...state, ...data };
}
