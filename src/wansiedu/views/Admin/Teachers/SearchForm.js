/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/20.
 * Copyright 2021/9/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/20
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { getStartTimer } from '../../../service/utils';

const { Item, useForm } = Form;
export function SearchForm (props) {
    const [sFrom] = useForm();
    const onSearch = (values) => {
        const { subject, key } = values;
        const searchKeys = {};
        if (subject) {
            searchKeys.subject = subject;
        }
        if (key) {
            searchKeys.key = key;
        }
        props.search(searchKeys);
    };
    const onReset = () => {
        props.search({
            key: '',
            subject: ''
        });
    };
    return <div className={'g-searchForm'}>
        <Form name={'search'} form={sFrom}
              onFinish={onSearch}>
            <Item name={'subject'}>
                <Input placeholder="请输入学科" style={{ width: 200 }} />
            </Item>
            <Item name={'key'}>
                <Input placeholder="请输入姓名、用户名" style={{ width: 200 }} />
            </Item>
            <Item>
                <Button type="primary" htmlType="submit">
                    搜索
                </Button>
                <Button htmlType="reset" onClick={onReset}>
                    清空重置
                </Button>
            </Item>
        </Form></div>;
}
