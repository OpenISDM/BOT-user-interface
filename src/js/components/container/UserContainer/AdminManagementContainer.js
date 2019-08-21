import React from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'
import ModifyUserInfo from './ModifyUserInfo'
import RemoveUserConfirmForm from './RemoveUserConfirmForm'

const Fragment = React.Fragment;

export default class AdminManagementContainer extends React.Component{

    constructor() {
        super();
        this.state = {
           userList: [],
           selectedUser: null,
           userRole: null
        }
        this.staticParamter = {
            roleName : []
        }
        this.onClickUser = this.onClickUser.bind(this)
        this.onCloseModifyUserInfo = this.onCloseModifyUserInfo.bind(this)
        this.onSubmitModifyUserInfo = this.onSubmitModifyUserInfo.bind(this)
        this.closeRemoveUserConfirm = this.closeRemoveUserConfirm.bind(this)
        this.submitRemoveUserConfirm = this.submitRemoveUserConfirm.bind(this)

        this.removeUser = this.removeUser.bind(this)
    }


    componentDidMount(){
        this.getRoleNameList()
        this.getUserList()
    }
    setUserRole(){
        axios.post(dataSrc.setUserRole,{

        }).then((res) => {

        })
    }
    getUserList(){
        axios.post(dataSrc.getUserList,{}).then((res) => {

            this.setState({
                userList: res.data
            })
        })
    }
    getUserRole(selectedUser, callBack){

        if(selectedUser){

            axios.post(dataSrc.getUserRole,{
                username: selectedUser.name
            }).then((res) => {
                console.log(res.data)
                var userRole = ''
                if(res.data.length !== 0){
                    userRole = res.data[0].name
                }
                callBack(userRole)
            })
        }
        
    }
    getRoleNameList(){
        axios.post(dataSrc.getRoleNameList,{}).then((res) => {
            this.staticParamter.roleName = res.data
        })
    }
    
    onClickUser(e){
        var index = e.target.getAttribute('name')
        this.getUserRole(this.state.userList[index], (userRole) => {
            this.setState({
                showModifyUserInfo: true,
                selectedUser: this.state.userList[index],
                userRole: userRole
            })
        })
        
        
    }
    onCloseModifyUserInfo(){
        this.setState({
            showModifyUserInfo: false, 
            selectedUser: null,
            userRole: null,
        })
    }
    onSubmitModifyUserInfo(newInfo){
        console.log(newInfo)
        axios.post(dataSrc.setUserRole,{
            username: this.state.selectedUser.name,
            ...newInfo
        }).then((res) => {
            this.setState({
                showModifyUserInfo: false,
                selectedUser: null,
                userRole: null,
            })
        })
    }
    removeUser(e){
        e.preventDefault()
        var username = e.target.getAttribute('name')
        this.setState({
            removeCandidate: username,
            showRemoveUserConfirm: true
        })

        
    }
    submitRemoveUserConfirm(){

        axios.post(dataSrc.removeUser, {
            username: this.state.removeCandidate
        }).then((res)=>{

            this.setState({
                removeCandidate: null,
                showRemoveUserConfirm: false
            });
            this.getUserList()
        })
        
    }
    closeRemoveUserConfirm(){
        this.setState({
            removeCandidate: null,
            showRemoveUserConfirm: false
        })
    }
    render(){
        const {userList} = this.state
        const {roleName} = this.staticParamter
        console.log('render')
        return(
            <div className="w-100">
                <ListGroup variant="flush" className="my-2 border-0">
                    {userList.map((user, index) => {
                        if(user.name){
                            return (
                                <ListGroup.Item key={user.name} className="my-0 h3" name={index}  action>
                                    <Col sm={11} className='float-left'>
                                        <h3 name={index} onClick = {this.onClickUser}>
                                            {user.name}
                                        </h3>
                                    </Col>
                                    <Col sm={1} className='float-left'>
                                        <i className="fa fa-trash float-right" aria-hidden="true" name={user.name} onClick={this.removeUser}></i>
                                    </Col>
                                </ListGroup.Item>
                            )
                        }
                    })}
                </ListGroup>
                <ModifyUserInfo
                    roleName = {roleName}
                    show = {this.state.showModifyUserInfo}
                    user = {this.state.selectedUser}
                    userRole = {this.state.userRole}
                    onClose = {this.onCloseModifyUserInfo}
                    onSubmit = {this.onSubmitModifyUserInfo}
                />
                <RemoveUserConfirmForm 
                    show = {this.state.showRemoveUserConfirm}
                    user = {this.state.removeCandidate}
                    onSubmit = {this.submitRemoveUserConfirm}
                    onClose = {this.closeRemoveUserConfirm}
                />
            </div>
        )
    }
}
AdminManagementContainer.contextType = LocaleContext;