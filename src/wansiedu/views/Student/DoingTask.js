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
import 'swiper/swiper-bundle.css';
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { EDU_CONTEXT } from '../../store';
import { Divider, Image, Button, Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { doneTaskApi, getSubjectlistApi } from '../../service/api/student';
import { SubjectTimer } from './components/SubjectTimer';

export function DoingTask () {
    const history = useHistory();
    const {
        state: {
            currentTask,
            eidtModalHeight
        },
        dispatch
    } = useContext(EDU_CONTEXT);
    const [swiperDom, setSwiperDom] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [subjectIndexs, setSubjectIndexs] = useState([-1, 0]);
    const swiperControl = async (type, e) => {
        // 题目切换
        let _currentSubjectIndex = -1;
        if (type) {
            const activeIndex = swiperDom.activeIndex;
            switch (type) {
                case 'pre':
                    if (activeIndex > 0) {
                        _currentSubjectIndex = activeIndex - 1;
                    }
                    break;
                case 'next':
                    if (activeIndex < subjects.length - 1) {
                        _currentSubjectIndex = activeIndex + 1;
                    }
                    break;
            }
        } else {
            let eInnerText;
            if (e && e.target.nodeName.toLowerCase() === 'li' && (eInnerText = e.target.innerText)) {
                _currentSubjectIndex = Number(eInnerText) - 1;
            }
        }
        if (_currentSubjectIndex !== -1 && _currentSubjectIndex !== subjects[1]) {
            swiperDom.slideTo(_currentSubjectIndex);
        }
    };
    const finishExa = () => {
        const undo = [];
        subjects.forEach((s, i, a) => {
            if (s.time <= 0 && i !== subjectIndexs[1]) {
                undo.push(i + 1);
            }
        });
        Modal.confirm({
            title: '答完了？确定提交试卷？',
            content: undo.length > 0 ? `仍有${undo.join(',')}题未作答` : '',
            okText: '稳了！确定交卷',
            cancelText: '我还是再好好检查一下吧',
            onOk () {
                const currentSubjectIndex = subjectIndexs[1];
                setSubjectIndexs([currentSubjectIndex, -2]);
            }
        });
    };
    /*
    *
    * */
    // 返回
    const backToList = () => {
        history.push('/student');
        dispatch({
            currentTask: null
        });
    };
    useEffect(() => {
        if (!currentTask) {
            backToList();
        } else {
            (async () => {
                try {
                    const _subjects = await getSubjectlistApi(currentTask.id);
                    setSubjects(_subjects);
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, []);
    return <div className={'g-exercisingSubjectContent'}>
        <div className={'g-exerciseSwiper'}>
            <Swiper
                initialSlide={0}
                onSlideChange={(currentSlide) => {
                    setSubjectIndexs([currentSlide.previousIndex, currentSlide.activeIndex]);
                }}
                onSwiper={(swiper) => {
                    setSwiperDom(swiper);
                }}>
                {(subjects || []).map((s, index) => {
                    return <SwiperSlide key={index} className={'subjectItem'}>
                        <figure className={'subjectImg'} style={{ height: eidtModalHeight + 'px' }}>
                            <Image preview={false} src={s.url} alt="" /></figure>
                    </SwiperSlide>;
                })}
            </Swiper>
        </div>
        <div className={'g-exercisingControl'}>
            <div className={'taskHeader'}>
                <Button danger type={'primary'} onClick={finishExa}>交卷 返回作业列表 </Button>
                <h2>{currentTask?.name}</h2>
            </div>
            <div className={'subjectNumbers remark'}>
                {subjects && (subjects[subjectIndexs[1]]?.remark)}
            </div>
            <div className={'subjectNumbers num'}>
                <ul onClick={(e) => swiperControl(null, e)}>
                    {(subjects || []).map((s, index) => {
                        return <li className={index === subjectIndexs[1] ? 'now' : (s.time > 0 ? 'done' : 'nor')}
                                   key={index}>{index + 1}</li>;
                    })}
                </ul>
            </div>
            <div className={'subjectControl'}>
                <Button size={'large'} type={'primary'} className={'btn pre'} onClick={() => swiperControl('pre')}>上一题</Button>
                <Button size={'large'} type={'primary'} className={'btn next'} onClick={() => swiperControl('next')}>下一题 </Button>
            </div>
            <Divider />
            <SubjectTimer currentTask={currentTask}
                          subjects={subjects}
                          finishExa={finishExa}
                          subjectIndexs={subjectIndexs}
                          setSubjects={setSubjects}
                          backToList={backToList} />
        </div>
    </div>;
}
