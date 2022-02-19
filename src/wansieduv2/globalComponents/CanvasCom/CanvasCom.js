/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/22.
 * Copyright 2021/12/22 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/22
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useImperativeHandle, useEffect, useState, useRef } from 'react';
import './Draw';
import { Draw } from './Draw';
import { ShakeOutlined, FlagOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const penColors = ['#333', '#E50000', '#0091CE', '#ff6803'];
function dataURLtoFile (dataurl, filename) {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
    let binary = atob(dataurl.split(',')[1]);
    let mime = dataurl.split(',')[0].match(/:(.*?);/)[1];
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    let fileData = new Blob([new Uint8Array(array)], {
        type: mime
    });
    return new File([fileData], filename, { type: mime });
}
export function CanvasCom (props) {
    const {
        cRef, id = '0',
        offsetLeft = 0, offsetTop = 0, canvasWidth, canvasHeight = '100%',
        penColor = 1, setFlag, drClear = true, background = 'transparent',
        questionImages = [], imageDrawed = [], drawImageSrc = ''
    } = props;
    const [draw, setDraw] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [clearWidth, setClearWidth] = useState(1);
    const [flagVisible, setFlagVisible] = useState(false);
    const clearErCtl = useRef(false);
    const offsetEr = useRef(1);
    const offsetLeftRef = useRef(offsetLeft);
    const offsetTopRef = useRef(offsetTop);
    const canvasWidthRef = useRef(canvasWidth);
    const canvasHeightRef = useRef(canvasHeight);
    const selectCLW = (e) => {
        const _t = e.target;
        if (_t.nodeName.toLowerCase() === 'li') {
            const c = Number(_t.dataset.value);
            setClearWidth(c);
            offsetEr.current = c;
            setClear(true, c * 50);
        }
    };
    const setClear = (_clearing = true, _clearWidth = clearWidth * 50, $d = draw) => {
        setClearing(_clearing);
        clearErCtl.current = _clearing;
        if (_clearing) {
            $d.clearing = _clearWidth;
        } else {
            $d.clearing = 0;
        }
    };
    useImperativeHandle(cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        submitDrawImage: (sTid, subjectId, prefix = 'answer') => {
            return new Promise((resolve) => {
                const imgDataOr = draw.ctx.getImageData(0, 0, draw.width, draw.height);
                const imgData = imgDataOr.data;
                const ilen = imgData.length;
                let ncHeight = 1;
                for (let i = ilen; i > 0; i--) {
                    if (i % 4 === 0 && imgData[i + 3] === 255) {
                        ncHeight = Math.floor(i / 4 / draw.width) + 10;
                        break;
                    }
                }
                let newCanvas = document.createElement('canvas'); //创建处理后画布对象
                newCanvas.width = draw.width;
                newCanvas.height = ncHeight;
                var newCanvasCtx = newCanvas.getContext('2d');
                newCanvasCtx.putImageData(imgDataOr, 0, 0, 0, 0, draw.width, ncHeight); //绘制
                const imgBase64 = newCanvas.toDataURL('image/png');
                const file = dataURLtoFile(imgBase64, `${prefix}_${sTid}_${subjectId}_${new Date().getTime()}.png`);
                const formData = new FormData();
                formData.append('file', file, file.name);
                resolve({
                    imgBase64,
                    formData,
                    file
                });
            });
        },
        clear () {
            if (draw?.clear) {
                draw?.clear();
            }
        },
        async drawImage (url) {
            try {
                await draw.drawImage(url, draw.canvas.width, draw.canvas.height);
            } catch (e) {
                throw e;
            }
        }
    }));
    const drawImage = async (url) => {
        try {
            await draw.drawImage(url, draw.canvas.width, draw.canvas.height);
        } catch (e) {
            throw e;
        }
    };
    const selectFlag = (c) => {
        setFlag(c);
        setFlagVisible(false);
    };
    useEffect(() => {
        const _$er = document.querySelector(`#ER_${id}`);
        const _$canvasWrap = document.querySelector(`#canvasWrap_${id}`);
        const $d = new Draw(`#canvasInc_${id}`, {
            offsetLeft: offsetLeft,
            offsetTop: offsetTop,
            offsetWidth: canvasWidth,
            offsetHeight: canvasHeight,
            defaultColor: penColors[Number(penColor)],
            colors: penColors
        });
        setDraw($d);
        const erTranslate = (x, y, _$er) => {
            const c = x >= 0 && x < canvasWidthRef.current - offsetEr.current * 50 &&
                y >= 0 && y < canvasHeightRef.current - offsetEr.current * 50;
            if (c) {
                _$er.style.transform = ` translate(${x}px,${y}px)`;
            }
        };
        const erHandler = (event) => {
            if (clearErCtl.current) {
                event.preventDefault();
                const e = event.changedTouches[0];
                //  const e = event;
                erTranslate(e.pageX - offsetLeftRef.current - (offsetEr.current * 50) / 2, e.pageY - offsetTopRef.current - (offsetEr.current * 50) / 2, _$er);
            }
        };
        _$canvasWrap.addEventListener('touchmove', erHandler);
        return () => {
            _$canvasWrap.removeEventListener('touchmove', erHandler);
        };
    }, []);
    useEffect(() => {
        offsetLeftRef.current = offsetLeft;
        offsetTopRef.current = offsetTop;
        canvasWidthRef.current = canvasWidth;
        canvasHeightRef.current = canvasHeight;
        if (draw) {
            draw.render(offsetLeft, offsetTop, canvasWidth, canvasHeight);
        }
    }, [offsetLeft, offsetTop, canvasWidth, canvasHeight]);
    useEffect(() => {
        (async () => {
            if (draw) {
                draw.clear();
                if (drawImageSrc) {
                    const [id, imgSrc] = (drawImageSrc.split('::'));
                    if (imgSrc) {
                        try {
                            await drawImage(imgSrc);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        })();
    }, [draw, drawImageSrc]);
    return <div className={'m-canvasWrap'} id={`canvasWrap_${id}`} style={{ width: canvasWidth + 'px', height: canvasHeight + 'px', background }}>
        <div className={'drawTool'}>
            <div className={`Tool  ${clearing ? 'show' : 'hide'}`}>
                <div className={'icon'} onClick={() => {
                    setClear(!clearing);
                }}><ShakeOutlined /></div>
                <ul className={`lineWidth`} onClick={selectCLW}>
                    <li className={`w1 ${clearWidth === .2 ? 'active' : ''}`} data-value={.2} />
                    <li className={`w2 ${clearWidth === 1 ? 'active' : ''}`} data-value={1} />
                    <li className={`w3 ${clearWidth === 3 ? 'active' : ''}`} data-value={3} />
                </ul>
            </div>
            <div className={`Tool`}>
                <div className={'icon'} onClick={() => {
                    if (drClear) {
                        draw.clear();
                    } else {
                        Modal.confirm({
                            title: '你确定清除所有内容？',
                            onOk () {
                                draw.clear();
                            }
                        });
                    }
                }}><DeleteOutlined /></div>
            </div>
            {
                setFlag &&
                <div className={`Tool ${flagVisible ? 'show' : 'hide'}`}>
                    <div className={'icon'} onClick={() => {
                        setFlagVisible(!flagVisible);
                    }}><FlagOutlined /></div>
                    <ul className={`flags`}>
                        <li className={`f3`} style={{ backgroundColor: '#e8e8e8' }} onClick={() => selectFlag('0')}><StopOutlined /></li>
                        <li className={`f1`} style={{ backgroundColor: '#BA2401' }} onClick={() => selectFlag('#BA2401')} />
                        <li className={`f2`} style={{ backgroundColor: '#9400a8' }} onClick={() => selectFlag('#9400a8')} />
                        <li className={`f3`} style={{ backgroundColor: '#2b8500' }} onClick={() => selectFlag('#2b8500')} />
                    </ul>
                </div>
            }
        </div>
        <div className={'canvasContainer'} id={'canvasDiv'} style={{ width: canvasWidth + 'px', height: canvasHeight + 'px' }}>
            <figure className={'canvasQuestionImages'}>
                {questionImages.map((img, index) => {
                    return <img key={index} src={img} alt={index} />;
                })}
            </figure>
            <div className={'drawedImage'}>
                {
                    imageDrawed.map((img, index) => {
                        if (img) {
                            return <figure style={{ zIndex: 92 + index }} key={index}>
                                <img src={img} alt={index} />
                            </figure>;
                        } else {
                            return null;
                        }
                    })
                }
            </div>
            <canvas id={`canvasInc_${id}`}
                    className={'canvasIncStyle'}
                    style={{ width: canvasWidth + 'px', height: canvasHeight + 'px' }} />
        </div>
        <div className={`erase ${clearing ? 'show' : 'nor'}`} id={`ER_${id}`} />
    </div>;
}
