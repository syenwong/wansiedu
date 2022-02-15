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
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import { EDU_CONTEXT } from '../store';
import { useActionHandlerMaps } from './useActionHandlerMaps';
import { Button, Table, Modal, Tag, DatePicker, Form, Input } from 'antd';
import { TAGS_COLORES } from '../service/STATIC_DATA';
import { CheckOutlined } from '@ant-design/icons';
import { DEFAULT_PAGE_SIZE } from '../service/STATIC_DATA';
import { listStudentTimeByExamApi } from '../service/api/teacher/homework';
import { useHistory } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Item, useForm } = Form;
export function ExaPaperContent (props) {
    const history = useHistory();
    const { pageSize = DEFAULT_PAGE_SIZE, showType = 'exaManage' } = props;
    const [exaForm] = useForm();
    const { state } = useContext(EDU_CONTEXT);
    const { ExaPaperList, editHomeworkData } = state;
    const actionHandler = useActionHandlerMaps();
    const [formSearchOptions, setFormSearchOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const getExaPaperList = async (formOptions, reset = false) => {
        setLoading(true);
        try {
            await actionHandler('getPaperList', Object.assign({ size: pageSize }, reset ? {} : formSearchOptions, formOptions));
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const resetSearch = () => {
        exaForm.resetFields();
        setFormSearchOptions({});
        getExaPaperList({ page: 1 }, true);
    };
    const getExaPaperForSearch = async () => {
        try {
            const formOptions = { size: pageSize };
            const { key, rangDate } = await exaForm.validateFields();
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
            getExaPaperList(formOptions);
        } catch (e) {
            console.log(e);
        }
    };
 
    useEffect(() => {
        getExaPaperList({ page: 1 });
    }, []);
    const OptionMap = (t, c, i) => {
        switch (showType) {
            case 'exaManage':
                return <div className={'g-tableAction'}>
                    <Button className={'GreenBtn'} onClick={() => history.push(`/teacher/exaPaper_view/${c.id}/${c.name}`)}>学生作答情况</Button>
                    <Button type="primary" onClick={() => actionHandler('viewExaPaper', c)}>预览</Button>
                    <Button type="primary" onClick={() => actionHandler('editExaPaper', c)}>修改试卷信息</Button>
                    <Button type="primary" onClick={() => actionHandler('editSubjects', c)}>修改试卷题目</Button>
                    <Button type="primary" onClick={() => actionHandler('deleteExaPaper', c)} danger>删除</Button>
                </div>;
            case 'homework':
                return <div className={'g-tableAction'}>
                    <Button type="primary" onClick={() => actionHandler('viewExaPaper', c)}>预览</Button>
                    {editHomeworkData?.exaPaperId === c.id ? <div className={'hasSelect'}><CheckOutlined /></div> : <Button type="primary" onClick={() => actionHandler('selectExaPaper', c)}>选择</Button>}
                </div>;
        }
    };
    const exaPaperColumns = [
        {
            title: 'N',
            width: '50',
            render (t, c, i) {
                return i + 1;
            }
        },
        {
            title: '创建日期',
            dataIndex: 'createTime',
            width: '160px',
            align: 'center'
        },
        {
            title: '试卷名称',
            dataIndex: 'name'
        },
        {
            title: '分类标签',
            dataIndex: 'labels',
            render (t, c, i) {
                return (t ? t.split(',') : []).map((l, index) => {
                    return <Tag key={index} color={TAGS_COLORES[index]}>{l}</Tag>;
                });
            }
        },
        {
            title: '操作',
            width: '450px',
            align: 'center',
            dataIndex: 'action',
            render (t, c, i) {
                return OptionMap(t, c, i);
            }
        }
    ];
    return <div className={'g-exaPaperTable'}>
        <Form name={'exaForm'} form={exaForm}
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
        <Table size={'small'}
               loading={loading}
               columns={exaPaperColumns}
               dataSource={ExaPaperList.data}
               rowKey={'id'}
               bordered
               pagination={{ position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize, total: ExaPaperList.total }}
               onChange={(v) => {
                   getExaPaperList(Object.assign({}, formSearchOptions, { page: v.current }));
               }} />
    </div>;
}