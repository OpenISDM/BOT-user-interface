import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment'

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
                console.log(Arr)
                this.setState({
                    record: Arr
                })
            },

        }
    }

    componentDidMount(){
        this.getPDFInfo()
        this.props.getAPI(this.API)
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
        

        return (
            <ListGroup className="w-100 border-0">
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