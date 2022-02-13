/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/12.
 * Copyright 2021/12/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/12
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Tag } from 'antd';
import { smTr } from '../../../../service/utils';
import { AddSignModal } from '../../../../globalComponents/AddSignModal';

function getImgHeight (url, imgSize) {
    return new Promise(resolve => {
        if (url) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                resolve(img.height * imgSize / img.width);
            };
            img.onerror = (e) => {
                resolve(0);
            };
        } else {
            resolve(0);
        }
    });
}
export function SubjectItem (props) {
    const { subject, imgSize } = props;
    const { score, checkUrl, checkScore, remark, type, id, url, answerUrl, parentUrl, parentId, No, time } = subject;
    const [hasParent] = useState(Number(parentId) !== 0);
    const [containerMax, setContainerMax] = useState(0);
    const [addSignModalVisible, setaddSignModalVisible] = useState(false);
    const typeTr = typeof type === 'string' && type !== '' ? type.split(',') : ((Array.isArray(type) && type.length > 0) ? type : []);
    useEffect(() => {
        const proAll = [getImgHeight(answerUrl, imgSize), getImgHeight(checkUrl, imgSize), getImgHeight(url, imgSize)];
        if (parentUrl) {
            proAll.push(getImgHeight(parentUrl, imgSize * .85));
        }
        Promise.all(proAll).then(h => {
            const [h1, h2, ...h3] = h;
            const hu = h3.reduce((t, n) => {
                return t + n;
            }, 0);
            setContainerMax(Math.max(h1, h2, hu));
        });
    }, []);
    return <div className={'m-subjectItem-studentView'}>
        {
            hasParent &&
            <span className={'subSubjectNo'}>{No}</span>
        }
        <div className={`subjectInfo ${hasParent ? 'pl' : 'nr'}`}>
            <div className={'score'}>
                <Tag color="green">{Number(checkScore) === -1 ? '未批改' : checkScore}/{score}分</Tag>
                <Tag color={'orange'}>{smTr(time)}</Tag>
                {Array.isArray(typeTr) && typeTr.length > 0 && <div className={'subjectRemark'}>
                    {typeTr.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </div>}
            </div>
            <div className={'operate'}>
                <Button size={'small'} type={'primary'} onClick={() => {
                    setaddSignModalVisible(true);
                }}>修改</Button>
            </div>
        </div>
        {remark && <div className={'subjectRemark'}>
            {remark}
        </div>}
        <div className={'answerImgsContainer'} style={{ height: containerMax + 'px' }}>
            <div className={`questionUrls ${answerUrl ? 'nor' : 'visible'}`}>
                {parentUrl && <img src={parentUrl} alt="" />}
                {url && <img src={url} alt="" />}
            </div>
            {answerUrl && <img className={'answerUrl'} src={answerUrl} alt="" />}
            {checkUrl && <img className={'checkUrl'} src={checkUrl} alt="" />}
        </div>
        <AddSignModal addSignModalVisible={addSignModalVisible} modalInfo={{}} swichModalVisible={() => {
            setaddSignModalVisible(false);
        }} />
    </div>;
}
