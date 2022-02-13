/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/9.
 * Copyright 2022/1/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/9
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Tag, Button } from 'antd';
import { ScoreInput } from '../../../../../../globalComponents/ScoreInput';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

export function Score ({ value = 0, onChange }) {
    const [isEdit, setIsEdit] = useState(false);
    const [editScore, setEditScore] = useState(value);
    const [scoreStep, setScoreStep] = useState(0);
    const setStepsHandler = (e) => {
        const t = e.target;
        const n = Number(t.dataset.n);
        if (t.nodeName.toLowerCase() === 'span' && n) {
            setScoreStep(n);
            setEditScore(editScore + n);
        }
    };
    return <div className={'score'}>
        {
            isEdit ?
                <div className={'edit'}>
                    <ScoreInput value={editScore} onChange={(v) => setEditScore(v)} />
                    <div className={'steps'} onClick={setStepsHandler}>
                        {
                            [3, 4, 5, 6, 10, 0.5].map((n, i) => {
                                return <span key={i} data-n={n} className={scoreStep === n ? 'cur' : ''}>{n}</span>;
                            })
                        }
                    </div>
                    <Button className={'confirmScore'} size={'small'} type={'primary'} icon={<CheckOutlined />} onClick={async () => {
                        if (value !== editScore) {
                            await onChange?.(editScore);
                        }
                        setIsEdit(false);
                    }} />
                </div> :
                <div className={'show'}>
                    <Tag color="green">{editScore}</Tag>
                    <EditOutlined onClick={() => setIsEdit(true)} />
                </div>
        }
    
    </div>;
}
