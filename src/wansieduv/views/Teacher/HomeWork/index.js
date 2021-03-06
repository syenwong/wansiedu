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
import './style.less';
import React, { useState, useEffect, useContext } from 'react';
import { EDU_CONTEXT } from '../../../store';
import { Table, Button, Tooltip, Form, Input, DatePicker, Modal, Tag } from 'antd';
import { delTaskApi, getHomeWorkListApi, getListSidsApi } from '../../../service/api/teacher/homework';
import { useHistory } from 'react-router-dom';
import { formatDateHw } from '../../../service/utils';
import { DEFAULT_PAGE_SIZE } from '../../../service/STATIC_DATA';
import { useModalError } from '../../../Controller/useModalError';
import { FileAddOutlined } from '@ant-design/icons';
import { ViewExamPaper } from '../ViewExamPaper';
import { useExamPaperAdmin } from '../../../Controller/useExamPaperAdmin';

const { RangePicker } = DatePicker;
const { Item, useForm } = Form;
export function HomeWork () {
    const [searchHwForm] = useForm();
    const history = useHistory();
    const { dispatch } = useContext(EDU_CONTEXT);
    const [homeworkList, setHomeWorkList] = useState([]);
    const examPaperAdmin = useExamPaperAdmin();
    const [formSearchOptions, setFormSearchOptions] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setloading] = useState(false);
    const ModalError = useModalError();
    const creatHomeWork = () => {
        history.push('/teacher/homework_edit');
    };
    const showExpaper = (e) => {
        examPaperAdmin('viewExaPaper', {
            id: e.eid,
            name: e.ename,
            labels: e.elabels,
            createTime: ''
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
    const resetForm = async () => {
        searchHwForm.resetFields();
        await getHomeWorkList({}, true);
    };
    const gotoHomeWorkOperatePlace = (c, path) => {
        dispatch({
            currentHomeWorkData: c
        });
        history.push(`/teacher/${path}/`);
    };
    const delTask = async (c) => {
        Modal.confirm({
            title: `????????????${c.name}`,
            async onOk () {
                try {
                    await delTaskApi(c.id);
                    await getHomeWorkList();
                } catch (e) {
                    ModalError(e.message);
                }
            }
        });
    };
    const columns = [
        {
            title: '????????????',
            dataIndex: 'startTime',
            width: '260px',
            render (t, c, i) {
                return <div style={{ textAlign: 'center' }}>{formatDateHw(c.startTime)} - {formatDateHw(c.endTime)}</div>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'name',
            width: '20%'
        },
        {
            title: '????????????',
            dataIndex: 'ename',
            
            render (t, c, i) {
                return <div className={'link'}>
                    <span onClick={() => showExpaper(c)}>{t}</span>
                    {c.elabels && c.elabels.split(',').map(l => <Tag>{l}</Tag>)}
                </div>;
            }
        },
        {
            title: '??????',
            width: '260px',
            render (t, c, i) {
                return <div className={'g-tableAction'} style={{ width: '100%' }}>
                    <Button type={'primary'} size={'middle'} onClick={() => gotoHomeWorkOperatePlace(c, 'homework_check')}>????????????</Button>
                    <Button type={'primary'} size={'middle'} onClick={() => gotoHomeWorkOperatePlace(c, 'homework_view')}>????????????</Button>
                    <Button type={'primary'} size={'middle'} onClick={() => gotoHomeWorkOperatePlace(c, `homework_trail/${c.id}`)}>????????????</Button>
                    <Button type={'primary'} size={'middle'} onClick={async () => {
                        try {
                            const sids = await getListSidsApi(c.id);
                            dispatch({
                                editHomeworkData: Object.assign({}, c, { sids })
                            });
                            history.push('/teacher/homework_edit');
                        } catch (e) {
                        }
                    }}>????????????</Button>
                    <Button type={'primary'} danger size={'middle'} onClick={() => delTask(c)}>????????????</Button>
                </div>;
            }
        }
    ];
    useEffect(() => {
        getHomeWorkList();
        dispatch({ currentTeacherNavKey: 'homework' });
    }, []);
    return <div className={'g-homeworklist'}>
        <div className={'g-searchForm'}>
            <Form name={'searchHwForm'} form={searchHwForm}
                  initialValues={{ name: '', rangDate: '' }}
                  className={'searchHwForm'}
                  onFinish={searchWithForm}>
                <Item name={'key'}>
                    <Input style={{ width: 200 }} type="text" placeholder={'????????????????????????'} />
                </Item>
                <Item name={'rangeDate'}>
                    <RangePicker placeholder={['??????????????????', '??????????????????']} style={{ width: 300 }} showTime format="YYYY/MM/DD HH:mm:ss" />
                </Item>
                <div className={'u-formBtnWrap'}>
                    <Button type={'primary'} htmlType={'submit'}>??????</Button>
                    <Button onClick={resetForm}>??????</Button>
                </div>
            </Form>
            <div className={'optionwrap'}>
                <Button icon={<FileAddOutlined />} type="primary" onClick={creatHomeWork}>????????????</Button>
            </div>
        </div>
        <Table size={'middle'}
               loading={loading}
               bordered
               rowKey={'id'}
               columns={columns}
               dataSource={homeworkList}
               pagination={{ position: ['bottomCenter'], showTotal: (t) => `???${t}?????????`, pageSize: DEFAULT_PAGE_SIZE, total: total }}
               onChange={({ current }) => getHomeWorkList(Object.assign({}, formSearchOptions, { page: current }))} />
        <ViewExamPaper />
    </div>;
}
