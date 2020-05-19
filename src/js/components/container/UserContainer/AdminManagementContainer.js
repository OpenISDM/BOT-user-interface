import React from 'react';
import { 
    ButtonToolbar,
} from 'react-bootstrap';
import ReactTable from 'react-table';
import axios from 'axios';
import dataSrc from '../../../dataSrc';
import { userInfoTableColumn } from '../../../config/tables';
import EditUserForm from './EditUserForm';
import { AppContext } from '../../../context/AppContext';
import DeleteUserForm from './DeleteUserForm';
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import messageGenerator from '../../../helper/messageGenerator';
import styleConfig from '../../../config/styleConfig';
const Fragment = React.Fragment;
import {
    PrimaryButton 
} from '../../BOTComponent/styleComponent';
import AccessControl from '../../presentational/AccessControl';
import config from '../../../config';

class AdminManagementContainer extends React.Component{

    static contextType = AppContext

    state = {
        data: [],
        columns: [],
        selectedUser: null,
        roleName: [],
        title: '',
        locale: this.context.locale.abbr,
        showDeleteConfirmation:false,
        deleteUserName:'',
        areaTable: [],
        showAddUserForm: false,
        showDeleteUserForm:false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getUserList()
        }
    }

    componentDidMount = () => {
        this.getUserList()
        this.getAllRole()
        this.getAreaTable()
    }

    getUserList = (callback) => {
        let { 
            locale
        } = this.context
        axios.get(dataSrc.user, {
            params: {
                locale: locale.abbr 
            }
        }).then(res => { 
            let columns = _.cloneDeep(userInfoTableColumn)
            columns.map((field, index) => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            let data = res.data.rows.map((item, index) => {
                item._id = index + 1
                item.roles = item.role_type.map(role => locale.texts[role.toUpperCase()]).join(',')
                item.area_ids = item.area_ids
                    .filter(area =>  area.id != item.main_area.id)
                    .map(area => {
                        return locale.texts[area.value]
                    })
                    .join('/')
                item.main_area.label = locale.texts[item.main_area.value]
                return item
            })
            this.setState({
                data,
                columns,
                showModifyUserInfo: false,
                showAddUserForm: false,
                showDeleteUserForm:false,
                showDeleteConfirmation:false,
                deleteUserName:'',
                selectedUser: null,
                locale: locale.abbr
            }, callback)
        })
    }

    getAllRole = () => {
        retrieveDataHelper.getAllRole()
            .then(res => {

                /** filter system default roles */
                let roleName = res.data.rows.filter(item => config.ROLES_SELECTION.includes(item.name))
                this.setState({
                    roleName,
                })
            })
    }

    getAreaTable = () => {
        retrieveDataHelper.getAreaTable()
            .then(res => {
                this.setState({
                    areaTable: res.data.rows
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    handleSubmit = (values) => {
        let {
            auth
        } = this.context

        let {
            api,
            selectedUser
        } = this.state 
         
        let user = {
            ...auth.user,
            ...values,
            id: selectedUser ? selectedUser.id : null,
            areas_id: auth.user.areas_id,
            main_area: values.area.id
        }

        let index = auth.user.areas_id.indexOf(auth.user.main_area)
        user.areas_id.splice(index, 1)

        if (!user.areas_id.includes(user.area.id)) {
            user.areas_id.push(user.area.id)
        } 
        let callback = () => {
            messageGenerator.setSuccessMessage('save success')
        } 
        let failback = () => {
            messageGenerator.setErrorMessage('signup fail')
        } 
        auth[api](user, () => {
            this.getUserList(callback)
        },
        failback(),
        setTimeout(() => {
            this.handleClose() 
         }, 500)
        )
    }

    handleDeleteUserSubmit = (e) => {
        this.setState({   
            showDeleteConfirmation : true, 
            deleteUserName : e.name.label
        })
    }

    handleWarningChecked = () => {
        axios.delete(dataSrc.user, {
            data: {
                username: this.state.deleteUserName
            }
        })
        .then(res => {
            let callback = () => messageGenerator.setSuccessMessage(
                'save success'
            )  
            this.getUserList(callback)
        })
        .catch(err => {
            console.log(`delete user failed ${err}`);
        })
    }

    handleClose = () => {
        this.setState({
            showAddUserForm: false,
            showDeleteUserForm: false,
            selectedUser: null,
            title: '',
            api: '',
            showDeleteConfirmation: false,
            deleteUserName:'',
        })
    }

    onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: (e, handleOriginal) => {
                this.setState({
                    showAddUserForm: true,
                    selectedUser: rowInfo.original,
                    title: 'edit user',
                    api: 'setUser',
                })
            }
        }
    }

    handleClick = (e, value) => {

        switch (e.target.name) {
            case 'add user':
                this.setState({
                    showAddUserForm: true,
                    title: 'add user',
                    api: 'signup',
                })
                break;
            case 'delete user':
                this.setState({
                    showDeleteUserForm:true
                })
                break;
          }
    }

    render() {
        const {
            locale
        } = this.context

        const {
            title
        } = this.state

        return (
            <Fragment>
                <div className='d-flex justify-content-start'>
                    <AccessControl
                        renderNoAccess={() => null}
                    >     
                        <ButtonToolbar>
                            <PrimaryButton
                                className='mb-1 mr-1'
                                name='add user'
                                onClick={this.handleClick}    
                            >
                                {locale.texts.ADD}
                            </PrimaryButton>
                            <PrimaryButton
                                className='mb-1'
                                name='delete user'
                                onClick={this.handleClick}    
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                <ReactTable 
                    data={this.state.data} 
                    columns={this.state.data.length != 0 ? this.state.columns : [{Header: ''}]} 
                    className='-highlight text-none'
                    style={{maxHeight:'75vh'}}                               
                    {...styleConfig.reactTable}
                    getTrProps={this.onRowClick}
                />

                <EditUserForm
                    show={this.state.showAddUserForm}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    title={title}
                    selectedUser={this.state.selectedUser}
                    roleName={this.state.roleName}
                    data = {this.state.data} 
                    areaTable={this.state.areaTable}
                />

                <DeleteUserForm
                    show={this.state.showDeleteUserForm}
                    title={locale.texts.DELETE_USER}
                    handleClose={this.handleClose}
                    data = {this.state.data}
                    handleSubmit = {this.handleDeleteUserSubmit}
                />

                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleWarningChecked}
                />

            </Fragment>
        )
    }
}

export default AdminManagementContainer