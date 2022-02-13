/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/11.
 * Copyright 2021/12/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/11
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../../../../store';
import { Tag, Button, Select, Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';

const { Option } = Select;
export function EditExamPaperInfo () {
    const { state: { currentExamPaper, currentExamPaperSubjects }, dispatch } = useContext(EDU_CONTEXT);
    const { name, labels = '', createTime } = currentExamPaper || {};
    const history = useHistory();
    return <div className={'editExamPaper_info'}>
        <div className={'editExamPaper_info_left'}>
            <div className={'basic'}>
                <h4>{name}</h4>
                <span className={'item'}> {createTime}</span>
                <span>共<Tag color={'cyan'}>{currentExamPaperSubjects?.total}</Tag>题，</span>
                <span>总分<Tag color={'blue'}>{currentExamPaperSubjects?.totalNum}</Tag>分</span>
            </div>
            <div className={'label'}>
                <div className={'item'}>
                    {labels && (labels.split(',').map((t, i) => <Tag key={i}>{t}</Tag>))}
                </div>
                <div className={'filterTypeKey'}>
                    题目分类： <Select defaultValue={''} style={{ width: 120 }} allowClear onChange={(v) => {
                    dispatch({
                        currentExamPaperSubjectFilterKey: v
                    });
                }}>
                    <Option value={null}>全部</Option>
                    {
                        (currentExamPaperSubjects?.typeMap ?? []).map((o, i) => {
                            return <Option key={i} value={o}>{o}</Option>;
                        })
                    }
                </Select>
                </div>
            </div>
        </div>
        <div className={'backBtn'}>
            <Button type="primary"
                    className={'add'}
                    icon={<RollbackOutlined />}
                    onClick={() => Modal.confirm({
                        title: '确定放回试卷列表?',
                        okText: '确定返回',
                        cancelText: '继续编辑',
                        onOk () {
                            history.push('/teacher/ExamPaper');
                        }
                    })}>返回试卷列表</Button>
        </div>
    </div>;
}
