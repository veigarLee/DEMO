import React, { Component } from 'react'


import 'antd/dist/antd.css';
import './LoginAndRegister.css';
import { Form, Icon, Input, Button, Modal, Card, message } from 'antd';

import axios from 'axios'

class StringResource {
    static username = 'username';
    static password = 'password';
    static register_username = 'register_username';
    static register_password = 'register_password';
    static register_confirm_password = 'register_confirm_password';
}


class LoginAndRegisterBase extends Component {
    state = {
        visible: false,
        confirmLoading: false,
    };


    funcHandleSubmitLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields([StringResource.username, StringResource.password], async (err, values) => {
            if (!err) {
                let res = await axios.post('/login', {
                    username: values[StringResource.username],
                    password: values[StringResource.password],
                })
                if (res.data.status === 200) {
                    this.props.history.replace({
                        pathname: '/',
                        state: {
                            username: res.data.username,
                            token: res.data.token
                        }
                    }
                    );
                }
                else {
                    message.warning(res.data.message);
                }
                
            }
        });
    };

    funcHandleSubmitRegister = () => {
        this.props.form.validateFields([StringResource.register_username, StringResource.register_password, StringResource.register_confirm_password], async (err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true,
                });

                let res = await axios.post('/register', {
                    username: values[StringResource.register_username],
                    password: values[StringResource.register_password],
                })

                if (res.data.status === 200) {
                    message.success(res.data.message);
                }
                else {
                    message.warning(res.data.message);
                }
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });


            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue(StringResource.register_password)) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };



    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    funcShowRegisterModal = () => {
        this.setState({
            visible: true,
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading } = this.state;
        // const formItemLayout = {
        //     labelCol: {
        //       xs: { span: 24 },
        //       sm: { span: 8 },
        //     },
        //     wrapperCol: {
        //       xs: { span: 24 },
        //       sm: { span: 16 },
        //     },
        //   };
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16
            },
        };
        return (
            <div className = "Container">
                <Card className="ContainerCard" title="DEMO" extra={<a onClick={this.funcShowRegisterModal}>Account</a>}  >
                    <Form onSubmit={this.funcHandleSubmitLogin} className="login-form">
                        <Form.Item>
                            {getFieldDecorator(StringResource.username, {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator(StringResource.password, {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>


                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                        </Button>
                            Or <a onClick={this.funcShowRegisterModal}>register now!</a>
                        </Form.Item>
                    </Form>
                    <Modal
                        centered
                        title="Register"
                        visible={visible}
                        onOk={this.funcHandleSubmitRegister}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                        width="600px"
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} >
                            <Form.Item label="user name">
                                {getFieldDecorator(StringResource.register_username, {
                                    rules: [
                                        // {
                                        //     type: 'email',
                                        //     message: 'The input is not valid E-mail!',
                                        // },
                                        {
                                            required: true,
                                            message: 'Please input your user name!',
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label="Password" hasFeedback>
                                {getFieldDecorator(StringResource.register_password, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="Confirm Password" hasFeedback>
                                {getFieldDecorator(StringResource.register_confirm_password, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        {
                                            validator: this.compareToFirstPassword,
                                        },
                                    ],
                                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                            </Form.Item>
                        </Form>



                    </Modal>

                </Card>

            </div>
        );
    }




}
const LoginAndRegister = Form.create()(LoginAndRegisterBase);
export default LoginAndRegister;

