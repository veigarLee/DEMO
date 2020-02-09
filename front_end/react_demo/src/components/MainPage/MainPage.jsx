import React, { Component } from 'react'



import 'antd/dist/antd.css';
import './MainPage.css';
import { Layout, Menu, Icon } from 'antd';
import { Redirect, Switch, Route ,Link } from 'react-router-dom'

import CrudDemo from '../CrudDemo/CrudDemo'

const { Header, Sider, Content } = Layout;

export default class MainPage extends Component {

    constructor(props) {
        super(props);
        if (this.props.history.location.state) {
            this.state.username = this.props.history.location.state.username;
            this.state.token = this.props.history.location.state.token;
        }

    }

    state = {
        collapsed: false,

        username: '',
        token: '',
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };



    render() {
        const { username, token } = this.state;
        if (username === '' || token === '') {
            // return (<Redirect to="/login"></Redirect>)
        }
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to="/CrudDemo">
                                <Icon type="user" />
                                <span>Crud Demo</span>
                            </Link> 
                        </Menu.Item>


                        <Menu.Item key="2">
                            <Link to="/ChartDemo">
                                <Icon type="video-camera" />
                                <span>Chart Demo</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span>nav 3</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        {/* Content sss {this.state.token} */}
                        <Switch>
                            <Route path="/CrudDemo" component={CrudDemo}></Route>
                            <Redirect to="/CrudDemo" ></Redirect>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
