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
import React, { useContext, useEffect, useState } from 'react';
import { Button, Tag } from 'antd';
import { smTr } from '../../../../service/utils';
import { EDU_CONTEXT } from '../../../../store';

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
function RenderImgUrl (props) {
    const { ImgUrl, figureStyle, zIndex = 0 } = props;
    return <figure className={figureStyle}>
        {ImgUrl.map((img, index) => {
            return (img.includes('noMatchingUrl')) ? null : <img style={{ zIndex: zIndex + index }} key={index} src={img} alt="" />;
        })}
    </figure>;
}


export function SubjectItem (props) {
    const { dispatch } = useContext(EDU_CONTEXT);
    const { subject, imgSize } = props;
    const { No, score, checkScore, remark, type, parentId, time, url, answer_img, anMark_img, ckMark_img, check_img } = subject;
    const [hasParent] = useState(Number(parentId) !== 0);
    const [containerMax, setContainerMax] = useState(0);
    const typeTr = typeof type === 'string' && type !== '' ? type.split(',') : ((Array.isArray(type) && type.length > 0) ? type : []);
    useEffect(() => {
        const proAll = [answer_img, check_img, anMark_img, ckMark_img].map(imgUrl => {
            return getImgHeight(imgUrl, imgSize);
        });
        const proUrl = (async () => {
            const allH = await Promise.all(url.map(async (u) => {
                return await getImgHeight(u, imgSize);
            }));
            return allH.reduce((t, n) => {
                return t + n;
            }, 0);
        })();
        Promise.all([...proAll, proUrl]).then(h => {
            const hu = Math.max(...h);
            setContainerMax(hu);
        });
    }, [subject]);
    return <div className={'m-subjectItem-studentView'}>
        <div className={`subjectInfo nr`}>
            <div className={'score'}>
                <Tag color="green">{Number(checkScore) === -1 ? '未批改' : checkScore}/{score}分</Tag>
                <Tag color={'orange'}>{smTr(time)}</Tag>
                {Array.isArray(typeTr) && typeTr.length > 0 && <div className={'subjectRemark'}>
                    {typeTr.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </div>}
            </div>
            <div className={'operate'}>
                <Button size={'small'} type={'primary'} onClick={() => {
                    dispatch({
                        addSubjectSignModalData: subject
                    });
                }}>我还想再改改...</Button>
            </div>
        </div>
        {remark && <div className={'subjectRemark'}>
            {remark}
        </div>}
        <div className={'answerImgsContainer'} style={{ height: containerMax + 'px' }}>
            <RenderImgUrl ImgUrl={url} figureStyle={'questionUrls'} />
            <RenderImgUrl ImgUrl={[answer_img, check_img, anMark_img, ckMark_img]} figureStyle={'drawedImage'} zIndex={84} />
        </div>
    </div>;
}
