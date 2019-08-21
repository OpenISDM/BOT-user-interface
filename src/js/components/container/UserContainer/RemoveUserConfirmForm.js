import React from 'react';
import { Col, Row, ListGroup, Modal, Button } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'


const Fragment = React.Fragment;

export default class RemoveUserConfirm extends React.Component{

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
        this.submitModifyUserInfo = this.submitModifyUserInfo.bind(this)
    }

    closeModifyUserInfo(){
        this.props.onClose() 
    }
    submitModifyUserInfo(){
        this.props.onSubmit()
    }

    render(){
        const locale = this.context

        return(
            <Modal 
                show={this.props.show}
                onHide={this.closeModifyUserInfo}
            >
                <Modal.Header closeButton className='font-weight-bold'>
                    {locale.REMOVE_USER_CONFIRM}
                </Modal.Header>
                <Modal.Body className="d-block d-flex justify-content-center">
                    <h2>{'Remove User ' + this.props.user}</h2>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-light text-primary" onClick={this.closeModifyUserInfo}>Cancel</Button>
                    <Button onClick={this.submitModifyUserInfo}>Submit</Button>
                </Modal.Footer>
            </Modal>
                
        )
    }
}
RemoveUserConfirm.contextType = LocaleContext;