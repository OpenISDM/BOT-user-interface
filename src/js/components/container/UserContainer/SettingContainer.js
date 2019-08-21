import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'
import UserSettingContainer from './UserSettingContainer'

const Fragment = React.Fragment;

export default class SettingContainer extends React.Component{

    constructor() {
        super();
        this.state = {
           role: null,
           userList: []
        }
        // this.getUserRole = this.getUserRole.bind(this)
        // this.getUserList = this.getUserList.bind(this)
    }
    componentDidMount(){
        // this.getUserRole(Cookies.get('user'))
    }
    sideNavMouseOver(e){
        e.target.style.fontSize = "1.6rem"
    }
    sideNavMouseLeave(e){
        e.target.style.fontSize = "1.5rem"
    }
    
    render(){
        const locale = this.context
        const {role, userList} = this.state
        return(
            <div>
                <Row className = "w-100 h-100">
                {
                    true
                        ?
                            <Fragment>
                            {
                                false
                                ?
                                    <Fragment>
                                     {console.log(userList)}
                                         {
                                //             userList.map((user) => {
                                //                 console.log(user.name)
                                //             })
                                //         }
                                //         <Col xl={2} className="py-3 px-4">
                                //             <ListGroup variant="flush" className="my-3 mx-4 border-0">
                                //             <ListGroup.Item 
                                //                 className="border-0 my-2" 
                                //                 style={{fontSize: '1.5rem'}}>
                                //                 User
                                //             </ListGroup.Item>
                                //                 {
                                //                     userList
                                //                     ?
                                //                         userList.map((user) => {
                                //                             if(!user.name){return }
                                //                             console.log(user)
                                //                             return (
                                //                                 <ListGroup.Item 
                                //                                     key={user.name}
                                //                                     className="border-0 my-2" 
                                //                                     href="#DevicesManagement"
                                //                                     style={{fontSize: '1.5rem'}}
                                //                                     onMouseOver={this.sideNavMouseOver}
                                //                                     onMouseLeave={this.sideNavMouseLeave}
                                //                                     action>
                                //                                     {user.name}
                                //                                 </ListGroup.Item>
                                //                             )
                                                            
                                //                         })
                                //                     :
                                //                         null
                                                    
                                //                 }
                                                
                                                
                                //             </ListGroup>
                                //         </Col>
                                //         <Col xl={10} className="m-0" style={{overflow: 'hidden', height: '93vh'}}>
                                //             <UserSettingContainer 

                                //             />
                                //         </Col>
                            }
                                    </Fragment>
                                :
                                    <Col xl={12} className="m-0" style={{overflow: 'hidden', height: '93vh'}}>
                                        <UserSettingContainer 
                                            userName={Cookies.get('user')}
                                        />
                                    </Col>
                            }
                            </Fragment>
                        :
                            null
                }
                
                    
                </Row>     
            </div>
        )
    }
}
SettingContainer.contextType = LocaleContext;