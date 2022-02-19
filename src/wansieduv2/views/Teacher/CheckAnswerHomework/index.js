/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/28.
 * Copyright 2021/12/28 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/28
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useRef, useEffect, useState } from 'react';
import { EDU_CONTEXT } from '../../../store';
import { Spin, Form, Button, Radio, Tag } from 'antd';
import { checkAnswerApi, listStudentTimeApi } from '../../../service/api/teacher/homework';
import { getSubjectListApi } from '../../../service/api/teacher/exam';
import { delayeringSubject, resolveSubjectUrl } from '../../../service/utils';
import { CheckOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { CanvasCom } from '../../../globalComponents/CanvasCom/CanvasCom';
import { useHistory } from 'react-router';
import { ScoreInput } from '../../../globalComponents/ScoreInput';
import { useModalError } from '../../../Controller/useModalError';

export function CheckAnswerHomework () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { clientWidth, clientHeight, currentHomeWorkData, canvasRatio } = state;
    const { name, ename, elabels, eid, id } = currentHomeWorkData || {};
    const ModalError = useModalError();
    const history = useHistory();
    const childRef = useRef();
    const [editSubjectForm] = Form.useForm();
    const [canvasHeight] = useState(clientHeight - 90);
    const [canvasWidth] = useState(canvasHeight / canvasRatio);
    const [drawImage, setDrawImage] = useState();
    const [sideWidth] = useState((clientWidth - canvasWidth) / 2);
    const [currentStudent, setCurrentStudent] = useState(null); // 当前学生
    const [currentSubject, setCurrentSubject] = useState(null); //当前题目
    const [currentSubjectAn, setCurrentSubjectAn] = useState(null); // 批改的题目(答案)存储
    const [studentList, setStudentList] = useState([]); // 学生列表用于渲染左边
    const [notStartStudentList, setNotStartStudentList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]); // 目列表
    const [data, setData] = useState(null);
    const [subjectAutoSwitch, setSubjectAutoSwitch] = useState(1);
    const [switchStudentIndex, setSwitchStudentIndex] = useState(-1);
    const [switchSubjectIndex, setSwitchSubjectIndex] = useState(-1);
    const [spinning, setSpinning] = useState(false);
    const getDatas = async () => {
        try {
            const _data = {};
            const _studentsList = [];
            const _notStartStudentList = [];
            const studentsAll = await listStudentTimeApi(id);
            for (const student of studentsAll) {
                const { id, status, name, subjectTimeAndAnswers } = student;
                const s_subjectTimeAndAnswers = resolveSubjectUrl(subjectTimeAndAnswers);
                const studentInfo = { name, id, status };
                if (status === 'not_start') {
                    _notStartStudentList.push(studentInfo);
                } else {
                    const _subjectTimeAndAnswers = {};
                    for (const subjectTimeAndAnswer of s_subjectTimeAndAnswers) {
                        const { subjectId } = subjectTimeAndAnswer;
                        _subjectTimeAndAnswers[subjectId] = subjectTimeAndAnswer;
                    }
                    student.subjectTimeAndAnswersMap = _subjectTimeAndAnswers;
                    _data[id] = student;
                    _studentsList.push(studentInfo);
                }
            }
            setData(_data);
            setStudentList(_studentsList);
            setNotStartStudentList(_notStartStudentList);
            return _studentsList;
        } catch (e) {
        }
    };
    const getSubjectList = async () => {
        try {
            const { data } = await getSubjectListApi(eid);
            const subjects = delayeringSubject(data);
            setSubjectsList(subjects);
            return subjects;
        } catch (e) {
        }
    };
    const setStepsHandler = (e) => {
        const t = e.target;
        const _score = t.dataset.n;
        if (t.nodeName.toLowerCase() === 'span' && _score) {
            const ns = currentSubjectAn.score * (Number(_score) / 100);
            let [n, s] = String(ns).split('.');
            let score;
            const _s = Number('0.' + s);
            if (_s < 0.5) {
                score = Number(n);
            } else if (_s > 0.5) {
                score = Number(n) + 1;
            } else {
                score = Number(ns);
            }
            editSubjectForm.setFieldsValue({
                score
            });
        }
    };
    const operateDone = async () => {
        try {
            setSpinning(true);
            const sTid = data?.[currentStudent?.id]?.stid;
            const subjectId = currentSubject.id;
            const { formData } = await childRef.current.submitDrawImage(sTid, subjectId, 'check');
            const score = editSubjectForm.getFieldValue('score');
            await checkAnswerApi({ sTid, subjectId, score, file: formData, url: currentSubjectAn.ckMark_img});
            await getDatas();
            setSpinning(false);
            return true;
        } catch (e) {
            setSpinning(false);
            ModalError(e.message);
        }
    };
    const compluteSwitchIndex = (type, switchStudentIndex, switchSubjectIndex) => {
        let _switchStudentIndex = 0,
            _switchSubjectIndex = 0;
        switch (subjectAutoSwitch) {
            // 学生
            case 1:
                if (switchStudentIndex === 0) {
                    if (type === 'increase') {
                        _switchStudentIndex = switchStudentIndex + 1;
                        _switchSubjectIndex = switchSubjectIndex;
                    }
                    if (type === 'reduce') {
                        _switchStudentIndex = studentList.length - 1;
                        if (switchSubjectIndex > 0) {
                            _switchSubjectIndex = switchSubjectIndex - 1;
                        } else {
                            _switchSubjectIndex = subjectsList.length - 1;
                        }
                    }
                } else if (switchStudentIndex >= studentList.length - 1) {
                    if (type === 'increase') {
                        _switchStudentIndex = 0;
                        if (switchSubjectIndex >= subjectsList.length - 1) {
                            _switchSubjectIndex = 0;
                        } else {
                            _switchSubjectIndex = switchSubjectIndex + 1;
                        }
                    }
                    if (type === 'reduce') {
                        _switchStudentIndex = switchStudentIndex - 1;
                        _switchSubjectIndex = switchSubjectIndex;
                    }
                } else {
                    if (type === 'increase') {
                        _switchStudentIndex = switchStudentIndex + 1;
                    }
                    if (type === 'reduce') {
                        _switchStudentIndex = switchStudentIndex - 1;
                    }
                    _switchSubjectIndex = switchSubjectIndex;
                }
                break;
            case 2:
                if (switchSubjectIndex >= subjectsList.length - 1) {
                    if (type === 'increase') {
                        _switchSubjectIndex = 0;
                        if (switchStudentIndex >= studentList.length - 1) {
                            _switchStudentIndex = 0;
                        } else {
                            _switchStudentIndex = switchStudentIndex + 1;
                        }
                    }
                    if (type === 'reduce') {
                        _switchSubjectIndex = switchSubjectIndex - 1;
                        _switchStudentIndex = switchStudentIndex;
                    }
                } else if (switchSubjectIndex === 0) {
                    if (type === 'increase') {
                        _switchSubjectIndex = switchSubjectIndex + 1;
                        _switchStudentIndex = switchStudentIndex;
                    }
                    if (type === 'reduce') {
                        _switchSubjectIndex = subjectsList.length - 1;
                        if (switchStudentIndex > 0) {
                            _switchStudentIndex = switchStudentIndex - 1;
                        } else {
                            _switchStudentIndex = studentList.length - 1;
                        }
                    }
                } else {
                    if (type === 'increase') {
                        _switchSubjectIndex = switchSubjectIndex + 1;
                    }
                    if (type === 'reduce') {
                        _switchSubjectIndex = switchSubjectIndex - 1;
                    }
                    _switchStudentIndex = switchStudentIndex;
                }
                break;
        }
        return {
            switchStudentIndexResult: _switchStudentIndex,
            switchSubjectIndexResult: _switchSubjectIndex
        };
    };
    const getCurrentAn = (StudentIndex, SubjectIndex) => {
        return Boolean(data?.[studentList?.[StudentIndex]?.id]?.subjectTimeAndAnswersMap?.[subjectsList?.[SubjectIndex]?.id].answerUrl);
    };
    const switchStudentIndexHandler = async (type = 'increase') => {
        try {
            await operateDone();
            let _switchStudentIndex = switchStudentIndex;
            let _switchSubjectIndex = switchSubjectIndex;
            do {
                const { switchStudentIndexResult, switchSubjectIndexResult } = compluteSwitchIndex(type, _switchStudentIndex, _switchSubjectIndex);
                _switchStudentIndex = switchStudentIndexResult;
                _switchSubjectIndex = switchSubjectIndexResult;
            } while (!getCurrentAn(_switchStudentIndex, _switchSubjectIndex));
            setSwitchSubjectIndex(_switchSubjectIndex);
            setSwitchStudentIndex(_switchStudentIndex);
        } catch (e) {
            console.log(e);
        }
    };
    const backForward = async () => {
        await operateDone();
        history.push('/teacher/homework');
    };
    const setCurrentData = async (switchStudentIndex, switchSubjectIndex) => {
        if (switchStudentIndex === -1 || switchSubjectIndex === -1) {
            return false;
        }
        // 还原
        editSubjectForm.resetFields();
        // if (childRef?.current?.clear) {
        //     childRef?.current?.clear();
        // }
        // 获取
        const _subject = subjectsList?.[switchSubjectIndex] ?? {};
        const _student = studentList?.[switchStudentIndex] ?? {};
        const an = data?.[_student.id]?.subjectTimeAndAnswersMap?.[_subject?.id] ?? {};
        const { subjectId, check_img } = an;
        // 重新赋值 /渲染
        editSubjectForm.setFieldsValue({ score: an?.checkScore === -1 ? an?.score : an?.checkScore });
        // if (an?.checkUrl) {
        //     await childRef.current.drawImage(an.checkUrl);
        // }
        setDrawImage(`${subjectId}::${check_img}`);
        setCurrentSubject(_subject);
        setCurrentStudent(_student);
        setCurrentSubjectAn(an);
    };
    useEffect(() => {
        setCurrentData(switchStudentIndex, switchSubjectIndex).then();
    }, [switchStudentIndex, switchSubjectIndex]);
    useEffect(() => {
        dispatch({ currentTeacherNavKey: 'homework' });
        (async () => {
            if (eid) {
                await Promise.all([getDatas(), getSubjectList()]);
                setSwitchStudentIndex(0);
                setSwitchSubjectIndex(0);
            } else {
                history.push('/teacher/homework');
            }
        })();
    }, []);
    return <div className={'g-checkAnswerHomework'}>
        <div className={'g-chAnHeader'}>
            <div className={'m-anInfo'} style={{ width: canvasWidth + 'px' }}>
                <div className={'anInfoContent'}>
                    <StepBackwardOutlined onClick={() => {
                        switchStudentIndexHandler('reduce');
                    }} className={'StepBackwardOutlined'} />
                    <div className={'subjectSwitch'}>
                        <Radio.Group onChange={(e) => setSubjectAutoSwitch(Number(e.target.value))} defaultValue={1}>
                            <Radio value={1}>学生</Radio>
                            <Radio value={2}>题号</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className={'anType'}>
                    <div className={'no'}> {currentSubject?.no} </div>
                    <Tag color={'orange'}>{currentSubject?.score}</Tag>
                </div>
                <div className={'anInfoOperate'}>
                    <Form form={editSubjectForm} initialValues={{ score: currentSubject?.score }}>
                        <Form.Item name={'score'} className={'item'}>
                            <ScoreInput />
                        </Form.Item>
                    </Form>
                    <div className={'steps'} onClick={setStepsHandler}>
                        {
                            [0, 33, 25, 50, 75].map((n, i) => {
                                return <span key={i} data-n={n}>× {n}%</span>;
                            })
                        }
                    </div>
                    <StepForwardOutlined onClick={() => switchStudentIndexHandler('increase')} className={'StepForwardOutlined'} />
                </div>
            </div>
            <Button className={'backForward'} type={'primary'} onClick={backForward}>返回作业列表</Button>
        </div>
        <Spin spinning={spinning} size={'large'}>
            <div className={'g-chAnContent'} style={{ height: canvasHeight + 'px' }}>
                <div className={'g-chAnStudents'} style={{ width: sideWidth + 'px' }}>
                    <h2>可批改</h2>
                    <ul>
                        {studentList.map((s, i) => {
                            const { name, id } = s;
                            const checked = data?.[id]?.subjectTimeAndAnswersMap?.[subjectsList?.[switchSubjectIndex]?.id]?.checkScore > -1 ? 'checked' : 'unchecked';
                            const hasAnswered = data?.[id]?.subjectTimeAndAnswersMap?.[subjectsList?.[switchSubjectIndex]?.id]?.answerUrl;
                            return <li className={`${currentStudent?.id === id ? 'active' : ''} ${hasAnswered ? 'answered' : 'noAnswer'} ${checked}`}
                                       key={i} data-id={id}
                                       onClick={async () => {
                                           if (hasAnswered) {
                                               await operateDone();
                                               setSwitchStudentIndex(i);
                                           }
                                       }}> {name} <span className={'isChecked'}>{checked === 'checked' && <CheckOutlined />}</span>
                            </li>;
                        })}
                    </ul>
                    <h2>未开始</h2>
                    <ul className={'notStart'}>
                        {notStartStudentList.map((s, i) => {
                            const { name } = s;
                            return <li key={i}>{name}</li>;
                        })}
                    </ul>
                </div>
                <div className={'g-chAn'} style={{ width: canvasWidth + 'px' }}>
                    <div className={'anCanvasContainer'}>
                        <CanvasCom cRef={childRef}
                                   id={'checked'}
                                   offsetLeft={sideWidth}
                                   offsetTop={90}
                                   canvasWidth={canvasWidth}
                                   canvasHeight={canvasHeight}
                                   questionImages={currentSubject?.url}
                                   imageDrawed={[currentSubjectAn?.answer_img, currentSubjectAn?.anMark_img, currentSubjectAn?.ckMark_img]}
                                   drawImageSrc={drawImage} />
                    </div>
                </div>
                <div className={'g-chAnSubject'} style={{ width: sideWidth + 'px' }}>
                    <div className={'homeworkInfo'}>
                        <h1> {name} </h1>
                        <h2>{ename}</h2>
                        {
                            elabels && elabels.split(',').map((t, i) => {
                                return <Tag key={i}>{t}</Tag>;
                            })
                        }
                    </div>
                    <ul>
                        {
                            subjectsList.map((subject, i) => {
                                const { type, id, no } = subject;
                                const checked = data?.[currentStudent?.id]?.subjectTimeAndAnswersMap?.[id]?.checkScore > -1 ? 'checked' : 'unchecked';
                                const hasAnswered = data?.[currentStudent?.id]?.subjectTimeAndAnswersMap?.[id]?.answerUrl;
                                return <li className={`${currentSubject?.id === id ? 'active' : 'nor'} ${hasAnswered ? 'answered' : 'noAnswer'} ${checked}`} data-sid={id} key={i} onClick={async () => {
                                    if (hasAnswered) {
                                        await operateDone();
                                        setSwitchSubjectIndex(i);
                                    }
                                }}>
                                    <div className={'basic'}>
                                        <div className={'no'}>{no}</div>
                                        <span className={'isChecked'}>{checked === 'checked' && <CheckOutlined />}</span>
                                    </div>
                                    <div className={'type'}>
                                        {
                                            (typeof type === 'string' && type.length > 0) &&
                                            type.split(',').map((t, i) => {
                                                return <Tag key={i}>{t}</Tag>;
                                            })
                                        }
                                    </div>
                                </li>;
                            })
                        }
                    </ul>
                </div>
            </div>
        </Spin>
    </div>;
}
