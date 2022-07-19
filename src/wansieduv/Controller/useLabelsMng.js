/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/9/21.
 * Copyright 2021/9/21 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/9/21
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { EDU_CONTEXT } from '../store';
import { addLabelApi, deleteLabelsApi, getListLabelsApi } from '../service/api/teacher/labels';
import { Modal } from 'antd';

export function useLabelsMng () {
    const { dispatch } = useContext(EDU_CONTEXT);
    const handlers = {
        async getLabels () {
            try {
                const { exam, student } = await getListLabelsApi();
                dispatch({
                    labels: {
                        exam: exam || [],
                        student: student || []
                    }
                });
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        async addLabel (label, type) {
            const that = this;
            try {
                await addLabelApi(label, type);
                await that.getLabels();
                return label;
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        },
        async deleteLabels (id) {
            const that = this;
            try {
                await deleteLabelsApi(id);
                await that.getLabels();
            } catch (e) {
                Modal.error({
                    title: e.message
                });
            }
        }
    };
    return async (type, ...data) => {
        await handlers[type](...data);
    };
}
