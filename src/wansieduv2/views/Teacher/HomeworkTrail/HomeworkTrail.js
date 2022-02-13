/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/1.
 * Copyright 2022/1/1 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/1
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Divider, Select, Table, Tag, Checkbox, Modal } from 'antd';
import { listStudentTimeApi, listStudentTimeDetailApi } from '../../../service/api/teacher/homework';
import { EDU_CONTEXT } from '../../../store';
import { smTr } from '../../../service/utils';
import { DoDataViewAnswer } from '../../../globalComponents/DoDataViewAnswer';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
export function HomeworkTrail (props) {
    const { state: { clientWidth, clientHeight, currentHomeWorkData } } = useContext(EDU_CONTEXT);
    const { name = '', ename = '' } = currentHomeWorkData || {};
    const tid = props?.match?.params?.tid;
    const [trails, setTrails] = useState([]);
    const [sids, setSids] = useState({});
    const [subjectNo, setSubjectNo] = useState({});
    const [studentData, setStudentData] = useState({});
    const [currentNo, setCurrentNo] = useState(null);
    const [stCheckedList, setStCheckedList] = useState([]);
    const [stCheckAll, setStCheckAll] = useState(true);
    const [sidsOptions, setSidsOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewAnswerVisible, setViewAnswerVisible] = useState(false);
    const [viewAnswerContent, setViewAnswerContent] = useState(null);
    const getData = async (tid) => {
        try {
            setLoading(true);
            const [_trails, dataDetails] = await Promise.all([listStudentTimeDetailApi(tid), listStudentTimeApi(tid)]);
            const __trails = [];
            const _sids = {};
            const subjectAnswersOigin = dataDetails[0].subjectTimeAndAnswers;
            const ans = {};
            const sortHandler = (a1, a2) => {
                return a1.sort - a2.sort;
            };
            for (const subjectAnswersOiginElement of subjectAnswersOigin) {
                const { parentId, isParent, subjectId } = subjectAnswersOiginElement;
                if (parentId === 0) {
                    if (isParent === 1) {
                        subjectAnswersOiginElement.children = subjectAnswersOiginElement.children || [];
                    }
                    ans[subjectId] = subjectAnswersOiginElement;
                } else {
                    if (ans[parentId]) {
                        ans[parentId].children = ans[parentId].children || [];
                    } else {
                        const p = subjectAnswersOigin.find(sa => {
                            return sa.subjectId === parentId;
                        });
                        if (p) {
                            ans[parentId] = p;
                            ans[parentId].children = [];
                        }
                    }
                    if (ans?.[parentId]?.children) {
                        ans[parentId].children.push(subjectAnswersOiginElement);
                    }
                }
            }
            const _subjectNo = {};
            const subjectNoOigin = Object.values(ans).sort(sortHandler);
            const soLength = subjectNoOigin.length;
            for (let i = 1; i <= soLength; i++) {
                const subjectNoOiginElement = subjectNoOigin[i - 1];
                subjectNoOiginElement.no = i;
                if (subjectNoOiginElement.isParent === 0) {
                    _subjectNo[subjectNoOiginElement.subjectId] = i;
                }
                if (subjectNoOiginElement.children) {
                    const cans = subjectNoOiginElement.children.sort(sortHandler);
                    const coLen = cans.length;
                    for (let j = 1; j <= coLen; j++) {
                        const can = cans[j - 1];
                        can.no = j;
                        _subjectNo[can.subjectId] = i + '.' + j;
                    }
                }
            }
            Object.entries(_trails).forEach((trail, index) => {
                const [k, v] = trail;
                _sids[k] = k;
                const vlen = v.length;
                for (let i = 0; i < vlen; i++) {
                    const vElement = v[i];
                    __trails[i] = __trails[i] || { key: i };
                    __trails[i][k] = vElement;
                }
            });
            const _studentData = {};
            for (const dataDetail of dataDetails) {
                const { id, subjectTimeAndAnswers } = dataDetail;
                const subjectTimeAndAnswersMap = {};
                for (const subjectTimeAndAnswerItem of subjectTimeAndAnswers) {
                    const { subjectId } = subjectTimeAndAnswerItem;
                    subjectTimeAndAnswersMap[subjectId] = subjectTimeAndAnswerItem;
                }
                for (const entry of Object.entries(subjectTimeAndAnswersMap)) {
                    const [subjectId, subjectData] = entry;
                    if (subjectData.parentId) {
                        if (subjectTimeAndAnswersMap[subjectData.parentId]) {
                            subjectData.url = [subjectData.url, ...subjectTimeAndAnswersMap[subjectData.parentId].url];
                        } else {
                            delete subjectTimeAndAnswersMap[subjectId];
                        }
                    } else {
                        subjectData.url = [subjectData.url];
                    }
                }
                dataDetail.subjectTimeAndAnswersMap = subjectTimeAndAnswersMap;
                _studentData[id] = dataDetail;
            }
            const _sidsOptions = Object.keys(_sids).map(s => {
                return {
                    label: _studentData?.[s]?.name,
                    value: s
                };
            });
            const _stCheckedList = _sidsOptions.map(s => {
                return s.value;
            });
            setTrails(__trails);
            setSubjectNo(_subjectNo);
            setStudentData(_studentData);
            setSids(_sids);
            setSidsOptions(_sidsOptions);
            setStCheckedList(_stCheckedList);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
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
        ...Object.keys(sids).map((s, i) => {
            return {
                title: studentData?.[s]?.name,
                dataIndex: s,
                width: 100,
                render (t, a, i) {
                    let result = '-';
                    if (t) {
                        const { subjectId, spendTime } = t;
                        result = <div onClick={() => {
                            setViewAnswerContent(Object.assign({}, studentData?.[s]?.subjectTimeAndAnswersMap[subjectId], { no: subjectNo?.[subjectId] }));
                            setViewAnswerVisible(true);
                        }} className={`trailtd ${((currentNo === null || Number(currentNo) === Number(subjectId)) && (stCheckedList.includes(String(s)))) ? 'nor' : 'hide'}`}>
                            <Tag className={'no'} color={'green'}>{subjectNo?.[subjectId]}</Tag> <Tag className={'sp'} color={'blue'}>{smTr(spendTime)}</Tag>
                        </div>;
                    }
                    return result;
                }
            };
        })
    ];
    useEffect(() => {
        getData(tid).then(r => {
        });
    }, []);
    return <div className={'g-HomeworkTrail'}>
        <div className={'header'}>
            <Select defaultValue={null} style={{ width: 120 }} onChange={(v) => setCurrentNo(v)}>
                <Option value={null}>全部题目</Option>
                {
                    Object.entries(subjectNo).map(s => {
                        const [k, v] = s;
                        return <Option key={k} value={k}>第{v}题</Option>;
                    })
                }
            </Select>
            <div className={'students'}>
                <Checkbox style={{ width: '8em' }} onChange={(e) => {
                    const v = e.target.checked;
                    setStCheckedList(v ? sidsOptions.map(s => {
                        return s.value;
                    }) : []);
                    setStCheckAll(v);
                }} checked={stCheckAll}>
                    全部
                </Checkbox>
                <CheckboxGroup options={sidsOptions} value={stCheckedList} onChange={(list) => {
                    setStCheckedList(list);
                    setStCheckAll(list.length === sidsOptions.length);
                }} />
            </div>
        </div>
        <Table size={'middle'}
               bordered
               loading={loading}
               columns={columns}
               scroll={{ x: clientWidth - 200, y: clientHeight - 200 }}
               dataSource={trails} pagination={false} />
        <Modal maskClosable={false}
               title={<div>{name}-{ename}</div>}
               width={'auto'}
               closable={true}
               footer={null}
               onCancel={() => setViewAnswerVisible(false)}
               visible={viewAnswerVisible}>
            <DoDataViewAnswer modalHeight={clientHeight - 200} viewAnswerContent={viewAnswerContent} />
        </Modal>
    </div>;
}
