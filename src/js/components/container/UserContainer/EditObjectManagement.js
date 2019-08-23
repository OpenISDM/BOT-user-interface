import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';
import ReactTable from 'react-table'
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
        this.state = {
          record: []
        }
        this.getEditObjectRecord = this.getEditObjectRecord.bind(this)
    }
    getEditObjectRecord(){
        AxiosFunction.getEditObjectRecord(null, (err, res) => {
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
            <h5 name={record.id}>
                User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
            </h5>
        ) 
    }
    // <ListGroup className="w-100 shadow" style={{overflowY:'scroll', height: '75vh'}}>
    //     {this.state.record.map((record, index)=>{
    //         return (
    //             <ListGroup.Item key={index} onClick={this.onClickFile} name={record.id} style={{cursor: 'grab'}}>
    //                 {this.itemLayout(record, index)}
    //             </ListGroup.Item>
    //         )   
    //     })}
    // </ListGroup>
    render(){
        // User {record.edit_user_id}, Edit at {moment(record.edit_time).format('LLLL')}
        // console.log('renderrrrrrr')
        // console.log(this.state.record)
        const {record} = this.state
        const column = [
            {
                Header: 'No.',
                Cell: ({row}) => {
                    return <div className="d-flex justify-content-center w-100 h-100">{row._index}</div>
                },
            },
            {
                Header: 'User',
                Cell: ({row}) => {
                    return <div className="d-flex justify-content-center w-100 h-100">{row._original.edit_user_id}</div>
                }
            },
            {
                Header: 'Edit Time',
                Cell: ({row}) => {
                    return <div className="d-flex justify-content-center w-100 h-100">{moment(row._original.edit_time).format('LLLL')}</div>
                }
            },
        ]
        const onRowClick = (state, rowInfo, column, instance) => {
            return {
                onClick: e => {
                    this.onClickFile(e)
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
EditObjectManagement.contextType = LocaleContext;