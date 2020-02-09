import React, { Component } from 'react'

import { Card, Table, Popconfirm ,Button} from 'antd'
import CreateAndUpdateModal from './CreateAndUpdateModal'

import axios from 'axios';
import SR from './StringResource.js';

export default class CrudDemo extends Component {
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
                    // this.state.dataSource.length >= 1 ? (
                    //     <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                    //         <a>Delete</a>
                    //     </Popconfirm>
                    // ) : null,
            },
        ];
        
        this.state = { dataSource: []};

        // this.state = {
        //     dataSource: [
        //         {
        //             key: '0',
        //             name: 'Edward King 0',
        //             age: '32',
        //             address: 'London, Park Lane no. 0',
        //         },
        //         {
        //             key: '1',
        //             name: 'Edward King 1',
        //             age: '32',
        //             address: 'London, Park Lane no. 1',
        //         },
        //     ],
        //     count: 2,
        // };
        
        this.funcLoadTable();
        
        this.refCreateAndUpdateModal = React.createRef();
        
        
        
    }

    // handleDelete = id => {
    //     const dataSource = [...this.state.dataSource];
    //     this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
    // };

    // handleAdd = () => {
    //     const { count, dataSource } = this.state;
    //     const newData = {
    //         key: count,
    //         name: `Edward King ${count}`,
    //         age: 32,
    //         address: `London, Park Lane no. ${count}`,
    //     };
    //     this.setState({
    //         dataSource: [...dataSource, newData],
    //         count: count + 1,
    //     });
    // };
    
    funcLoadTable = async() =>{
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'get', 
            params: {
                username: 'todo',
                token:'todo',
              },
        })
        
        if(respond.data.success){
            this.setState({dataSource :respond.data.data });
        }
        
    }
    
    funcUpdateTable = (record) =>{
        this.refCreateAndUpdateModal.current.funcShowUpdateModal(record.id,record.name,record.age,record.address,this.funcLoadTable);
    }
    
    

    // handleSave = row => {
    //     const newData = [...this.state.dataSource];
    //     const index = newData.findIndex(item => row.key === item.key);
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //         ...item,
    //         ...row,
    //     });
    //     this.setState({ dataSource: newData });
    // };
    
    
    
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
                username: 'todo',
                token: 'todo',
            },
            data: objData,
        })
        
        if(respond.data.success){
            this.funcLoadTable();
        }
    }

    render() {
        const { dataSource } = this.state;
        // const components = {
        //   body: {
        //     row: EditableFormRow,
        //     cell: EditableCell,
        //   },
        // };
        // const columns = this.columns.map(col => {
        //     if (!col.editable) {
        //         return col;
        //     }
        //     return {
        //         ...col,
        //         onCell: record => ({
        //             record,
        //             editable: col.editable,
        //             dataIndex: col.dataIndex,
        //             title: col.title,
        //             handleSave: this.handleSave,
        //         }),
        //     };
        // });
        const columns = this.columns;
        return (
            // <Card type="inner" title="Crud Demo" extra={<Button onClick={this.handleAdd} type="primary" >Create</Button>}>
            <Card type="inner" title="Crud Demo" extra={<Button onClick={this.funcShowCreateModal} type="primary" >Create</Button>}>
    
                <Table
                    //   components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
                <CreateAndUpdateModal ref = { this.refCreateAndUpdateModal }></CreateAndUpdateModal>
            </Card>
        );

    }



}



