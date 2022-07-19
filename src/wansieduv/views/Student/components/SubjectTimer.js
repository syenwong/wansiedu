/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/26.
 * Copyright 2021/9/26 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/26
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { smTr } from '../../../service/utils';
import { addSpendApi, doneTaskApi } from '../../../service/api/student';
import { Modal } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

let Timer = null;
const clearTimer = () => {
    clearTimeout(Timer);
    Timer = null;
};
export function SubjectTimer (props) {
    const {
        currentTask, subjects, backToList,
        subjectIndexs, setSubjects, finishExa
    } = props;
    const [spendTime, setSpendTime] = useState(0);
    const [spendStartTime, setSpendStartTime] = useState(new Date().valueOf());
    const [timeCounter, setTimeCounter] = useState(0);
    const [timeCounterVisible, setTimeCounterVisible] = useState(false);
    const [fiveMinRemind, setFiveMinRemind] = useState(true);
    const [oneMinRemind, setOneMinRemind] = useState(true);
    const reportSpendTime = async () => {
        const now = new Date().valueOf();
        const _spendTime = now - spendStartTime;
        setSpendStartTime(now);
        if (subjects.length > 0) {
            try {
                await addSpendApi(currentTask.id, subjects[subjectIndexs[0]].id, _spendTime);
                if (subjectIndexs[1] === -2) {
                    await doneTaskApi(currentTask.id);
                    backToList();
                } else {
                    subjects[subjectIndexs[0]].time += _spendTime;
                    setSubjects(Object.assign([], subjects));
                    setSpendTime(-1);
                }
            } catch (e) {
                Modal.error({
                    title: e.message || '网络错误，答题中止，请确保网络正常后重新开始',
                    closable: false,
                    onOk () {
                        backToList();
                    }
                });
            }
        }
    };
    const needRemindTime = () => {
        const now = new Data().getTime();
        const endTimeVf = new Date(currentTask.endTime.replace(/'-'/ig, '/')).getTime();
        const fiveMin = 5 * 60 * 1000;
        const oneMin = 60 * 1000;
        let msg = '';
        if (now > endTimeVf - fiveMin && now < endTimeVf - oneMin && fiveMinRemind) {
            setFiveMinRemind(false);
            msg = '还有 5 分钟结束答题，请抓紧时间~';
        }
        if (now > endTimeVf - oneMin && now < endTimeVf && oneMinRemind) {
            setOneMinRemind(false);
            msg = '还有 1 分钟结束答题，请抓紧时间~';
        }
        if (now > endTimeVf) {
            msg = '答题时间已结束，3秒后自动交卷';
            setTimeout(() => {
                finishExa();
            }, 3000);
        }
        Modal.alert({
            title: msg
        });
    };
    /*
    *
    * */
    useEffect(() => {
        if (subjects) {
            reportSpendTime();
        }
    }, [subjectIndexs]);
    /*
    *
    * */
    useEffect(() => {
        clearTimer();
        const _spendTime = spendTime + 1;
        if (subjects && subjects[subjectIndexs[1]] && !isNaN(subjects[subjectIndexs[1]].time)) {
            setTimeCounter(smTr(subjects[subjectIndexs[1]]?.time + _spendTime * 1000));
        }
        Timer = setTimeout(() => {
            setSpendTime(spendTime + 1);
            needRemindTime();
        }, 1000);
    }, [spendTime]);
    /*
    *
    * */
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, []);
    return <div className={'timerDashboard'}>
        <div className={'isVisible'}>{timeCounterVisible ? timeCounter : '********'}</div>
        <div className={'visibleControl'} onClick={() => setTimeCounterVisible(!timeCounterVisible)}>{
            timeCounterVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />
        }</div>
    </div>;
}
