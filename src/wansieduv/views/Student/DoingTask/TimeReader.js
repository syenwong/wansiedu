/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/31.
 * Copyright 2021/12/31 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/31
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import { smTr } from '../../../service/utils';

let reader = null;
let hasSubmit = false;
let spendTime = 0;
function clearReader (r) {
    clearTimeout(reader);
    reader = null;
}
export function TimeReader ({ du = 0, submit, tRsf } = {}) {
    const [remainTime, setRemainTime] = useState(du);
    const remainTimeRef = useRef();
    const [color, setColor] = useState('green');
    useImperativeHandle(tRsf, () => {
        return {
            submitSpendTime () {
                const _spendTime = spendTime;
                spendTime = (0);
                return _spendTime;
            }
        };
    });
    useEffect(() => {
        clearReader('b');
        remainTimeRef.current = du;
        reader = setInterval(() => {
            let remainTime = remainTimeRef.current;
            if (remainTime <= 1) {
                if (!hasSubmit) {
                    hasSubmit = true;
                    clearReader('e');
                    submit();
                }
            } else {
                spendTime += 1;
                remainTime -= 1;
                remainTimeRef.current = remainTime;
                setRemainTime(remainTimeRef.current);
                setColor(remainTime > 60 ? 'green' : 'red');
            }
        }, 1000);
        return () => {
            clearReader('f');
        };
    }, [du]);
    useEffect(() => {
        return () => {
            clearReader();
        };
    }, []);
    return <div className={`TimeReader ${color}`}>
        {
            smTr(remainTime * 1000, ' 分 ', ' 秒 ')
        }
    </div>;
}
