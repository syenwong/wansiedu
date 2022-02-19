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
import React, { useState, useEffect, useContext } from 'react';
import { EDU_CONTEXT } from '../../../../store';
import { Table, Button, Tooltip, Form, Input, DatePicker } from 'antd';
import { getHomeWorkListApi, getListSidsApi } from '../../../../service/api/teacher/homework';
import { useHistory } from 'react-router-dom';
import { formatDateHw } from '../../../../service/utils';
import { useActionHandlerMaps } from '../../../../Controller/useActionHandlerMaps';
import { DEFAULT_PAGE_SIZE } from '../../../../service/STATIC_DATA';
import { useModalError } from '../../../../Controller/useModalError';

const { RangePicker } = DatePicker;
const { Item, useForm } = Form;
export function HomeWorkList () {
    const [searchHwForm] = useForm();
    const history = useHistory();
    const { dispatch } = useContext(EDU_CONTEXT);
    const [homeworkList, setHomeWorkList] = useState([]);
    const actionHandler = useActionHandlerMaps();
    const [formSearchOptions, setFormSearchOptions] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setloading] = useState(false);
    const ModalError = useModalError();
    const showExpaper = (a) => {
        actionHandler('viewExaPaper', {
            id: a.eid,
            name: a.ename,
            labels: a.elabels
        });
    };
    const getHomeWorkList = async (_formSearchOptions, reset = false) => {
        setloading(true);
        try {
            const _homeworkList = await getHomeWorkListApi(Object.assign({}, { page: 1 }, reset ? {} : _formSearchOptions));
            setHomeWorkList(_homeworkList.data);
            setTotal(_homeworkList.total);
            setloading(false);
        } catch (e) {
        }
    };
    const searchWithForm = async () => {
        try {
            const _formSearchOptions = { page: 1 };
            const { key, rangeDate } = await searchHwForm.validateFields();
            if (key) {
                _formSearchOptions.key = key;
            }
            if (rangeDate) {
                const [_createTimeAfter, _createTimeBefore] = rangeDate;
                const createTimeAfter = _createTimeAfter ? new Date(_createTimeAfter.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime() : null;
                const createTimeBefore = _createTimeBefore ? new Date(_createTimeBefore.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime() : null;
                if (createTimeAfter) {
                    _formSearchOptions.createTimeAfter = createTimeAfter;
                }
                if (createTimeBefore) {
                    _formSearchOptions.createTimeBefore = createTimeBefore;
                }
            }
            setFormSearchOptions(_formSearchOptions);
            getHomeWorkList(_formSearchOptions);
        } catch (e) {
            ModalError(e.message);
        }
    };
    const resetForm = () => {
        searchHwForm.resetFields();
        getHomeWorkList({}, true);
    };
    const columns = [
        {
            title: 'N',
            width: 42,
            align: 'center',
            render (t, c, i) {
                return i + 1;
            }
        },
        {
            title: '有效时间',
            dataIndex: 'startTime',
            width: '260px',
            render (t, c, i) {
                return <div style={{ textAlign: 'center' }}>{formatDateHw(c.startTime)} - {formatDateHw(c.endTime)}</div>;
            }
        },
        {
            title: '作业名称',
            dataIndex: 'name'
        },
        {
            title: '试卷名称',
            dataIndex: 'ename',
            width: '30%',
            render (t, c, i) {
                return <div className={'link'} onClick={() => showExpaper(c)}>{c.elabels ? <Tooltip placement="top" title={c.elabels.replace(/,/g, ' | ')}>{t}</Tooltip> : t}</div>;
            }
        },
        {
            title: '操作',
            width: '260px',
            render (t, c, i) {
                return <div className={'g-tableAction'} style={{ width: '100%' }}>
                    <Button type={'primary'} size={'middle'} onClick={() => history.push(`/teacher/homework_view/${c.id}/${c.name}/${c.ename}`)}>完成情况</Button>
                    <Button type={'primary'} size={'middle'} onClick={async () => {
                        try {
                            const sids = await getListSidsApi(c.id);
                            dispatch({
                                editHomeworkData: {
                                    id: c.id,
                                    name: c.name,
                                    startTime: c.startTime,
                                    endTime: c.endTime,
                                    sids: sids,
                                    exaPaperId: c.eid
                                }
                            });
                            history.push('/teacher/homework_edit');
                        } catch (e) {
                        }
                    }}>修改作业</Button></div>;
            }
        }
    ];
    useEffect(() => {
        getHomeWorkList();
    }, []);
    return <div className={'g-homeworklist'}>
        <div className={'g-searchForm'}>
            <Form name={'searchHwForm'} form={searchHwForm}
                  initialValues={{ name: '', rangDate: '' }}
                  className={'searchHwForm'}
                  onFinish={searchWithForm}>
                <Item name={'key'}>
                    <Input style={{ width: 200 }} type="text" placeholder={'请输入搜索关键字'} />
                </Item>
                <Item name={'rangeDate'}>
                    <RangePicker placeholder={['作业开始时间', '作业结束时间']} style={{ width: 300 }} showTime format="YYYY/MM/DD HH:mm:ss" />
                </Item>
                <div className={'u-formBtnWrap'}>
                    <Button type={'primary'} htmlType={'submit'}>搜索</Button>
                    <Button onClick={resetForm}>重置</Button>
                </div>
            </Form>
        </div>
        <Table size={'middle'}
               loading={loading}
               bordered
               rowKey={'id'}
               columns={columns}
               dataSource={homeworkList}
               pagination={{ position: ['bottomCenter'],  showTotal: (t) => `共${t}条作业`, pageSize: DEFAULT_PAGE_SIZE, total: total }}
               onChange={({ current }) => getHomeWorkList(Object.assign({}, formSearchOptions, { page: current }))} />
    </div>;
}
