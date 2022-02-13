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
import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Tooltip, Button } from 'antd';
import { CheckOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

export function SubjectLabels ({ value = [], onChange }) {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const [loading, setloading] = useState(false);
    const saveInputRef = useRef();
    const saveEditInputRef = useRef();
    const setTags = async (v) => {
        await onChange?.(v);
    };
    const handleClose = async removedTag => {
        const newTags = value.filter(tag => tag !== removedTag);
        await setTags(newTags);
    };
    const showInput = () => {
        if (!loading) {
            setInputVisible(true);
        }
    };
    const handleInputChange = e => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = async () => {
        if (inputValue && value.indexOf(inputValue) < 0) {
            setloading(true);
            setInputVisible(false);
            let newTags = [...value, inputValue];
            await setTags(newTags);
            setInputValue('');
            setloading(false);
        } else {
            setInputVisible(false);
        }
    };
    const handleEditInputChange = e => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = async () => {
        const newTags = [...value];
        newTags[editInputIndex] = editInputValue;
        await setTags(newTags);
        setEditInputIndex(-1);
        setEditInputValue('');
    };
    useEffect(() => {
        if (editInputIndex >= 0) {
            saveEditInputRef.current.focus();
        }
    }, [editInputIndex]);
    useEffect(() => {
        if (inputVisible) {
            saveInputRef.current.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        if (editInputIndex >= 0) {
            saveEditInputRef.current.focus();
        }
    }, [editInputIndex]);
    return <div className={'editLabels'}>
        {value.map((tag, index) => {
            if (editInputIndex === index) {
                return (
                    <Input ref={saveEditInputRef}
                           key={tag}
                           size="small"
                           className="tag-input"
                           value={editInputValue}
                           onChange={handleEditInputChange}
                           onBlur={handleEditInputConfirm}
                           onPressEnter={handleEditInputConfirm}
                    />
                );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
                <Tag
                    className="edit-tag"
                    key={tag}
                    closable={true}
                    onClose={() => handleClose(tag)}
                >
                    <span onDoubleClick={e => {
                        e.preventDefault();
                        setEditInputValue(tag);
                        setEditInputIndex(index);
                    }}
                    >
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </span>
                </Tag>
            );
            return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                    {tagElem}
                </Tooltip>
            ) : (
                tagElem
            );
        })}
        {inputVisible && (
            <>
                <Input ref={saveInputRef}
                       type="text"
                       size="small"
                       className="tag-input"
                       value={inputValue}
                       onChange={handleInputChange}
                       onBlur={handleInputConfirm}
                       onPressEnter={handleInputConfirm} />
                <Button className={'confirmScore'} size={'small'} type={'primary'} icon={<CheckOutlined />} onClick={handleInputConfirm} />
            </>
        )}
        {!inputVisible && <Tag className="site-tag-plus" onClick={showInput}>
            {
                loading ? <LoadingOutlined /> : <PlusOutlined />
            }
        </Tag>}
    </div>;
}
