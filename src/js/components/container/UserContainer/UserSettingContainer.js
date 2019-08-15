import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../dataSrc";
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';

import MyDeviceManager from './MyDeviceManager'
import ShiftChangeRecord from './ShiftChangeRecord'

const Fragment = React.Fragment;
export default class UserSettingContainer extends React.Component{

    constructor() {
        super();
        this.state = {
        }
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
                                style={{fontSize: '1.5rem'}}
                                onMouseOver={this.sideNavMouseOver}
                                onMouseLeave={this.sideNavMouseLeave}
                                action>
                                Devices Management
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 my-2" href="#ShiftRecordHistory"
                                style={{fontSize: '1.5rem'}}
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
                                <MyDeviceManager />                                
                            </Row>
                        </div>
                        <div id="ShiftRecordHistory" className="p-3" style={{height: '93vh'}}>   
                            <Row className="w-100 m-3" style={{height: '6vh'}}>                         
                                <h2 >
                                    Shift Record History
                                </h2>
                            </Row>
                            <Row className="w-100 m-3 d-flex" style={{height: '80vh'}}>
                                <ShiftChangeRecord />
                            </Row>
                        </div>
                    </Col>
                </Row>     
            </div>               
        )
    }
}