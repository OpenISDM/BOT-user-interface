import React from 'react';
import { 
    ButtonToolbar,
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import {
    getUserList,
    getRoleNameList,
    deleteUser,
    getMainSecondArea,
} from "../../../dataSrc";
import { userInfoTableColumn } from '../../../config/tables'
import EditUserForm from './EditUserForm';
import { AppContext } from '../../../context/AppContext';
import DeleteUserForm from './DeleteUserForm'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm';
import retrieveDataHelper from '../../../service/retrieveDataHelper';
import styleConfig from '../../../config/styleConfig';
const Fragment = React.Fragment;
import {
    PrimaryButton 
} from '../../BOTComponent/styleComponent'
import AccessControl from '../../presentational/AccessControl'

class AdminManagementContainer extends React.Component{

    static contextType = AppContext

    state = {
        showAddUserForm: false,
        showDeleteUserForm:false,
        data: [],
        columns: [],
        selectedUser: null,
        roleName: [],
        title: '',
        locale: this.context.locale.abbr,
        showDeleteConfirmation:false,
        deleteUserName:'',
        areaTable: [],
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getDataContontainer() 
        }
    }

    componentDidMount = () => {
        this.getDataContontainer()
    }

    async getDataContontainer() {
        let {
            locale
        } = this.context

        var userList = ( Promise.resolve( this.getUserList() )  );
        await   userList.then(function(result){userList = result})
 
        var roleName = ( Promise.resolve(  this.getRoleNameList())  );
        await   roleName.then(function(result){roleName = result})

        var areaTable = ( Promise.resolve( this.getAreaTable())  );
        await   areaTable.then(function(result){areaTable = result}) 
      
        this.setState({
            data: userList.data,
            columns : userList.columns,
            showModifyUserInfo: false,
            showAddUserForm: false,
            showDeleteUserForm:false,
            showDeleteConfirmation:false,
            deleteUserName:'',
            selectedUser: null,
            locale: locale.abbr,
            areaTable:areaTable,
            roleName:roleName,
        }) 
   
    }

    async getUserList(){
        let { 
            locale
        } = this.context
        return await axios.post(getUserList, {
            locale: locale.abbr 
        }).then(res => { 
            let columns = _.cloneDeep(userInfoTableColumn)
            columns.map((field, index) => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            res.data.rows.map((item, index) => {
                item._id = index + 1
                item.roles = item.role_type.map(role => locale.texts[role.toUpperCase()]).join(',')
                item.area_ids = item.area_ids
                    .filter(area =>  area.id != item.main_area)
                    .map(area => {
                        return locale.texts[area.value]
                    })
                    .join('/')
                item.main_area = locale.texts[item.area_name]
            })
            return ({
                data: res.data.rows,
                columns,
                showModifyUserInfo: false,
                showAddUserForm: false,
                showDeleteUserForm:false,
                showDeleteConfirmation:false,
                deleteUserName:'',
                selectedUser: null,

            })
            // this.setState({
            //     data: res.data.rows,
            //     columns,
            //     showModifyUserInfo: false,
            //     showAddUserForm: false,
            //     showDeleteUserForm:false,
            //     showDeleteConfirmation:false,
            //     deleteUserName:'',
            //     selectedUser: null,

            // })
        })
    }

    async  getRoleNameList(){
        return await   axios.post(getRoleNameList,{
            }).then(res => {
                let rows = _.cloneDeep(res.data.rows)
                rows.filter(item => item.name !== "guest" )
                return res.data.rows
                // this.setState({
                //     roleName: res.data.rows
                // })
            })
    }

    async getAreaTable(){
        return await  retrieveDataHelper.getAreaTable()
            .then(res => {
                return res.data.rows
                // this.setState({
                //     areaTable: res.data.rows
                // })
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
 
        auth[api](user, () => {
            this.getDataContontainer()
        })
    
        
        // values.id = selectedUser ? selectedUser.id : null

        // auth[api](values)
        //     .then(res => {
        //         this.getUserList()
        //         this.setState({
        //             showModifyUserInfo: false,
        //             showAddUserForm: false,
        //             showDeleteUserForm:false,
        //             showDeleteConfirmation:false,
        //             deleteUserName:'',
        //             selectedUser: null,
        //         })
        //     })
        //     .catch(err => {
        //         console.log(`${api} failed ${err}`)
        //     })
    }

    handleDeleteUserSubmit = (e) => {
        this.setState({   
            showDeleteConfirmation : true, 
            deleteUserName : e.name.label
        })
    }

    handleWarningChecked = () => {
        axios.post(deleteUser, {
            username: this.state.deleteUserName
        })
        .then(res => {
            this.getUserList()
            this.handleClose()
        })
        .catch(err => {
            console.log("delete User fail : " + err);
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
                
                axios.post(getMainSecondArea, {
                    username: rowInfo.original.name
                })
                .then(res => { 
                    rowInfo.original.second_area = res.data.rows[0].second_area
                    rowInfo.original.main_area = res.data.rows[0].main_area 
                    this.setState({
                        showAddUserForm: true,
                        selectedUser: rowInfo.original,
                        title: 'edit user',
                        api: 'setUser',
                    })
                })
                .catch(err => {
                    console.log(`get Main Second Area fail! ${err}`)
                })
            }
        }
    }

    handleClick = (e, value) => {

        switch (e.target.name) {
            case "add user":
                this.setState({
                    showAddUserForm: true,
                    title: 'add user',
                    api: 'signup',
                })
                break;
            case "delete user":
                this.setState({
                    showDeleteUserForm:true
                })
                break;
          }
    }

    render(){
        const {
            locale
        } = this.context

        const {
            title
        } = this.state

        return (
            <Fragment>
                <div className="d-flex justify-content-start">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >     
                        <ButtonToolbar>
                            <PrimaryButton
                                className='mb-1 mr-1'
                                name="add user"
                                onClick={this.handleClick}    
                            >
                                {locale.texts.ADD_USER}
                            </PrimaryButton>
                            <PrimaryButton
                                className='mb-1'
                                name="delete user"
                                onClick={this.handleClick}    
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                {this.state.data.length != 0 &&
                    <ReactTable 
                        data = {this.state.data} 
                        columns = {this.state.columns} 
                        noDataText="No Data Available"
                        className="-highlight text-none"
                        pageSize={this.state.data.length}
                        style={{maxHeight:'85vh'}}                               
                        {...styleConfig.reactTable}
                        getTrProps={this.onRowClick}
                    />
                }

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