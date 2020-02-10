import React, { Component } from 'react'

import { Card, Table, Popconfirm ,Button} from 'antd'
import CreateAndUpdateModal from './CreateAndUpdateModal'

import axios from 'axios';
import SR from './StringResource.js';
import PropTypes from 'prop-types'

export default class CrudDemo extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
    }
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'name',
                dataIndex: 'name',
                width: '30%',
                editable: true,
            },
            {
                title: 'age',
                dataIndex: 'age',
            },
            {
                title: 'address',
                dataIndex: 'address',
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    (
                        <div>
                            <a style={{marginRight:"10px"}} onClick={()=>this.funcUpdateTable(record)}>Update</a>   
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.funcDelete(record.id)}>
                                <a>Delete</a>
                            </Popconfirm>
                        </div>
                    )
            },
        ];
        
        this.state = { dataSource: []};
        this.funcLoadTable();
        this.refCreateAndUpdateModal = React.createRef();
        
    }


    
    funcLoadTable = async() =>{
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'get', 
            params: {
                token:this.props.token,
              },
        })
        
        if(respond.data.success){
            this.setState({dataSource :respond.data.data });
        }
        
    }
    
    funcUpdateTable = (record) =>{
        this.refCreateAndUpdateModal.current.funcShowUpdateModal(record.id,record.name,record.age,record.address,this.funcLoadTable);
    }
    
    
    
    funcShowCreateModal = () => {
        this.refCreateAndUpdateModal.current.funcShowCreateModal(this.funcLoadTable);
    }
    
    funcDelete = async (id)=>{
        let objData = {};
        objData[SR.id] = id;
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'delete',
            params: {
                token: this.props.token,
            },
            data: objData,
        })
        
        if(respond.data.success){
            this.funcLoadTable();
        }
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <Card type="inner" title="Crud Demo" extra={<Button onClick={this.funcShowCreateModal} type="primary" >Create</Button>}>
    
                <Table
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
                <CreateAndUpdateModal ref = { this.refCreateAndUpdateModal } token = {this.props.token}></CreateAndUpdateModal>
            </Card>
        );

    }



}



