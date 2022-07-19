import './index.less';
import React, { useContext, useState } from 'react';
import { LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Tooltip, Form, Input, Modal } from 'antd';
import { changePwdApi } from '../../service/api/login';
import { EDU_CONTEXT } from '../../store';
import { RoleMaps } from '../../service/STATIC_DATA';

const { Item, useForm } = Form;
const { Password } = Input;
export function GlobalTop (props) {
    const [changePwdForm] = useForm();
    const { state } = useContext(EDU_CONTEXT);
    const [isModalVisible, setIsModalVisible] = useState(false);
    function logout () {
        window.localStorage.clear();
        location.replace(location.origin + '/opt/file/');
    }
    async function changePwd () {
        try {
            const { oldPwd, newPwd } = await changePwdForm.validateFields();
            await changePwdApi(oldPwd, newPwd);
            setIsModalVisible(false);
            Modal.success({
                title: '修改密码成功'
            });
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
    }
    return <>
        <div className={'g-top'}>
            <div className={'title'}>
                <div className={'account'}>万思教育</div>
                <div className={'content'}> {RoleMaps[state?.role ?? 'UNKNOW'] || '未知身份'} [ {state?.account}]</div>
            </div>
            <div className={'nav'}>
                {props.nav}
            </div>
            <div className={'rightBtn'}>
                <Tooltip placement="bottom" title={'修改密码'}><KeyOutlined onClick={() => setIsModalVisible(true)} /></Tooltip>
                <Tooltip placement="bottom" title={'退出登录'}><LogoutOutlined onClick={logout} /></Tooltip>
            </div>
        </div>
        <Modal getContainer={false}
               maskClosable={false}
               title={'修改密码'}
               width={420}
               visible={isModalVisible}
               onOk={changePwd}
               onCancel={() => setIsModalVisible(false)}
               okText={'确认修改'}
               cancelText={'取消'}>
            <Form name={'changePwd'} form={changePwdForm}
                  labelCol={{
                      xs: { span: 24 },
                      sm: { span: 6 }
                  }}
                  wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 }
                  }}>
                <Item name={'oldPwd'} label={'旧密码'} rules={[
                    {
                        required: true,
                        message: '请输入旧密码!'
                    }]}>
                    <Password placeholder={'请输入新密码'} />
                </Item>
                <Item name={'newPwd'} label={'新密码'} rules={[
                    {
                        required: true,
                        message: '请输入新密码!'
                    }]}>
                    <Password placeholder={'请输入新密码'} />
                </Item>
                <Item dependencies={['newPwd']} name={'checkNewPwd'} label={'确认新密码'}
                      rules={[
                          {
                              required: true,
                              message: '清确认密码!'
                          },
                          ({ getFieldValue }) => ({
                              validator (_, value) {
                                  if (!value || getFieldValue('newPwd') === value) {
                                      return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('两次密码输入要一致!'));
                              }
                          })
                      ]}>
                    <Password placeholder={'确认新密码'} />
                </Item>
            </Form>
        </Modal>
    </>;
}

