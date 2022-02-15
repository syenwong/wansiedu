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
import React, { useState, useContext, useEffect } from 'react';
import { Transfer, Table, Tag } from 'antd';
import difference from 'lodash/difference';
import { getMyStudentsListApi } from '../../../../service/api/teacher/students';
import { useModalError } from '../../../../globalComponents/useModalError';
import { getStudentGrade } from '../../../../service/utils';
import { EDU_CONTEXT } from '../../../../store';
import { useLabelsShowTags } from '../../../../globalComponents/useLabelsShowTags';
/*
*
* */
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer locale={{ itemUnit: '名学生', itemsUnit: '名学生', searchPlaceholder: '学生姓名、标签、年级，可以空格隔开联合搜索' }}
              showSelectAll={false}
              operations={['添加到布置作业中', '从已选择学生中删除']}
              {...restProps}>
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection = {
                onSelectAll (selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect ({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys
            };
            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    pagination={{ position: ['bottomCenter'], showTotal: (t) => `共${t}条`, page: 1, pageSize: 10 }}
                    onRow={({ key }) => ({
                        onClick: () => {
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        }
                    })}
                />
            );
        }}
    </Transfer>
);
//export class SelectStudents extends React.Component {
export function SelectStudents () {
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const [MyStudentList, setMyStudentList] = useState([]);
    const [targetKeys, setTargetKeys] = useState(state.editHomeworkData.sids || []);
    const [showSearch] = useState(true);
    const ModalError = useModalError();
    const labelsShowTags = useLabelsShowTags();
    const leftTableColumns = [
        {
            title: 'N',
            width: '36px',
            align: 'center',
            render (t, c, i) {
                return ` ${i + 1} `;
            }
        },
        {
            dataIndex: 'account',
            title: '用户名',
            width: '20%'
        },
        {
            dataIndex: 'name',
            title: '姓名',
            width: '12%'
        },
        {
            dataIndex: 'startTime',
            title: '年级',
            width: '12%',
            render (t) {
                return getStudentGrade(t);
            }
        },
        {
            dataIndex: 'labels',
            title: '分类标签',
            render: (labels) => {
                return labelsShowTags(labels);
            }
        }
    ];
    const rightTableColumns = [
        {
            dataIndex: 'name',
            title: '姓名'
        }
    ];
    const onChange = nextTargetKeys => {
        setTargetKeys(nextTargetKeys);
        dispatch({
            editHomeworkData: Object.assign({}, state.editHomeworkData,
                { sids: nextTargetKeys })
        });
    };
    const getMyStudents = async () => {
        try {
            const { allStudents } = await getMyStudentsListApi({ size: 999 });
            const data = allStudents.map(s => {
                return Object.assign({}, s, { key: s.uid });
            });
            setMyStudentList(data);
        } catch (e) {
            ModalError(e.message);
        }
    };
    useEffect(() => {
        getMyStudents();
    }, []);
    return <div className={'g-homeworkSelectStudent'}>
        <TableTransfer
            className={'g-TableTransfer'}
            dataSource={MyStudentList}
            targetKeys={targetKeys}
            showSearch={showSearch}
            onChange={onChange}
            filterOption={(inputValue, item) => {
                const iptGroup = inputValue.split(/,|\s/ig);
                return iptGroup.every((ipt) => {
                    return (item?.account ?? '').includes(ipt) ||
                        (item?.name ?? '').includes(ipt) ||
                        (item?.labels ?? []).some(l => {
                            return l.includes(ipt);
                        }) ||
                        (item.startTime && getStudentGrade(item.startTime) || '').includes(ipt);
                });
            }}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
        />
    </div>;
}
