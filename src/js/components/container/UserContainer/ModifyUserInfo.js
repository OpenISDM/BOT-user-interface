import React from 'react';
import { Col, Row, ListGroup, Modal, Button } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'


const Fragment = React.Fragment;

export default class ModifyUserInfo extends React.Component{

    constructor() {
        super();
        this.state = {
           userInfo: null,
           show: false
        }
        this.staticParameter = {
            userRole: null
        }
        this.API = {
            openUserInfo: (userInfo) => {
                this.state.userInfo = userInfo
                this.setState({})
            },
            closeUserInfo: () => {
                // this.staticParameter.userRole = null
                this.state.userInfo = null
                this.setState({})
            }
        }
        this.closeModifyUserInfo = this.closeModifyUserInfo.bind(this)
        this.onSelectRoleCheck = this.onSelectRoleCheck.bind(this)
        this.submitModifyUserInfo = this.submitModifyUserInfo.bind(this)
    }

    componentDidMount(){
        if(this.props.getAPI){
            this.props.getAPI(this.API)
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if(!this.staticParameter.userRole && nextProps.userRole){
            this.staticParameter.userRole = nextProps.userRole
            return true
        }
        if(this.props.show || nextProps.show){
            return true
        }
        return true
    }
    componentDidUpdate(prevProps, PrevState){
        if(false){}
        
    }
    closeModifyUserInfo(){
        this.staticParameter.userRole = null
        this.API.closeUserInfo()
        this.props.onClose()        
    }
    submitModifyUserInfo(){
        var  role = this.staticParameter.userRole
        this.staticParameter.userRole = null
        this.API.closeUserInfo()
        this.props.onSubmit({
            role: role,
        })
    }

    onSelectRoleCheck(e){
        var name = e.target.name
        this.staticParameter.userRole = name

        this.setState({})
    }

    roleCheckBoxHtml(role, userRole){

        var name = role.name
        let html = 
            <div className="custom-control custom-checkbox" key={name}>
                <input
                    type="checkbox"
                    className="custom-control-input"
                    onChange={this.onSelectRoleCheck}
                    checked = {userRole === name}
                    name={name}
                    id={'check' + name}
                />
                 <label className="custom-control-label h4" htmlFor={'check' + name}>{name}</label>
                
            </div>

        return html
    }


    render(){
        const {show} = this.state
        const {userRole} = this.staticParameter
        console.log('renderrrr')
        return(
            <Modal 
                show={this.props.show}
                onHide={this.closeModifyUserInfo}
            >
                <Modal.Header closeButton className='font-weight-bold'>
                    
                </Modal.Header>
                <Modal.Body className="d-block">
                    <Row className="px-3 py-1">
                        <h4 className="w-100">
                            UserInfo
                        </h4>
                        <div className="p-2">
                            {
                                this.props.roleName.map((roleName) => {
                                    return this.roleCheckBoxHtml(roleName, userRole)
                                })
                            }
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-light text-primary" onClick={this.closeModifyUserInfo}>Cancel</Button>
                    <Button onClick={this.submitModifyUserInfo}>Submit</Button>
                </Modal.Footer>
            </Modal>
                
        )
    }
}
ModifyUserInfo.contextType = LocaleContext;