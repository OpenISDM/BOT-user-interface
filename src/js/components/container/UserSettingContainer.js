import React from 'react';

/** Import Presentational Component */
import AddableList from '../presentational/AddableList'

import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../js/dataSrc";

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'
import axios from 'axios';
import Cookies from 'js-cookie'
const Fragment = React.Fragment;
export default class UserSettingContainer extends React.Component{

    constructor() {
        super();
        this.state = {
            myDevices: []
        }
        this.getMyDevices = this.getMyDevices.bind(this)
        this.getAPIfromAddableList = this.getAPIfromAddableList.bind(this)
        this.getMyDevicesUpdate = this.getMyDevicesUpdate.bind(this)

        this.APIforAddableList = null
        
    }
    getAPIfromAddableList(API){
        this.APIforAddableList = API
        this.APIforAddableList.setTitle("My Devices List")
        this.APIforAddableList.whenUpdate(this.getMyDevicesUpdate)
        this.APIforAddableList.setValidation(
            (string) => {
                var re = /^\s*(?<acn>\d{4}-\d{4}-\d{4})\s*$/
                var match = string.match(re)
                if(match){
                    return match.groups['acn']
                }else{
                    return null
                }
            })
            
        
    }

    componentDidMount(){
        this.getMyDevices()
    }

    getMyDevices(){
        axios.post(dataSrc.userInfo, {
            username: Cookies.get('user')
        }).then((res) => {

            var myDevices = res.data.rows[0].mydevice
            this.APIforAddableList.setList(myDevices)
            this.setState({
                myDevices: myDevices
            })

        }).catch()
    }
    getMyDevicesUpdate(mode, acn){
        console.log('uppppppppppp')
        this.setMyDevices(mode, acn)
    }
    setMyDevices(mode, acn){
        axios.post(dataSrc.modifyMyDevice, {
            username: Cookies.get('user'),
            mode: mode,
            acn: acn
        }).then((res) => {
            console.log('success')
        })

    }

    sideNavMouseOver(e){
        e.target.style.fontSize = "1.8rem"
    }
    sideNavMouseLeave(e){
        e.target.style.fontSize = "1.5rem"
    }
    render(){
        

        return (
            <div className = "d-flex justify-content-center" >
                <Row className = "w-100 h-100">
                    <Col xl={3} className="m-0">
                        <ListGroup variant="flush" className="my-4 border-0">
                            <ListGroup.Item className="border-0 my-2 h3">User</ListGroup.Item>
                            <ListGroup.Item className="border-0 my-2" href="#DevicesManagement"
                                style={{fontSize: '1.8rem'}}
                                onMouseOver={this.sideNavMouseOver}
                                onMouseLeave={this.sideNavMouseLeave}
                                action>
                                Devices Management
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 my-2" href="#ShiftRecordHistory"
                                style={{fontSize: '1.8rem'}}
                                onMouseOver={this.sideNavMouseOver}
                                onMouseLeave={this.sideNavMouseLeave}
                                action>
                                Shift Record History
                            </ListGroup.Item>
                            
                        </ListGroup>
                    </Col>
                    <Col xl={9} className="m-0" style={{overflow: 'scroll', height: '93vh'}}>
                        <div id="DevicesManagement" className="p-3" style={{height: '93vh'}}>   
                            <Row className="w-100 m-3" style={{height: '6vh'}}>                         
                                <h2 >
                                    Devices Management
                                </h2>
                            </Row>
                            <Row className="w-100 m-3 d-flex" style={{height: '80vh'}}>
                                
                                <Col xl={5} className="my-3">
                                    <AddableList 
                                        getAPI = {this.getAPIfromAddableList}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div id="ShiftRecordHistory" className="p-3" style={{height: '93vh'}}>   
                            <Row className="w-100 m-3" style={{height: '6vh'}}>                         
                                <h2 >
                                    Shift Record History
                                </h2>
                            </Row>
                            <Row className="w-100 m-3 d-flex" style={{height: '80vh'}}>
                                
                                <Col xl={5} className="my-3">
                                    
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>     
            </div>               
        )
    }
}