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
import { GRADE_MAP, GRADE_ORDER } from '../service/STATIC_DATA';
import { getStartTimer } from '../service/utils';

const { Option } = Select;
const { Item, useForm } = Form;
export function StudentsSearchForm (props) {
    const [sFrom] = useForm();
    const onSearch = (values) => {
        const { grade, key } = values;
        const searchKeys = {};
        if (grade) {
            searchKeys.startTime = getStartTimer(grade);
        }
        if (key) {
            searchKeys.key = key;
        }
        props.search(searchKeys);
    };
    const onReset = () => {
        props.search({
            key: '',
            startTime: ''
        });
    };
    return <div className={'g-searchForm'}>
        <Form name={'search'} form={sFrom}
              onFinish={onSearch}>
            <Item name={'grade'}>
                <Select style={{ width: 120 }} placeholder={'请选择年级'}>
                    <Option value=''>全部</Option>
                    {GRADE_ORDER.map(g => {
                        return <Option key={g} value={g}>{GRADE_MAP[g]}</Option>;
                    })}
                </Select>
            </Item>
            <Item name={'key'}>
                <Input placeholder="请输入姓名、用户名,分类标签，不支持空格" style={{ width: 300 }} />
            </Item>
            <Item>
                <Button type="primary" htmlType="submit">
                    搜索
                </Button>
                <Button htmlType="reset" onClick={onReset}>
                    清空重置
                </Button>
            </Item>
        </Form>
        <div>
            {props.rightBtn}
        </div>
    </div>;
}
