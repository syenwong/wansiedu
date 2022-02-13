/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/23.
 * Copyright 2022/1/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/23
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { CanvasCom } from '../CanvasCom/CanvasCom';
import { EDU_CONTEXT } from '../../store';
import { addAnswerApi } from '../../service/api/student';

export function AddSignModal (props) {
    const { tid } = props;
    const { state: { canvasRatio, addSubjectSignModalData, currentTaskExaPaper }, dispatch } = useContext(EDU_CONTEXT);
    const { id, url, answer_img, check_img, anMark_img, ckMark_img } = addSubjectSignModalData || {};
    console.log(currentTaskExaPaper);
    const canvasRef = useRef();
    const [canvasHeight, setcanvasHeight] = useState();
    const [canvasWidth, setcanvasWidth] = useState();
    const [offsetTop, setoffsetTop] = useState(0);
    const [offsetLeft, setoffsetLeft] = useState(0);
    const launchIntoFullscreenHandler = () => {
        const dw = document.documentElement.offsetWidth;
        const dh = document.documentElement.offsetHeight;
        const _ch = dh * .98 - 54 - 16;
        const _offsetTop = (dh - (_ch + 54 + 16)) / 2 + 8;
        const _canvasWidth = _ch / canvasRatio;
        const _offsetLeft = (dw - _canvasWidth) / 2;
        setoffsetLeft(_offsetLeft);
        setoffsetTop(_offsetTop);
        setcanvasHeight(_ch);
        setcanvasWidth(_canvasWidth);
    };
    useEffect(() => {
        launchIntoFullscreenHandler();
    }, []);
    return <Modal className={'g-addSignModal'}
                  visible={addSubjectSignModalData}
                  maskClosable={false}
                  width={canvasWidth + 16}
                  destroyOnClose={true}
                  closable={false}
                  onOk={async () => {
                      const { formData } = await canvasRef.current.submitAnswer(tid, id);
                      await addAnswerApi({ sTid: tid, subjectId: id, file: formData, url: answer_img });
                  }}
                  onCancel={() => dispatch({ addSubjectSignModalData: null })}>
        <CanvasCom cRef={canvasRef}
                   id={'paper'}
                   offsetLeft={offsetLeft}
                   drClear={false}
                   isTeacher={2}
                   offsetTop={offsetTop}
                   canvasHeight={canvasHeight}
                   canvasWidth={canvasWidth}
                   questionImages={url}
                   imageDrawed={[answer_img, check_img, ckMark_img]}
                   drawImageSrc={`${id}::${anMark_img}`} />
    
    </Modal>;
}
