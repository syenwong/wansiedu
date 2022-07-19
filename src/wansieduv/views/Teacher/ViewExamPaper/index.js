/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/15.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Modal } from 'antd';
import { EDU_CONTEXT } from '../../../store';
import { ViewExamPaperInfo } from './components/ViewExamPaperInfo';
import { ViewExamPaperSubjects } from './components/ViewExamPaperSubjects';
import { useExamPaperAdmin } from '../../../Controller/useExamPaperAdmin';

export function ViewExamPaper () {
    const { state: { ViewExamPaperVisible } } = useContext(EDU_CONTEXT);
    const examPaperAdmin = useExamPaperAdmin();
    return <Modal maskClosable={false}
                  width={1346}
                  closable={true}
                  footer={null}
                  onCancel={async () => {
                      try {
                          await examPaperAdmin('resetEditExaPaper');
                          return true;
                      } catch (e) {
                          console.log(e);
                      }
                  }}
                  visible={ViewExamPaperVisible}>
        <div className={'g-viewExamPaperWrap'}>
            <ViewExamPaperInfo />
            <ViewExamPaperSubjects />
        </div>
    </Modal>;
}
