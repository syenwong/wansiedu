/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/9.
 * Copyright 2021/9/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/9
 * @version */
import './style.less';
import 'swiper/swiper-bundle.css';
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect, useContext } from 'react';
import { EDU_CONTEXT } from '../../../store';
import { Button, message, Modal, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import { CanvasCom } from '../../../globalComponents/CanvasCom/CanvasCom';
import { FileDoneOutlined, StepForwardOutlined, StepBackwardOutlined, LeftOutlined } from '@ant-design/icons';
import { startTaskApi, getSubjectlistApi, addSpendApi, addAnswerApi, doneTaskApi } from '../../../service/api/student';
import { findParentNode } from '../../../service/utils';
import { delayeringSubject, launchIntoFullscreen, launchExitFullscreen, resolveSubjectUrl } from '../../../service/utils';
import { TimeReader } from './TimeReader';
import { useModalError } from '../../../Controller/useModalError';

const canvasOffseTop = 106;
/*
*
* */
export function DoingTask () {
    const history = useHistory();
    let {
        state: {
            currentTask, canvasRatio
        }, dispatch
    } = useContext(EDU_CONTEXT);
    const ModalError = useModalError();
    const { examName, name } = currentTask || {};
    const [currentSubjectKeyIndex, setCurrentSubjectKeyIndex] = useState(0);
    const [subjects, setSubjects] = useState(null);
    const [drawImageSrc, setDrawImageSrc] = useState();
    const [spinning, setSpinning] = useState(false);
    const [subjectsTd, setSubjectsTd] = useState([]);
    const [canvasHeight, setcanvasHeight] = useState(0);
    const [canvasWidth, setcanvasWidth] = useState(0);
    const [canvasDrWidth, setcanvasDrWidth] = useState(0);
    const [canvasDrOffsetLeft, setcanvasDrOffsetLeft] = useState(0);
    const [remainTime, setRemainTime] = useState(currentTask?.remainTime ?? 0);
    const [subjectFlags, setSubjectFlags] = useState({});
    const canvasRef = useRef();
    const timerRsf = useRef();
    
    const launchIntoFullscreenHandler = () => {
        const dw = document.documentElement.offsetWidth;
        const dh = document.documentElement.offsetHeight;
        const _ch = dh - canvasOffseTop - 10;
        setcanvasHeight(_ch);
        setcanvasWidth(_ch / canvasRatio);
        setcanvasDrWidth(dw - (_ch / canvasRatio));
        setcanvasDrOffsetLeft(_ch / canvasRatio);
    };
    const backToList = () => {
        history.push('/student/homework');
        dispatch({
            currentTask: null
        });
    };
    /* ???????????? */
    const addSubjectInfo = async () => {
        try {
            // ??????????????????
            const sTid = currentTask?.id;
            const subjectId = subjects?.[currentSubjectKeyIndex]?.id;
            // ????????????
            const spendTime = timerRsf.current.submitSpendTime();
            const _remainTime = await addSpendApi(sTid, subjectId, spendTime * 1000);
            // ????????????
            const { formData } = await canvasRef.current.submitDrawImage(sTid, subjectId);
            await addAnswerApi({ sTid, subjectId, file: formData });
            return _remainTime;
        } catch (e) {
            throw e;
        }
    };
    /* ?????? */
    const summitPaperHandler = async (msg = '?????????????????????????????????') => {
        try {
            await addSubjectInfo();
            const { id: sTid } = currentTask;
            await doneTaskApi(sTid);
            Modal.success({
                title: msg,
                onOk () {
                    backToList();
                }
            });
        } catch (e) {
            // submitTips(e.message);
        }
    };
    const submitPaper = () => {
        Modal.confirm({
            title: '?????????????????????????????????',
            // content: undo.length > 0 ? `??????${undo.join(',')}????????????` : '',
            okText: '?????????????????????',
            cancelText: '?????????????????????????????????',
            async onOk () {
                await summitPaperHandler();
            }
        });
    };
    // ????????????
    const getSubjectsList = async (init = false) => {
        try {
            if (init) {
                await startTaskApi(currentTask.id);
            }
            const data = await getSubjectlistApi(currentTask.id);
            const _subjects = delayeringSubject({ data: data.subjectWithTimes });
            let _subjectsTd;
            const keysLength = _subjects.length;
            if (keysLength <= 40) {
                _subjectsTd = 40;
            } else {
                _subjectsTd = keysLength + keysLength % 2;
            }
            setSubjects(_subjects);
            setSubjectsTd(new Array(_subjectsTd).fill('0'));
            return _subjects;
        } catch (e) {
            message.error(e.message);
        }
    };
    const setCurrentSubject = async (_subjects, noindex) => {
        const subject = _subjects[noindex];
        const { url, parentUrl, answer_img } = subject;
        setDrawImageSrc({
            questionImages: [parentUrl, url],
            drawImageUrl: answer_img
        });
        setCurrentSubjectKeyIndex(noindex);
    };
    
    // ????????????
    const switchSubject = async (event) => {
        // ???????????? + ?????????????????????
        const _t = event?.target;
        let noindex = null;
        if (_t.nodeName.toLowerCase() === 'li') {
            const ___noindex = _t.dataset?.noindex;
            if (___noindex) {
                const _noindex = Number(___noindex);
                if (_noindex > subjects.length - 1 || _noindex === currentSubjectKeyIndex) {
                    return false;
                } else {
                    noindex = _noindex;
                }
            }
        } else {
            const bt = findParentNode(_t, 'button');
            if (bt) {
                const _noindex = bt.dataset.noindex;
                if (_noindex === 'pre') {
                    if (Number(currentSubjectKeyIndex) === 0) {
                        noindex = subjects.length - 1;
                    } else {
                        noindex = Number(currentSubjectKeyIndex) - 1;
                    }
                }
                if (_noindex === 'next') {
                    if (Number(currentSubjectKeyIndex) === subjects.length - 1) {
                        noindex = 0;
                    } else {
                        noindex = Number(currentSubjectKeyIndex) + 1;
                    }
                }
            }
        }
        
        try {
            setSpinning(true);
            const _remainTime = await addSubjectInfo();
            // ??????????????????
            //
            if (_remainTime > 0 && noindex !== null) {
                setRemainTime(_remainTime);
                // ????????????????????????????????????
                const _subjects = await getSubjectsList();
                await setCurrentSubject(_subjects, noindex);
            }
            setSpinning(false);
        } catch (e) {
            setSpinning(true);
            ModalError(e.message);
        }
    };
    const setSubjectFlag = (c) => {
        let _subjectFlags = {};
        if (c === '0') {
            _subjectFlags = Object.assign({}, subjectFlags);
            delete _subjectFlags[currentSubjectKeyIndex];
        } else {
            _subjectFlags = Object.assign({}, subjectFlags, { [currentSubjectKeyIndex]: c });
        }
        setSubjectFlags(_subjectFlags);
    };
    useEffect(() => {
        if (!currentTask) {
            backToList();
        } else {
            setSpinning(true);
            launchIntoFullscreenHandler();
            // ???????????????????????????
            if (!window.location.href.includes('localhost') || window.location.href.includes('full')) {
                launchIntoFullscreen(document.documentElement);
            }
            (async () => {
                try {
                    const _subjects = await getSubjectsList(true);
                    await setCurrentSubject(_subjects, 0);
                    setSpinning(false);
                } catch (e) {
                    ModalError(e.message);
                    setSpinning(false);
                }
            })();
        }
        return () => {
            launchExitFullscreen();
        };
    }, []);
    return <Spin size={'large'} spinning={spinning}>
        <div className={'g-exercisingSubjectContent'}>
            <div className={'exercising_top'}>
                <p className={'name'}>
                    <Button type={'primary'} onClick={async () => {
                        try {
                            await addSubjectInfo();
                            backToList();
                        } catch (e) {
                            message.error(e.message);
                        }
                    }}><LeftOutlined />
                    </Button>
                    {name} [{examName}]
                </p>
                <div className={'operate'}>
                    <TimeReader tRsf={timerRsf} du={remainTime} submit={() => summitPaperHandler('??????????????????????????????')} />
                    <button className={'submitPaper'} onClick={submitPaper}><FileDoneOutlined />??????</button>
                </div>
            </div>
            <div className={'exercising_header'}>
                <button className={'changeSubject pre'} data-noindex={'pre'} onClick={switchSubject}><StepBackwardOutlined /></button>
                <ul className={'exercising_num'}>
                    {
                        subjectsTd.map((s, index) => {
                            const _className = subjects?.[index] ?
                                (currentSubjectKeyIndex === index ? 'now' :
                                    (subjects?.[index]?.answerUrl ? 'done' : 'nor')) :
                                '';
                            return <li key={index}
                                       onClick={async (e) => {
                                           if (index < subjects.length) {
                                               await switchSubject(e, true);
                                           }
                                       }}
                                       data-noindex={index}
                                       className={_className}
                                       style={{ width: 100 / (subjectsTd.length / 2) + '%' }}>
                                {subjects?.[index] ? Number(subjects?.[index].no) : ''}
                                <div className={'flag'} style={{
                                    borderLeftColor: subjectFlags[index] || 'transparent',
                                    borderTopColor: subjectFlags[index] || 'transparent'
                                }} />
                            </li>;
                        })
                    }
                </ul>
                <button className={'changeSubject next'} data-noindex={'next'} onClick={switchSubject}><StepForwardOutlined /></button>
            </div>
            <div className={'exercising_canvas_wrap'} style={{ height: canvasHeight }}>
                <div className={'exercising_paper'}>
                    <CanvasCom cRef={canvasRef}
                               id={'paper'}
                               offsetLeft={0}
                               drClear={false}
                               penColor={0}
                               offsetTop={canvasOffseTop}
                               canvasHeight={canvasHeight}
                               canvasWidth={canvasWidth}
                               setFlag={(c) => setSubjectFlag(c)}
                               drawImageSrc={drawImageSrc} />
                </div>
                <div className={'exercising_draft'}>
                    <CanvasCom id={'draft'}
                               penColor={0}
                               offsetLeft={canvasDrOffsetLeft}
                               offsetTop={canvasOffseTop}
                               canvasWidth={canvasDrWidth}
                               canvasHeight={canvasHeight}
                               background={'#fffef7'}
                               drClear={true} />
                </div>
            </div>
        </div>
    </Spin>;
}
