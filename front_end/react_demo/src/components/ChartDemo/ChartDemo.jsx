import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts';
import { Card, Button } from 'antd'
import axios from 'axios';

export default class ChartDemo extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            data: [],
        }
        this.funcRefresh();

    }


    funcRefresh = async () => {
        let respond = await axios.request({
            url: '/api/vi/customer',
            method: 'get',
            params: {
                token: this.props.token,
            },
        })

        // this.setState({ data: respond.data.data });
        
        let data = respond.data.data.map((item)=>{
            return {
                name :item.name+'-'+item.address,
                age:item.age,
            }
        });
        this.setState({data});
    }

    render() {


        const scale = {
            age: { alias: 'Age', },
            name: { alias: 'Name', },
        };
        return (
            <Card type="inner" title="Crud Demo" extra={<Button onClick={this.funcRefresh} type="primary" >Refresh</Button>}>
                <Chart height={500} data={this.state.data} scale={scale} forceFit>
                    <Axis title name="name" />
                    <Axis title name="age" />
                    <Legend />
                    <Tooltip crosshairs={{ type: 'rect' }} />
                    <Geom type="interval" position="name*age" color="name" />
                </Chart>
            </Card>
        )
    }
}

