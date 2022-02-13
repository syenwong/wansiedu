/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/21.
 * Copyright 2021/9/21 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/21
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect } from 'react';
import { GlobalTop } from '../../../globalComponents/GlobalTop';
import { Button, Table, Tag, Modal } from 'antd';
import { useModalError } from '../../../Controller/useModalError';
import { getMyStudentsListApi } from '../../../service/api/teacher/students';
import { useLabelsMng } from '../../../Controller/useLabelsMng';
import { EDU_CONTEXT } from '../../../store';
import { editStudentApi } from '../../../service/api/teacher/students';
import { getStudentGrade } from '../../../service/utils';
import { StudentsSearchForm } from '../../../globalComponents/StudentsSearchForm';
import { GRADE_MAP } from '../../../service/STATIC_DATA';

const { CheckableTag } = Tag;
const emptyStudent = { students: [], total: 0 };
export function Tstudents () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const { account, eidtModalHeight, labels } = state;
    const ModalError = useModalError();
    const [myStudentList, setMyStudentList] = useState(emptyStudent);
    const [otherMyStudents, setOtherMyStudents] = useState(emptyStudent);
    const [selectStudentState, SetSelectStudentState] = useState(1);
    const [currentStudents, setCurrentStudents] = useState(emptyStudent);
    const [editStudents, setEditStudents] = useState(null);
    const [selectLabels, setSelectLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editStudentModalVisible, setEditStudentModalVisible] = useState(false);
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const labelsMng = useLabelsMng();
    const getStudents = async (configs) => {
        setLoading(true);
        SetSelectStudentState(-1);
        try {
            const _configs = Object.assign({}, { page: 1, size: 999 }, configs);
            const { myStudents, otherStudents } = await getMyStudentsListApi(_configs);
            setMyStudentList(myStudents);
            setOtherMyStudents(otherStudents);
            if (myStudents.students.length > 0) {
                SetSelectStudentState(1);
            } else if (otherStudents.students.length > 0) {
                SetSelectStudentState(0);
            } else {
                SetSelectStudentState(1);
            }
            setLoading(false);
        } catch (e) {
            ModalError(e.message);
        }
    };
    const labelCheckedHandler = (name, checked) => {
        let _selectedLabels = Object.assign([], (selectLabels || []));
        if (checked) {
            _selectedLabels = [...new Set([..._selectedLabels, name])];
        } else {
            _selectedLabels.splice(_selectedLabels.indexOf(name), 1);
        }
        setSelectLabels(_selectedLabels);
    };
    const editLabels = async ({ students = editStudents, _selectLabels = selectLabels } = {}) => {
        for (const editStudentElement of students) {
            let _labels = _selectLabels === null ? [] : [...new Set([..._selectLabels, account])];
            const data = Object.assign({}, editStudentElement, { labels: _labels.join(',') });
            try {
                await editStudentApi(data, data.uid);
                SetSelectStudentState(-1);
                setEditStudents(null);
                setselectedRowKeys([]);
            } catch (e) {
                ModalError(e.message);
            }
        }
        getStudents();
    };
    // editLabelsModalVisible
    const editLabelsModalVisible = ({ students = editStudents, labels = selectLabels, type = 1 } = {}) => {
        if (students) {
            setEditStudents(students);
        }
        setSelectLabels(labels);
        setEditStudentModalVisible(true);
    };
    /*
    * */
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setEditStudents(selectedRows);
            setselectedRowKeys(selectedRowKeys);
        }
    };
    /*
    *
    * */
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
            title: '用户名 ',
            dataIndex: 'account',
            width: '20%'
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '年级',
            dataIndex: 'startTime',
            width: '20%',
            render (t, a, i) {
                return GRADE_MAP[getStudentGrade(t)];
            }
        }
    ];
    if (selectStudentState === 1) {
        columns.push({
                title: '分类标签',
                dataIndex: 'labels',
                render (_selectLabels, a, i) {
                    return <div>
                        {
                            _selectLabels.map((r, index) => {
                                if (r === account) {
                                    return null;
                                } else {
                                    return <Tag key={index}>{r}</Tag>;
                                }
                            })
                        }</div>;
                }
            },
            {
                title: '操作管理',
                dataIndex: 'labels',
                render (_selectLabels, a, i) {
                    return <>
                        <Button type={'primary'}
                                onClick={() => editLabelsModalVisible({ students: [a], labels: _selectLabels })}>
                            修改学生标签分类
                        </Button>
                        <Button style={{ marginLeft: '16px' }} danger type={'primary'}
                                onClick={() => editLabelsModalVisible({ students: [a], labels: null, type: 0 })}>
                            删除学生
                        </Button>
                    </>;
                }
            });
    } else {
        columns.push({
            title: '操作',
            render (t, a, i) {
                return <Button type={'primary'}
                               onClick={() => editLabelsModalVisible({ students: [a], labels: [] })}>
                    添加到我的学生
                </Button>;
            }
        });
    }
    /*
    *
    *
    * */
    useEffect(() => {
        getStudents();
        labelsMng('getLabels');
        dispatch({ currentTeacherNavKey: 'student' });
    }, []);
    useEffect(() => {
        switch (selectStudentState) {
            case 1:
                setCurrentStudents(myStudentList);
                break;
            case 0:
                setCurrentStudents(otherMyStudents);
                break;
            default:
                setCurrentStudents(emptyStudent);
        }
    }, [selectStudentState]);
    return <div className={'g-teachersStudentViews'}>
        <div className={'g-operation'}>
            <StudentsSearchForm search={getStudents} />
            <div className={'optionwrap'}>
                <Button type={selectStudentState === 1 && 'primary'} onClick={() => SetSelectStudentState(1)}>我的学生</Button>
                <Button type={selectStudentState === 0 && 'primary'} onClick={() => SetSelectStudentState(0)}>所有学生</Button>
            </div>
        </div>
        <div className="g-content">
            <Table rowSelection={{
                type: 'checkbox',
                ...rowSelection
            }}
                   columns={columns}
                   loading={loading}
                   size={'middle'}
                   dataSource={currentStudents.students}
                   rowKey={'uid'}
                   bordered
                   pagination={{ position: ['bottomCenter'], showTotal: (t) => `共${t}名学生`, pageSize: 10, total: currentStudents.total }} />
            <Button type={'primary'} onClick={() => {
                editLabelsModalVisible({
                    labels: selectStudentState === 1 ? null : []
                });
            }
            }>批量{selectStudentState === 1 ? '删除' : '添加'}</Button>
        </div>
        
        <Modal width={'540px'}
               visible={editStudentModalVisible}
               okText={'确定'}
               cancelText={'取消'}
               onOk={() => {
                   editLabels();
                   setEditStudentModalVisible(false);
               }}
               onCancel={() => {
                   setEditStudentModalVisible(false);
                   setEditStudents(null);
                   setSelectLabels([]);
                   setselectedRowKeys([]);
               }}>
            {selectLabels === null ?
                <div className={'g-studentCheckableTag'}>
                    <h3>确定删除学生</h3>
                    <p>{(editStudents || []).map(s => s.name).join('，')}</p>
                </div> :
                <div className={'g-studentCheckableTag'} style={{ maxHeight: eidtModalHeight / 3 + 'px' }}>
                    {
                        editStudents?.length > 0 &&
                        (editStudents?.length > 1 ?
                            <>{`确定批量${selectStudentState === 1 ? '删除' : '添加'} 学生`}  <p>{(editStudents || []).map(s => s.name).join('，')}</p></> :
                            <> <h3>编辑学生</h3> <p>{editStudents[0].name}</p> </>)
                    }
                    <h3>标签分类编辑</h3>
                    <div className={'tagContainer'} style={{ minHeight: '100px', maxHeight: eidtModalHeight / 3 + 'px' }}>{
                        (labels.student || []).map((l, index) => {
                            return <CheckableTag
                                key={l.id}
                                checked={(selectLabels || []).includes(l.name)}
                                onChange={checked => labelCheckedHandler(l.name, checked)}>{l.name}</CheckableTag>;
                        })
                    }</div>
                </div>}
        </Modal>
    </div>;
}
