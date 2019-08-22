import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";
import AxiosFunction from './AxiosFunction'

const Fragment = React.Fragment;

export default class EditObjectManagement extends React.Component{

    constructor() {
        super();
        console.log('constructor')
        this.state = {
          record: []
        }
        this.getEditObjectRecord = this.getEditObjectRecord.bind(this)
    }
    getEditObjectRecord(){
        AxiosFunction.getEditObjectRecord(null, (err, res) => {
            console.log(err)
            console.log(res)
            this.setState({
                record: res
            })
        })
    }
    componentDidMount(){
        this.getEditObjectRecord()
    }

    itemLayout(record, index){
        return(
            <h3 name={record.id}>
                User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
            </h3>
        ) 
    }
    
    render(){
        // User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
        console.log('renderrrrrrr')
        return (
            <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
                {this.state.record.map((record, index)=>{
                    console.log(record.edit_user_id)
                    return (
                        <ListGroup.Item key={index} onClick={this.onClickFile} name={record.id} style={{cursor: 'grab'}}>
                            {this.itemLayout(record, index)}
                        </ListGroup.Item>
                    )   
                })}
            </ListGroup>
        )
    }
}
EditObjectManagement.contextType = LocaleContext;