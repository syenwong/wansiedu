/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/11.
 * Copyright 2021/12/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/11
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { EDU_CONTEXT } from '../../../../../store';
import { SubjectItem } from './SubjectItem/';
import { PlusOutlined, UpOutlined, DownOutlined, DeleteOutlined, PlusSquareOutlined, EditOutlined } from '@ant-design/icons';
import { useExamPaperAdmin } from '../../../../../Controller/useExamPaperAdmin';
import { Button } from 'antd';
import { serializeSubject } from '../../../../../service/utils';
import { SubjectImg } from './SubjectImg/SubjectImg';


export function EditExamPaperSubjects (props) {
    const { eid } = props;
    const { state: { currentExamPaperSubjects, currentExamPaperSubjectFilterKey } } = useContext(EDU_CONTEXT);
    const { data = [] } = currentExamPaperSubjects || {};
    const [subjects, setSubjects] = useState([]);
    const examPaperAdmin = useExamPaperAdmin();
    useEffect(() => {
        const _subject = serializeSubject({ data, key:currentExamPaperSubjectFilterKey });
        setSubjects(_subject);
    }, [data, currentExamPaperSubjectFilterKey]);
    return <div className={'editExamPaperSubjectsList'}>
        {
            subjects.length > 0 ?
                <ul className={'g-subjects'}>
                    {subjects.map((s, i) => {
                        return <li key={i} className={'mainSubject'}>
                            <div className={'subjectLabel'}>
                                {subjects?.[i - 1]?.id && <UpOutlined onClick={() => examPaperAdmin('changeSubjectIndex', s.id, subjects[i - 1].id, s.eid)} />}
                                <span className={'No'}>{i + 1}</span>
                                {subjects?.[i + 1]?.id && <DownOutlined onClick={() => examPaperAdmin('changeSubjectIndex', s.id, subjects[i + 1].id, s.eid)} />}
                            </div>
                            {
                                s.isParent === 1 ?
                                    <>
                                        <div className={'mainSubject_content'}>
                                            <div className={'operate'}>
                                                <Button className={'hoverShow delete'} type={'danger'} size={'small'} onClick={async () => examPaperAdmin('deleteSubject', i + 1, s.eid, s.id)}><DeleteOutlined /></Button>
                                                <Button className={'hoverShow addSubBtn'} size={'small'} type={'primary'}
                                                        onClick={() => examPaperAdmin('updateSubject', 'add', { eid, isParent: false, parentId: s.id, No: Array.isArray(s.subSubjects) ? `${i + 1}.${s.subSubjects.length + 1}` : 1 })}><PlusOutlined />
                                                </Button>
                                            </div>
                                            {s.remark && <div className={'subjectRemark'}>
                                                {s.remark}
                                            </div>}
                                            <SubjectImg url={s.url} noUrl={'无题干图片'} submitSubjectImg={async (value) => {
                                                await examPaperAdmin('updateSubjectItem', eid, s.id, { key: 'file', value });
                                            }} />
                                        </div>
                                        {
                                            Array.isArray(s.subSubjects) && s.subSubjects.length > 0 ?
                                                <ul className={'subSubject'}>
                                                    {
                                                        s.subSubjects.map((ss, j) => {
                                                            return <li key={j}>
                                                                {
                                                                    Number(ss.parentId) !== 0 &&
                                                                    <div className={'subSubjectLabel'}>
                                                                        {s.subSubjects?.[j - 1]?.id && <UpOutlined onClick={() => examPaperAdmin('changeSubjectIndex', ss.id, s.subSubjects?.[j - 1]?.id, eid)} />}
                                                                        <span className={'subSubjectNo'}>{ss.No}</span>
                                                                        {s.subSubjects?.[j + 1]?.id && <DownOutlined onClick={() => examPaperAdmin('changeSubjectIndex', ss.id, s.subSubjects?.[j + 1]?.id, eid)} />}
                                                                    </div>
                                                                }
                                                                <SubjectItem subject={ss} />
                                                            </li>;
                                                        })
                                                    }
                                                </ul> : '添加小题'
                                        }
                                    </> :
                                    <SubjectItem subject={s} sortId={[subjects?.[i - 1]?.id, subjects?.[i + 1]?.id]} />
                            }
                        </li>;
                    })}
                </ul> :
                <div className={'none'}>暂无题目，请点击下方按钮添加题目</div>
        }
        <div className={'addBtnWrap'}>
            <Button type={'primary'} size={'large'} icon={<PlusOutlined />}
                    onClick={async () => await examPaperAdmin('updateSubject', 'add', { eid, No: subjects.length + 1 })}>新增（无小题）</Button>
            <Button type={'primary'} size={'large'} ghost icon={<PlusSquareOutlined />}
                    onClick={async () => await examPaperAdmin('updateSubject', 'add', { eid, No: subjects.length + 1, isParent: true })}>新增（含小题）</Button>
        </div>
    </div>;
}
