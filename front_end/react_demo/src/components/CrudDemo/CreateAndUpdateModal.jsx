import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Modal, Button, Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import SR from './StringResource.js';

export default class CreateAndUpdateModal extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
    }

    state = {
        loading: false,
        visible: false,
    };

    constructor(props) {
        super(props)

        this.state[SR.name] = { value: '' };
        this.state[SR.address] = { value: '' };
        this.state[SR.age] = { value: 0 };
    }




    funcShowCreateModal = async (funcOkCallback) => {
        this.strFooterText = this.strCteateFooterText;
        this.handleOk = this.funcCreate;
        this.funcCallback = funcOkCallback;

        await this.setState({
            visible: true,
        });
    }

    funcShowUpdateModal = async(id,name,age,address,funcOkCallback) => {
        this.strFooterText = this.strUpdateFooterText;
        this.handleOk = this.funcUpdate;
        this.funcCallback = funcOkCallback;
        
        let objState = {};
        objState[SR.id] = { value: id }; 
        objState[SR.name] = { value: name };
        objState[SR.age] = { value: age };
        objState[SR.address] = { value: address };
        await this.setState(objState);
        
        

        this.setState({
            visible: true,
        });
    }

    strFooterText = null;
    strCteateFooterText = "Create";
    strUpdateFooterText = "Update";

    funcCallback = null;
    handleOk = null;

    funcCreate = async () => {
        let objData = {};
        objData[SR.name] = this.state[SR.name].value ;
        objData[SR.address] = this.state[SR.address].value ;
        objData[SR.age] = this.state[SR.age].value ;
        
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'post', 
            params: {
                token:this.props.token,
              },
            data: objData ,
        })
        
        if(respond.data.success){
            this.funcCallback();
        }
        
        this.setState({
            visible: false,
        });
        
    }

    funcUpdate = async () => {
        let objData = {};
        objData[SR.id] = this.state[SR.id].value ;
        objData[SR.name] = this.state[SR.name].value ;
        objData[SR.address] = this.state[SR.address].value ;
        objData[SR.age] = this.state[SR.age].value ;
        
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'put', 
            params: {
                token:this.props.token,
              },
            data: objData ,
        })
        
        if(respond.data.success){
            this.funcCallback();
        }
        
        this.setState({
            visible: false,
        });
    }




    handleCancel = () => {
        this.setState({ visible: false });
    };

    funcValidateAge = (age) => {
        if (age <= 0 || age >= 100) {
            return {
                validateStatus: 'error',
                errorMsg: 'The age between 0 and 100 ',
            };
        }
        else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }

    }

    handleAgeChange = value => {
        this.state[SR.age] = {
            ...this.funcValidateAge(value),
            value,
        }

        this.setState(this.state[SR.age]);
        
    };
    
    funcValidateEmpty = (value) => {
        if (value === '') {
            return {
                validateStatus: 'error',
                errorMsg: 'please input ! ',
            };
        }
        else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }

    }

    handleInputOnChange = (e) => {
        let strName = e.target.id;
        this.state[strName] = {
             ...this.funcValidateEmpty(e.target.value),
            value:e.target.value,
        }

        this.setState(this.state[strName]);
    }

    render() {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
        };

        const { visible, loading } = this.state;


        return (
            <div>
                <Modal
                    visible={visible}
                    title="Title"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<Button key="back" onClick={this.handleCancel}>Cancel</Button>, <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>{this.strFooterText}</Button>,]}
                >

                    <Form  {...formItemLayout}  >
                        <Form.Item
                            label={SR.name}
                            validateStatus={this.state[SR.name].validateStatus}
                            help={this.state[SR.name].errorMsg}
                        >
                            <Input id={SR.name} value={this.state[SR.name].value} onChange={this.handleInputOnChange} />
                        </Form.Item>
                        <Form.Item
                            label={SR.age}
                            validateStatus={this.state[SR.age].validateStatus}
                            help={this.state[SR.age].errorMsg}
                        >
                            <InputNumber min={0} max={100} value={this.state[SR.age].value} onChange={this.handleAgeChange} style={{width:"100%"}} />
                        </Form.Item>
                        <Form.Item
                            label={SR.address}
                            validateStatus={this.state[SR.address].validateStatus}
                            help={this.state[SR.address].errorMsg}
                        >
                            <Input id={SR.address} value={this.state[SR.address].value} onChange={this.handleInputOnChange} />
                        </Form.Item>


                    </Form>

                </Modal>
            </div>
        );
    }

}
