import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import ReactTable from 'react-table'

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
    onClickFile(file_path){
        // var file_path = e.target.getAttribute('name')
        var path = dataSrc.IP + '/' + file_path
        window.open(path);
    }
    itemLayout(item, index, name){
        return <h5 name={name}>{index + 1} . {item.user_id}, Checked at {moment(item.submit_timestamp).format('LLLL')}</h5> 
    }
    // {
    //         <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
    //             {this.state.record.map((record, index)=>{
    //                 return (
    //                     <ListGroup.Item key={record.id} onClick={this.onClickFile} name={record.file_path} style={{cursor: 'grab'}}>
    //                         {this.itemLayout(record, index, record.file_path)}
    //                     </ListGroup.Item>
    //                 )   
    //             })}
    //         </ListGroup>
    //     }
    render(){      
        var locale = this.context
        var {record} = this.state
        const column = [
            {
                Header: 'No.',
                Cell: ({row}) => {
                    return <div className="d-flex justify-content-center w-100 h-100">{row._index}</div>
                },
            },
            {
                Header: 'User ID',
                Cell: ({row}) => {
                    console.log(row._original)
                    return <div className="d-flex justify-content-center w-100 h-100">{row._original.user_id}</div>
                }
            },
            {
                Header: 'Shift Type',
                Cell: ({row}) => {
                    console.log(row._original)
                    return <div className="d-flex justify-content-center w-100 h-100">{row._original.shift}</div>
                }
            },
            {
                Header: 'Submit Time',
                Cell: ({row}) => {
                    return <div className="d-flex justify-content-center w-100 h-100">{moment(row._original.submit_timestamp).format('LLLL')}</div>
                },
                minWidth: 300, 
                maxWidth: 300, 
            },
        ]
        const onRowClick = (state, rowInfo, column, instance) => {
            return {
                onClick: e => {
                    this.onClickFile(rowInfo.original.file_path)
                }
            }
        }
        return (

            <ReactTable 
                data = {record} 
                columns = {column} 
                noDataText="No Data Available"
                className="-highlight w-100"
                style={{height:'75vh'}}
                getTrProps={onRowClick}
            />
        )

    }
}
ShiftChangeRecord.contextType = LocaleContext;