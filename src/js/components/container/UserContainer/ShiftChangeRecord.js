import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'

import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

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
        setTimeout(this.getPDFInfo, 100)
        // this.getPDFInfo()
        // this.props.getAPI(this.API)
    }
    getPDFInfo(){
        axios.get(dataSrc.PDFInfo).then((res) => {
            this.API.setShiftChangeRecord(res.data.rows)
            console.log(res.data.rows)
        })
    }
    onClickFile(e){
        var file_path = e.target.getAttribute('name')
        var path = dataSrc.IP + '/' + file_path
        console.log(path)
        window.open(path);
    }
    itemLayout(item, index, name){
        return <h3 name={name}>{index} . {item.user_id}, Checked at {moment(item.submit_timestamp).format('LLLL')}</h3> 
    }
    render(){
        
        var locale = this.context
        return (
            <ListGroup className="w-100 border-0" style={{overflowY:'scroll', height: '70vh'}}>
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