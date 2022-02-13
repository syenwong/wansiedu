/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/12.
 * Copyright 2021/8/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/12
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, Affix, Tag, Modal, Table } from 'antd';
import { deleteTeacherApi, getTeachersListApi } from '../../../service/api/admin/teacher';
import { EditTeacherModal } from './EditTeacherModal';
import { PwdShow } from '../_common/PwdShow';
import { SearchForm } from './SearchForm';
import { DEFAULT_PAGE_SIZE } from '../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../store';

export function Teachers () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const [currentPage, setCurentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [TeacherList, setTeacherList] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [editTeacher, setEditTeacher] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const getTeacherList = async (configs = {}) => {
        setLoading(true);
        try {
            const { data, total } = await getTeachersListApi(Object.assign({ page: currentPage, size: currentPageSize }, configs));
            setTeacherList(data);
            setTableTotal(total);
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    };
    const tableOnChange = async (pageInfo) => {
        const { current: page, pageSize: size } = pageInfo;
        setCurentPage(page);
        setCurrentPageSize(size);
        await getTeacherList({ page });
    };
    const editTeacherHandler = (teacher = null) => {
        setEditTeacher(teacher);
        setIsModalVisible(true);
    };
    const deleteTeacherHandler = async (t) => {
        Modal.confirm({
            title: '确定删除教师 - ' + t.name,
            okText: '我确定',
            cancelText: '我好像点错了',
            async onOk () {
                try {
                    await deleteTeacherApi(t.uid);
                    getTeacherList();
                    Modal.success({ title: '删除成功' });
                } catch (e) {
                    Modal.error({ title: '删除失败', content: e.message });
                }
            }
        });
    };
    const onSearch = async (keys) => {
        setCurentPage(1);
        await getTeacherList(Object.assign({ page: 1, size: currentPageSize }, keys));
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
            title: '用户名 / 密码',
            dataIndex: 'account',
            width: '20%',
            render (t, a, i) {
                return <div className={'accountInfo'}>
                    <Tag color={'blue'}>{a.account}</Tag>
                    <PwdShow pwd={a.pwd} />
                </div>;
            }
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '学科',
            dataIndex: 'subject',
            width: '20%'
        },
        {
            title: '操作',
            width: '20%',
            render (t, r, i) {
                return <div className={'g-tableAction'}>
                    <Button onClick={() => editTeacherHandler(r)} ghost type="primary">修改</Button>
                    <Button onClick={() => deleteTeacherHandler(r)} danger>删除</Button>
                </div>;
            }
        }
    ];
    useEffect(() => {
        getTeacherList();
        dispatch({
            currentTeacherNavKey: 'teacher'
        });
    }, []);
    return <div className={'g-adminwrap g-admin-teacher'}>
        
        <div className="g-content">
            <Affix>
                <SearchForm search={onSearch} rightBtn={<div className={'optionwrap'}>
                    <Button className={'add'} type="primary" onClick={() => editTeacherHandler()}>+ 新增教师</Button>
                </div>} />
            </Affix>
            <Table columns={columns}
                   loading={loading}
                   size={'middle'}
                   dataSource={TeacherList}
                   rowKey={'uid'}
                   bordered
                   pagination={{
                       current: currentPage, pageSize: currentPageSize, total: tableTotal,
                       position: ['bottomCenter'], showSizeChanger: true, showTotal: (t) => `共${t}条`
                   }}
                   onChange={tableOnChange} />
        </div>
        <EditTeacherModal isModalVisible={isModalVisible}
                          editTeacher={editTeacher}
                          okHandler={() => {
                              getTeacherList();
                              setIsModalVisible(false);
                          }}
                          cancelHandler={() => {
                              setIsModalVisible(false);
                              setEditTeacher(null);
                          }} />
    </div>;
}
