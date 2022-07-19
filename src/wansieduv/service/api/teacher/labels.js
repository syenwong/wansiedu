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
import Ax from '../Ax.js';

export async function addLabelApi (name, type) {
    try {
        return await Ax.post(`/teacher/addLabels`, { name, type });
    } catch (e) {
        throw e;
    }
}
export async function getListLabelsApi () {
    try {
        return await Ax.get(`/teacher/listLabels`);
    } catch (e) {
        throw e;
    }
}
export async function deleteLabelsApi (lid) {
    try {
        return await Ax.post(`/teacher/delLabels`, { lid });
    } catch (e) {
        throw e;
    }
}
export async function editLabelApi (lid, name) {
    try {
        return await Ax.post(`/teacher/updateLabels`, { lid, name });
    } catch (e) {
        throw e;
    }
}
