import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import dataSrc from "../../../dataSrc";
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';

import MyDeviceManager from './MyDeviceManager'
import ShiftChangeRecord from './ShiftChangeRecord'
import AdminManagementContainer from './AdminManagementContainer'
import EditObjectManagement from './EditObjectManagement'
import LocaleContext from '../../../context/LocaleContext';
const Fragment = React.Fragment;
export default class UserSettingContainer extends React.Component{
    constructor() {
        super();
        this.pageList=[
            {
                pageName: 'DevicesManagement',
                locale: 'Devices_Management',
                component: <MyDeviceManager />
            },
            {
                pageName: 'ShiftRecordHistory',
                locale: 'Shift_Record_History',
                component: <ShiftChangeRecord />
            },
            {
                pageName: 'AdminManagement',
                locale: 'ADMIN',
                component: <AdminManagementContainer />
            },
            {
                pageName: 'EditObjectManagement',
                locale: 'Edit_Object_Management',
                component: <EditObjectManagement />
            }
        ]
    }
    sideNavMouseOver(e){
        e.target.style.fontSize = "1.6rem"
    }
    sideNavMouseLeave(e){
        e.target.style.fontSize = "1.5rem"
    }
    render(){
        var locale = this.context
        return (
            <div className = "d-flex justify-content-center">
                <Row className = "w-75 h-100">
                    <Col xl={3} className="m-0">
                        <ListGroup variant="flush" className="my-4 border-0">
                            <ListGroup.Item className="border-0 my-2 h3">{locale.User_Setting}</ListGroup.Item>
                            {this.pageList.map((page) => {
                                return(
                                    <ListGroup.Item 
                                        key={page.pageName}
                                        className="border-0 m-0" 
                                        href={'#' + page.pageName}
                                        style={{fontSize: '1.5rem'}}
                                        onMouseOver={this.sideNavMouseOver}
                                        onMouseLeave={this.sideNavMouseLeave}
                                        action>
                                        {locale[page.locale]}
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Col>
                    <Col xl={9} className="m-0" style={{overflow: 'hidden', height: '93vh'}}>
                    {
                        // 
                    }
                        {this.pageList.map((page) => {
                            return(
                                <div id={page.pageName} key={page.pageName}className="p-3" style={{height: '93vh'}}>   
                                    <Row className="w-100 m-3" style={{height: '6vh'}}>                         
                                        <h3>
                                            {locale[page.locale]}
                                        </h3>
                                    </Row>
                                    <Row className="w-100 m-3 d-flex bg-white" style={{height: '80vh'}}>
                                        {page.component}                               
                                    </Row>
                                </div>
                            )
                        })}
                    </Col>
                </Row>     
            </div>               
        )
    }
}
UserSettingContainer.contextType = LocaleContext;
