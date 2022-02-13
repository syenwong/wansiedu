/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/23.
 * Copyright 2021/9/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/23
 * @version */
import '../style.less';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalTop } from '../../../../globalComponents/GlobalTop';
import { Button } from 'antd';
import { FileAddOutlined, MinusSquareOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { HomeWorkInfo } from './HomeWorkInfo';
import { SelectStudents } from './SelectStudents';
import { SelectExaPaper } from './SelectExaPaper';
import { Steps, Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { editHomeWorkApi } from '../../../../service/api/teacher/homework';
import { EDU_CONTEXT } from '../../../../store';
import { useModalError } from '../../../../Controller/useModalError';

const { Step } = Steps;
const EditContentMap = [HomeWorkInfo, SelectStudents, SelectExaPaper];
const errorArAs = {
    name: '作业名字不能为空',
    sids: '至少选择一个学生',
    exaPaper: '布置作业的试卷需要选择'
};
export function EditHomeWork () {
    const history = useHistory();
    const ModalError = useModalError();
    const { state: { editHomeworkData }, dispatch } = useContext(EDU_CONTEXT);
    const [editHomeworkStep, setEditHomeworkStep] = useState(0);
    const EditContent = EditContentMap[editHomeworkStep];
    const backtoUrl = () => {
        dispatch({
            editHomeworkData: {
                id: null,
                name: '',
                startTime: '',
                endTime: '',
                sids: [],
                exaPaperId: null
            }
        });
        history.push('/teacher/homework');
    };
    const createExaPaper = async () => {
        const errorAr = [];
        for (const whd of Object.entries(editHomeworkData)) {
            const [k, v] = whd;
            if (errorArAs[k] && !v) {
                errorAr.push(errorArAs[k]);
            }
        }
        if (errorAr.length > 0) {
            ModalError('以下操作未执行：', errorAr.join(' | '));
        } else {
            try {
                const options = {
                    name: editHomeworkData.name,
                    sids: editHomeworkData.sids.join(','),
                    eid: editHomeworkData.exaPaperId
                };
                options.startTime = editHomeworkData.startTime ? new Date(editHomeworkData.startTime).getTime() : new Date().getTime();
                options.endTime = editHomeworkData.endTime ? new Date(editHomeworkData.endTime).getTime() : 4070908800000;
                await editHomeWorkApi(options, editHomeworkData.id);
                Modal.success({
                    title: '发布作业完成,确定返回作业列表',
                    onOk () {
                        backtoUrl();
                    }
                });
            } catch (e) {
                ModalError(e.message);
            }
        }
    };
    return <div className={'g-homeworkEditWrap'}>
        <GlobalTop title={'作业管理'} />
        <div className={'g-operation'}>
            <div className={'optionwrap'}>
                <Button icon={<FileAddOutlined />} type="primary" onClick={() => {
                    backtoUrl();
                }}>返回列表</Button>
            </div>
        </div>
        <div className={'g-content g-homeworkeditcontent'}>
            <div className={'content-step'}>
                <Steps current={editHomeworkStep} onChange={(current) => setEditHomeworkStep(current)}>
                    <Step title="作业基本信息" description="作业名称与有限时间" />
                    <Step title="选择学生" description="选择布置作业的学生" />
                    <Step title="选择试卷" description="选择布置作业的试卷" />
                </Steps>
            </div>
            <EditContent />
        </div>
        <div className={'u-formBtnWrap g-saveHomeWork'}>
            <ul>
                <li>作业名称 <span className={'icon'}> {editHomeworkData.name ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}</span></li>
                <li>有效期 <MinusSquareOutlined /></li>
                <li>布置作业学生 <span className={'icon'}> {editHomeworkData.sids && editHomeworkData.sids.length > 0 ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}</span></li>
                <li>选择试卷 <span className={'icon'}> {editHomeworkData.exaPaperId ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}</span></li>
            </ul>
            <Button
                disabled={!(editHomeworkData.name && (editHomeworkData.sids && editHomeworkData.sids.length) && editHomeworkData.exaPaperId)}
                type={'primary'} size={'large'} danger onClick={createExaPaper}>保存作业并发布</Button>
        </div>
    </div>;
}
