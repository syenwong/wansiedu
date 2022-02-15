import './Login.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { Button, Form, Input, Alert, Radio } from 'antd';
import { useHistory } from 'react-router-dom';
import { loginApi } from '../../service/api/login';
import { EDU_CONTEXT } from '../../store';

export function Login () {
    const history = useHistory();
    const [qrForm] = Form.useForm();
    const { state, dispatch } = useContext(EDU_CONTEXT);
    const [Error, setError] = useState('');
    const np = location.href.split('#')[1];
    const sp = window.localStorage.getItem('wse_path');
    if (state.account && state.token && sp && np !== sp && sp !== '/') {
        history.push(sp);
    }
    const LoginHandler = async () => {
        const { account, pwd } = await qrForm.validateFields();
        try {
            const { role, uid } = await loginApi(account, pwd);
            dispatch({
                uid,
                account,
                role
            });
            switch (role) {
                case 'admin':
                    history.push('/admin/student');
                    break;
                case 'student':
                    history.push('/student');
                    break;
                case 'teacher':
                    history.push('/teacher/homework');
                    break;
                default:
                    setError('未知身份信息');
                    break;
            }
        } catch (e) {
            // console.log(e);
            setError(e?.message);
        }
    };
    return (
        <div className={'g-indexwrap'}>
            <div className={'g-loginbg'} />
            <div className={'g-loginwrap'}>
                <h1>万思教育</h1>
                <div className={'g-login'}>
                    <Form name="qrForm" form={qrForm}
                          className={'g-qrForm'}
                          onFinish={LoginHandler}>
                        <Form.Item name="account" rules={[
                            {
                                required: true,
                                message: '用户名不能为空'
                            }
                        ]}>
                            <Input placeholder="用户名"
                                   autoComplete={'off'}
                                   onFocus={() => {
                                       setError('');
                                   }} />
                        </Form.Item>
                        <Form.Item name="pwd" rules={[
                            {
                                required: true,
                                message: '密码不能为空'
                            }
                        ]}>
                            <Input.Password placeholder="密码"
                                            onFocus={() => {
                                                setError('');
                                            }} />
                        </Form.Item>
                        <Button block className="queryBtn" type="primary" htmlType="submit">登 录</Button>
                    </Form>
                    {Error ? <Alert message={Error} type="error" showIcon /> : null}
                </div>
            </div>
        </div>
    );
}
