/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/23.
 * Copyright 2021/9/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/23
 * @version */
import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Form, Input, Row, DatePicker, InputNumber } from 'antd';
import { EDU_CONTEXT } from '../../../../store';
import moment from 'moment';

const { useForm, Item } = Form;
const { RangePicker } = DatePicker;
export function HomeWorkInfo () {
    const [whInfoForm] = useForm();
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const setRangDate = (n) => {
        const h = 60 * 60 * 1000;
        const now = new Date();
        const endTime = new Date(now.getTime() + n * h);
        whInfoForm.setFieldsValue({
            rangeDate: [moment(now), moment(endTime)]
        });
    };
    const setHomeWorkInfo = (values) => {
        if (values) {
            let _editHomeworkData = {};
            if (values.rangeDate) {
                const [startTimeMonent, endTimeMonent] = values.rangeDate;
                _editHomeworkData.startTime = new Date(startTimeMonent.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime();
                _editHomeworkData.endTime = new Date(endTimeMonent.format('YYYY/MM/DD HH:mm:ss.SSS')).getTime();
            }
            if (values.name) {
                _editHomeworkData.name = values.name;
            }
            if (values.limitTime) {
                _editHomeworkData.limitTime = values.limitTime * 60;
            }
            dispatch({
                editHomeworkData: Object.assign({}, state.editHomeworkData, _editHomeworkData)
            });
        }
    };
    useEffect(() => {
        const { name, limitTime } = state.editHomeworkData;
        let rangeDate = [moment(new Date().getTime()), moment(new Date('2099/12/30').getTime())];
        if (state.editHomeworkData.startTime && state.editHomeworkData.endTime) {
            rangeDate = [moment(state.editHomeworkData.startTime ? new Date(state.editHomeworkData.startTime) : new Date()),
                moment(state.editHomeworkData.endTime ? new Date(state.editHomeworkData.endTime) : new Date())];
        }
        whInfoForm.setFieldsValue({ name, rangeDate, limitTime: limitTime / 60 });
        return () => {
            setHomeWorkInfo();
        };
    }, []);
    return <div className={'g-homeworkinfo'}>
        <Form name={'whInfoForm'} form={whInfoForm}
              className={'whInfoForm'}
              onValuesChange={setHomeWorkInfo}
              labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Item label={'????????????'} name={'name'}>
                <Input type="text" placeholder={['????????????????????????']} />
            </Item>
            <Item label={'????????????????????????'} name={'limitTime'}>
                <InputNumber style={{ width: '120px' }} min={1} max={1800000} step={10} placeholder={'??????????????????'} />
            </Item>
            <Item label={'?????????'} name={'rangeDate'}>
                <RangePicker placeholder={['??????????????????', '??????????????????']} showTime format="YYYY/MM/DD HH:mm:ss" />
            </Item>
            <div className={'g-tableAction'} style={{ marginLeft: '160px' }}>
                <Button onClick={() => setRangDate(1)}>?????????</Button>
                <Button onClick={() => setRangDate(24)}>??????</Button>
                <Button onClick={() => setRangDate(168)}>??????</Button>
            </div>
        </Form>
    </div>;
}
