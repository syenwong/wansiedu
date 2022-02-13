/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/15.
 * Copyright 2022/1/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/15
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { findParentNode } from '@hjq/uts';
import { EDU_CONTEXT } from '../../../../store';

export function SubjectNav (props) {
    const { state: { clientHeight } } = useContext(EDU_CONTEXT);
    const { subjectNoList } = props;
    const switchSubjectNo = (e) => {
        const _t = e.target;
        if (_t.nodeName.toLowerCase() === 'li' && _t.dataset.no) {
            const no = _t.dataset.no;
            let top = '';
            const $self = document.querySelector(`#subjectItem_id_${no}`);
            const isroot = $self.dataset.isroot;
            if (isroot === '1') {
                top = $self.offsetTop;
            } else {
                const p = findParentNode($self.parentNode, 'li');
                top = $self.offsetTop + p.offsetTop;
            }
            window.scrollTo(0, top - 32);
        }
    };
    return <ul className={'g-subjectNav'} style={{ height: `${clientHeight - 130}px` }} onClick={switchSubjectNo}>
        {subjectNoList.map((subjectNo, i) => {
            const {
                Noo,
                No,
                hasAnswer,
                hasError,
                hasChecked
            } = subjectNo;
            const classNames = !hasAnswer ? 'noAnswer' : (hasChecked ? (hasError ? 'hasError' : 'nor') : 'unckecked');
            return <li data-no={No} key={i} className={classNames}>{Noo}</li>;
        })}
    </ul>;
}
