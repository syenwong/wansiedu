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
import { deleteStudentApi, getStudentsListApi } from '../../../service/api/admin/student';
import { EditStudentModal } from './EditStudentModal';
import { PwdShow } from '../_common/PwdShow';
import { StudentsSearchForm } from '../../../globalComponents/StudentsSearchForm';
import { DEFAULT_PAGE_SIZE, GRADE_MAP } from '../../../service/STATIC_DATA';
import { EDU_CONTEXT } from '../../../store';

export function Students () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const [currentPage, setCurentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [studentList, setStudentList] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [editStudent, setEditStudent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const getStudentList = async (configs = {}) => {
        setLoading(true);
        const _configs = Object.assign({ page: currentPage, size: currentPageSize }, configs);
        try {
            const { students, total } = await getStudentsListApi(_configs);
            setStudentList(students);
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
        await getStudentList({ page, size });
    };
    const editStudentHandler = (student = null) => {
        setEditStudent(student);
        setIsModalVisible(true);
    };
    const deleteStudentHandler = (t) => {
        Modal.confirm({
            title: '?????????????????? - ' + t.name,
            okText: '?????????',
            cancelText: '??????????????????',
            async onOk () {
                try {
                    await deleteStudentApi(t.uid);
                    await getStudentList();
                    Modal.success({ title: '????????????' });
                } catch (e) {
                    Modal.error({ title: '????????????', content: e.message });
                }
            }
        });
    };
    const onSearch = async (keys) => {
        setCurentPage(1);
        await getStudentList(Object.assign({ page: 1, size: currentPageSize }, keys));
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
            title: '????????? / ??????',
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
            title: '??????',
            dataIndex: 'name'
        },
        {
            title: '??????',
            dataIndex: 'grade',
            width: '20%',
            render (g) {
                return GRADE_MAP[g];
            }
        },
        {
            title: '??????',
            width: '20%',
            render (t, r, i) {
                return <div className={'g-tableAction'}>
                    <Button onClick={() => editStudentHandler(r)} ghost type="primary">??????</Button>
                    <Button onClick={() => deleteStudentHandler(r)} danger>??????</Button>
                </div>;
            }
        }
    ];
    useEffect(() => {
        (async () => {
            await getStudentList();
        })();
        dispatch({
            currentTeacherNavKey: 'student'
        });
    }, []);
    return <div className={'g-adminwrap g-admin-student'}>
        <div className="g-content">
            <Affix>
                <StudentsSearchForm search={onSearch} rightBtn={<div className={'optionwrap'}>
                    <Button className={'add'} type="primary" onClick={() => editStudentHandler()}>+ ????????????</Button>
                </div>} />
            </Affix>
            <Table loading={loading}
                   size={'middle'}
                   columns={columns}
                   dataSource={studentList}
                   rowKey={'uid'}
                   bordered
            
                   pagination={{
                       current: currentPage, pageSize: currentPageSize, total: tableTotal,
                       position: ['bottomCenter'], showSizeChanger: true, showTotal: (t) => `???${t}???`
                   }}
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
