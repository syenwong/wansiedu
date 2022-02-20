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
import { Modal, message } from 'antd';
import { CanvasCom } from '../CanvasCom/CanvasCom';
import { EDU_CONTEXT } from '../../store';
import { addAnswerApi } from '../../service/api/student';
import { checkAnswerApi } from '../../service/api/teacher/homework';
import { MARK_PREFIX } from '../../service/STATIC_DATA';

const { anMark, ckMark } = MARK_PREFIX;
export function AddSignModal (props) {
    const {
        callback = () => {
        }, type = anMark
    } = props;
    const { state: { canvasRatio, addSubjectSignModalData }, dispatch } = useContext(EDU_CONTEXT);
    const { sTid, parentUrl, url, answer_img, check_img, anMark_img, ckMark_img } = addSubjectSignModalData || {};
    const id = addSubjectSignModalData?.[type === 'anMark' ? 'id' : 'subjectId'];
    const canvasRef = useRef();
    const [canvasHeight, setcanvasHeight] = useState();
    const [canvasWidth, setcanvasWidth] = useState();
    const [offsetTop, setoffsetTop] = useState(0);
    const [offsetLeft, setoffsetLeft] = useState(0);
    const [markUrl, setMarkUrl] = useState('');
    const [drawImageSrc, setDrawImageSrc] = useState('');
    const [submitUrl, setSubmitUrl] = useState('');
    const [penColor, setPenColor] = useState(0);
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
        if (addSubjectSignModalData) {
            let murl = '', durl = '', sburl = '', pCl = 2;
            switch (type) {
                case anMark:
                    murl = ckMark_img;
                    durl = anMark_img;
                    sburl = answer_img;
                    pCl = 2;
                    break;
                case ckMark:
                    murl = anMark_img;
                    durl = ckMark_img;
                    sburl = check_img;
                    pCl = 3;
                    break;
            }
            setMarkUrl(murl);
            setDrawImageSrc(durl);
            setSubmitUrl(sburl);
            setPenColor(pCl);
        }
    }, [addSubjectSignModalData, type]);
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
                      try {
                          const { formData } = await canvasRef.current.submitDrawImage(sTid, id, type);
                          const api = type === anMark ? addAnswerApi : checkAnswerApi;
                          await api({ sTid: sTid, subjectId: id, file: formData, url: submitUrl });
                          dispatch({
                              addSubjectSignModalData: null
                          });
                          await callback();
                      } catch (e) {
                          message.error(e.message);
                      }
                  }}
                  onCancel={() => dispatch({ addSubjectSignModalData: null })}>
        <CanvasCom cRef={canvasRef}
                   id={'paper'}
                   offsetLeft={offsetLeft}
                   drClear={false}
                   penColor={penColor}
                   offsetTop={offsetTop}
                   canvasHeight={canvasHeight}
                   canvasWidth={canvasWidth}
                   questionImages={[parentUrl, url]}
                   imageDrawed={[answer_img, check_img, markUrl]}
                   drawImageSrc={`${id}::${drawImageSrc}`} />
    
    </Modal>;
}
