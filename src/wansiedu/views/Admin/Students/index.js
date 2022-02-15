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
import React, { useEffect, useState } from 'react';
import { Button, Tag, Modal, Table } from 'antd';
import { GlobalTop } from '../../../globalComponents/GlobalTop';
import { AdminRightNav } from '../_common/AdminRightNav';
import { deleteStudentApi, getStudentsListApi } from '../../../service/api/admin/student';
import { EditStudentModal } from './EditStudentModal';
import { PwdShow } from '../_common/PwdShow';
import { StudentsSearchForm } from '../../../globalComponents/StudentsSearchForm';
import { DEFAULT_PAGE_SIZE } from '../../../service/STATIC_DATA';

export function Students () {
    const [StudentList, setStudentList] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [editStudent, setEditStudent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    async function getStudentList (configs = {}) {
        setLoading(true);
        try {
            const { students, total } = await getStudentsListApi(configs);
            setStudentList(students);
            setTableTotal(total);
            setLoading(false);
        } catch (e) {
            Modal.error({ title: e.message });
        }
    }
    function tableOnChange (pageInfo) {
        const { current: page } = pageInfo;
        getStudentList({ page });
    }
    function editStudentHandler (student = null) {
        setEditStudent(student);
        setIsModalVisible(true);
    }
    function deleteStudentHandler (t) {
        Modal.confirm({
            title: '确定删除学生 - ' + t.name,
            okText: '我确定',
            cancelText: '我好像点错了',
            async onOk () {
                try {
                    await deleteStudentApi(t.uid);
                    getStudentList();
                    Modal.success({ title: '删除成功' });
                } catch (e) {
                    Modal.error({ title: '删除失败', content: e.message });
                }
            }
        });
    }
    const onSearch = (keys) => {
        getStudentList(keys);
    };
    const columns = [
        {
            title: 'N',
            width: 42,
            align:'center',
            render (t, c, i) {
                return i + 1;
            }
        },
        {
            title: '用户名 / 密码',
            dataIndex: 'account',
            width: '30%',
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
            title: '年级',
            dataIndex: 'grade',
            width: '20%'
        },
        {
            title: '操作',
            width: '20%',
            render (t, r, i) {
                return <div className={'g-tableAction'}>
                    <Button onClick={() => editStudentHandler(r)} ghost type="primary">修改</Button>
                    <Button onClick={() => deleteStudentHandler(r)} danger>删除</Button>
                </div>;
            }
        }
    ];
    useEffect(() => {
        getStudentList();
    }, []);
    return <div className={'g-adminwrap g-admin-student'}>
        <GlobalTop title={'学生管理'} />
        <div className={'g-operation'}>
            <div className={'optionwrap'}>
                <Button className={'add'} type="primary" onClick={() => editStudentHandler()}>+ 新增学生</Button>
            </div>
            <AdminRightNav currentKey={'student'} />
        </div>
        <div className="g-content">
            <StudentsSearchForm search={onSearch} />
            <Table loading={loading}
                   size={'middle'}
                   columns={columns}
                   dataSource={StudentList}
                   rowKey={'uid'}
                   bordered
                   pagination={{position: ['bottomCenter'],  showTotal: (t) => `共${t}条`, pageSize: DEFAULT_PAGE_SIZE, total: tableTotal }}
                   onChange={tableOnChange} />
        </div>
        <EditStudentModal isModalVisible={isModalVisible}
                          editStudent={editStudent}
                          okHandler={() => {
                              getStudentList();
                              setIsModalVisible(false);
                          }}
                          cancelHandler={() => {
                              setIsModalVisible(false);
                              setEditStudent(null);
                          }} />
    </div>;
}
