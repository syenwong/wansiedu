/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/7.
 * Copyright 2021/9/7 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/7
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import { EDU_CONTEXT } from '../../store';
import { Button, Table, Modal, Tag, DatePicker, Form, Input } from 'antd';
import { TAGS_COLORES } from '../../service/STATIC_DATA';
import { CheckOutlined } from '@ant-design/icons';
import { DEFAULT_PAGE_SIZE } from '../../service/STATIC_DATA';
import { useExamPaperAdmin } from '../../Controller/useExamPaperAdmin';
import { useModalError } from '../../Controller/useModalError';
import { ViewExamPaper } from '../../views/Teacher/ViewExamPaper';

const { RangePicker } = DatePicker;
const { Item, useForm } = Form;
export function ExamPaperContent (props) {
    const { pageSize = DEFAULT_PAGE_SIZE, showType = 'exaManage', extOperate = null } = props;
    const [examSearchForm] = useForm();
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { ExamPaperList, editHomeworkData } = state;
    const examPaperAdmin = useExamPaperAdmin();
    const ModalError = useModalError();
    const [formSearchOptions, setFormSearchOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const getExamPaperList = async (formOptions, reset = false) => {
        setLoading(true);
        try {
            await examPaperAdmin('getExamPaperList', Object.assign({ size: pageSize }, reset ? {} : formSearchOptions, formOptions));
            setLoading(false);
        } catch (e) {
            ModalError(e.message);
        }
    };
    const resetSearch = async () => {
        examSearchForm.resetFields();
        setFormSearchOptions({});
        await getExamPaperList({ page: 1 }, true);
    };
    const getExaPaperForSearch = async () => {
        try {
            const formOptions = { size: pageSize };
            const { key, rangDate } = await examSearchForm.validateFields();
            if (key) {
                formOptions.key = key;
            }
            if (rangDate) {
                const [createTimeAfterMoment, createTimeBeforeMoment] = rangDate;
                const createTimeAfter = new Date(createTimeAfterMoment.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime();
                const createTimeBefore = new Date(createTimeBeforeMoment.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime();
                formOptions.createTimeAfter = createTimeAfter;
                formOptions.createTimeBefore = createTimeBefore;
            }
            setFormSearchOptions(formOptions);
            await getExamPaperList(formOptions);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getExamPaperList({ page: 1 });
    }, []);
    const OptionMap = (t, c, i) => {
        switch (showType) {
            case 'exaManage':
                return <div className={'g-tableAction'}>
                    <Button className={'GreenBtn'} onClick={() => examPaperAdmin('rediectExamPaperOperation', c, 'examPaper_viewDoData')}>学生作答情况</Button>
                    <Button type="primary" onClick={() => examPaperAdmin('viewExaPaper', c)}>预览</Button>
                    <Button type="primary" onClick={() => dispatch({ currentExamPaper: c, editExamPaperModalVisible: true })}>信息</Button>
                    <Button type="primary" onClick={async () => await examPaperAdmin('rediectExamPaperOperation', c, 'editExamPaperSubjects')}>题目</Button>
                    <Button type="primary" onClick={() => examPaperAdmin('deleteExamPaper', c)} danger>删除</Button>
                </div>;
            case 'homework':
                return <div className={'g-tableAction'}>
                    <Button type="primary" onClick={() => examPaperAdmin('viewExaPaper', c)}>预览</Button>
                    {editHomeworkData?.eid === c.id ? <div className={'hasSelect'}><CheckOutlined /></div> : <Button type="primary" onClick={() => examPaperAdmin('selectExaPaper', c)}>选择</Button>}
                </div>;
        }
    };
    const exaPaperColumns = [
        {
            title: 'N',
            width: 50,
            render (t, c, i) {
                return i + 1;
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTime',
            width: 160,
            align: 'center'
        },
        {
            title: '试卷名称',
            width: 360,
            dataIndex: 'name'
        },
        {
            title: '分类标签',
            dataIndex: 'labels',
            textWrap: 'word-break',
            render (t, c, i) {
                return <div style={{ width: '100%' }}>
                    {(t ? t.split(',') : []).map((l, index) => {
                        return <Tag key={index} color={TAGS_COLORES[index]}>{l}</Tag>;
                    })}
                </div>;
            }
        },
        {
            title: '操作',
            width: 450,
            align: 'center',
            dataIndex: 'action',
            render (t, c, i) {
                return OptionMap(t, c, i);
            }
        }
    ];
    return <div className={'g-exaPaperTable'}>
        <div className={'examPaperOperate'}>
            <Form name={'examSearchForm'} form={examSearchForm}
                  onFinish={getExaPaperForSearch}
                  className={'exaPaperSearch'}>
                <Item name={'key'}>
                    <Input style={{ width: 200 }} placeholder="输入试卷相关的标题、标签" />
                </Item>
                <Item name={'rangDate'}>
                    <RangePicker showTime style={{ width: '320px' }} placeholder={['搜索范围开始时间', '搜索范围结束时间']} />
                </Item>
                <Button type={'primary'} htmlType={'submit'}>搜索</Button>
                <Button onClick={resetSearch}>重置</Button>
            </Form>
            {extOperate}
        </div>
        <Table size={'small'}
               loading={loading}
               columns={exaPaperColumns}
               dataSource={ExamPaperList.data}
               rowKey={'id'}
               bordered
               pagination={{ position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize, total: ExamPaperList.total }}
               onChange={async (v) => {
                   await getExamPaperList(Object.assign({}, formSearchOptions, { page: v.current }));
               }} />
        <ViewExamPaper />
    </div>;
}
