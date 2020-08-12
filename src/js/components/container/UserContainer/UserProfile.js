/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        UserProfile.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React from 'react';
import { 
    Button, 
    ButtonToolbar
} from 'react-bootstrap';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import EditAreasForm from '../../presentational/form/EditAreasForm';
import EditPwdForm from '../../presentational/form/EditPwdForm';
import messageGenerator from '../../../helper/messageGenerator';
import dataSrc from '../../../dataSrc';
import {
    ListTitle
} from '../../BOTComponent/styleComponent';
import NumberPicker from '../NumberPicker';
import apiHelper from '../../../helper/apiHelper';
 

class UserProfile extends React.Component{

    static contextType = AppContext

    state= {
        show: false,
        showEditPwd: false,
        areaTable: []
    }
    
    componentDidMount = () => {
        this.getAreaTable()
    }

    /** get area table from database */
    getAreaTable = () => {

        apiHelper.areaApiAgent.getAreaTable()
            .then(res => {
                let areaTable = res.data.rows.reduce((table, area) => {
                    table[area.id] = area
                    return table
                }, {})
                this.setState({
                    areaTable,
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    /** set user's number of search history */
    resetFreqSearchCount = (value) => {
        const {
            auth
        } = this.context;
        
        if (value) {
            let userInfo = auth.user
            
            userInfo.freqSearchCount = value

            this.setState({
                userInfo,
            })

            apiHelper.userApiAgent.editMaxSearchHistoryCount({
                info: userInfo,
                username: userInfo['name']           
            }).then(res => {
                auth.setUserInfo('freqSearchCount', value)
            }) 
        }
    }

    handleClick = (e) => {
        let name = e.target.name
        switch(name) {
            case "secondaryArea":
                this.setState({
                    show: true
                })
                break;
            case 'password':
                this.setState({ 
                    showEditPwd: true
                })
                break;
        }   
    }

    handleClose = () => {
        this.setState({
            show: false,
            showEditPwd:false
        })
    }

    handleSubmit = (values) => {
        let formIndex = [this.state.show, this.state.showEditPwd].indexOf(true);

        let callback = () => messageGenerator.setSuccessMessage(
            'save success'
        ) 
        var { auth } = this.context
        switch(formIndex) {

            case 0:

                auth.setArea(values.areas_id)
                this.setState({
                    show: false,
                    showEditPwd:false
                }, callback)
                break;

            case 1:

                axios.post(dataSrc.userInfo.password, {
                    user_id: auth.user.id,
                    password : values.check_password
                })
                .then(res => {
                    this.setState({
                        show: false,
                        showEditPwd:false
                    }, callback)
                    
                })
                .catch(err => {
                    console.log(err)
                }) 
                break;
        }

    }

    render(){
        const { 
            locale,
            auth 
        } = this.context

        const {
            areaTable
        } = this.state

        return(
            <div
                className='d-flex flex-column'
            >
                <ButtonToolbar
                    className='mb-2'
                >
                    <Button 
                        variant='outline-primary' 
                        className='text-capitalize mr-2'
                        name='secondaryArea'
                        size='sm'
                        onClick={this.handleClick}
                    >
                        {locale.texts.EDIT_SECONDARY_AREA}
                    </Button>
                    <Button 
                        variant='outline-primary' 
                        className='text-capitalize mr-2'
                        name='password'
                        size='sm'
                        onClick={this.handleClick}
                    >
                        {locale.texts.EDIT_PASSWORD}
                    </Button> 
                </ButtonToolbar>
                <div
                    className='mb-2'
                >
                    <ListTitle>
                        {locale.texts.ABOUT_YOU}
                    </ListTitle>
                    <p>
                        {locale.texts.NAME}: {auth.user.name}
                    </p>
                </div>
                <hr/>
                <div
                    className='mb-2 text-capitalize'
                >
                    <ListTitle>
                        {locale.texts.YOUR_SERVICE_AREAS}
                    </ListTitle>
                    <p>
                        {locale.texts.PRIMARY_AREA}: {areaTable.length != 0 
                            && auth.user.main_area
                            && locale.texts[areaTable[auth.user.main_area].name]
                        }
                    </p>
                    <p>
                        {locale.texts.SECONDARY_AREAS}: {
                            Object.values(this.state.areaTable)
                                .filter(area => {
                                    return auth.user.main_area != area.id && auth.user.areas_id.includes(area.id)
                                })
                                .map(area => {
                                    return locale.texts[area.name]
                                })
                                .join('/')
                        }
                    </p>
                </div>
                <hr/>
                <div
                    className='mb-2'
                >
                    <ListTitle>
                        {locale.texts.SEARCH_PREFERENCES}
                    </ListTitle>
                    <div 
                        className="d-flex justify-content-start align-items-center text-capitalize"
                    >
                        {locale.texts.NUMBER_OF_FREQUENT_SEARCH}: 
                        <NumberPicker
                            name="numberPicker"
                            value={auth.user.freqSearchCount}
                            onChange={this.resetFreqSearchCount}
                            length={10}
                        />
                    </div> 
                </div>
                <hr/>
                <EditAreasForm 
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    areaTable={this.state.areaTable}
                />
                <EditPwdForm
                    show={this.state.showEditPwd} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default UserProfile;