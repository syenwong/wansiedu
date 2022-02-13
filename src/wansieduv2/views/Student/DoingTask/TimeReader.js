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
import React, { useImperativeHandle, useEffect, useState } from 'react';
import { smTr } from '../../../service/utils';

let reader = null;
let hasSubmit = false;
let spendTime = 0;
function clearReader () {
    clearTimeout(reader);
    reader = null;
}
export function TimeReader ({ du = 0, submit, tRsf } = {}) {
    const [remainTime, setRemainTime] = useState(du);
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
        setRemainTime(du);
    }, [du]);
    useEffect(() => {
        clearReader();
        reader = setTimeout(() => {
            if (remainTime <= 1) {
                if (!hasSubmit) {
                    hasSubmit = true;
                    submit();
                }
            } else {
                spendTime = (spendTime + 1);
                setRemainTime(remainTime - 1);
                setColor(remainTime > 60 ? 'green' : 'red');
            }
        }, 1000);
        return () => {
            clearReader();
        };
    }, [remainTime]);
    return <div className={`TimeReader ${color}`}>
        {
            smTr(remainTime * 1000, ' 分 ', ' 秒 ')
        }
    </div>;
}
