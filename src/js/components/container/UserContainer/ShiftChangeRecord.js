import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'

import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";
import AxiosFunction from './AxiosFunction';

const Fragment = React.Fragment;

export default class ShiftChangeRecord extends React.Component{

    constructor() {
        super();
        this.state = {
            record: []
        }
        this.API = {
            setShiftChangeRecord: (Arr) => {
                this.setState({
                    record: Arr
                })
            },
        }
        this.getPDFInfo = this.getPDFInfo.bind(this)
    }

    componentDidMount(){
        this.getPDFInfo()
    }
    getPDFInfo(){
        AxiosFunction.getShiftChangeRecord({},(err, res) => {
            if(err){
                console.error(err)
            }else{
                this.API.setShiftChangeRecord(res.rows)
            }
        })
    }
    onClickFile(e){
        var file_path = e.target.getAttribute('name')
        var path = dataSrc.IP + '/' + file_path
        window.open(path);
    }
    itemLayout(item, index, name){
        return <h3 name={name}>{index + 1} . {item.user_id}, Checked at {moment(item.submit_timestamp).format('LLLL')}</h3> 
    }
    render(){      
        var locale = this.context
        return (
            <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
                {this.state.record.map((record, index)=>{
                    return (
                        <ListGroup.Item key={record.id} onClick={this.onClickFile} name={record.file_path} style={{cursor: 'grab'}}>
                            {this.itemLayout(record, index, record.file_path)}
                        </ListGroup.Item>
                    )   
                })}
            </ListGroup>
        )
    }
}
ShiftChangeRecord.contextType = LocaleContext;