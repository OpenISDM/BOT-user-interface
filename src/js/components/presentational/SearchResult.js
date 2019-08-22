import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap';
// import {NotificationContainer, NotificationManager} from 'react-notifications';

import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import axios from 'axios';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import Cookies from 'js-cookie'

import '../../../css/hideScrollBar.css'
import '../../../css/SearchResult.css'
import config from '../../config';

import SearchResultTable from './SearchResultTable'

import { NotificationContainer, NotificationManager } from 'react-notifications';

import AxiosFunction from '../../functions/AxiosFunction';

const Fragment = React.Fragment;
class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {        }
        this.staticParameters = {
            wholeSearchResult: {},
            searchResult: {},
            selectedItem: {},
            newStatus: {},
            addTransferDevices: false
        }

        this.API = {
            closeSearchResult: () => {
                this.setState({
                    show: false,
                })
                this.staticParameters.searchResult = {}
                if(!this.staticParameters.addTransferDevices){
                    this.props.handleSearchContainerFloatUp(false)
                }
                
            },
            openSearchResult: (result) => {
                var foundResult = [], notFoundResult = []
                for(var i of result){
                    if(i['found'] === 1){
                        foundResult[i.mac_address] = i
                    }else{
                        notFoundResult[i.mac_address] = i
                    }
                }
                var searchResult = {
                    foundResult: foundResult, 
                    notFoundResult: notFoundResult
                }

                this.setState({
                    show: true,
                })

                // update search result
                this.staticParameters.searchResult = searchResult
                this.staticParameters.wholeSearchResult = {
                    ...foundResult,
                    ...notFoundResult
                }
                // update table
                this.APIforTable.updateSearchResult(searchResult)
            },
            clearSelectedItem: () => {

                this.staticParameters.selectedItem = {}
                this.staticParameters.addTransferDevices = false
            },
            clearAll: () => {
                var {searchResult, selectedItem, addTransferDevices} = this.staticParameters
                this.staticParameters.searchResult = {}
                this.staticParameters.selectedItem = {}
                this.staticParameters.addTransferDevices = false
            }
        }


        this.handleChangeStatusForm = {
      
            closeEvent: () => {

                this.APIforConfirmForm.closeForm()
                this.API.clearAll()
                this.APIforTable.updateAddTransferDeviceMode(false)
                this.props.handleSearchContainerFloatUp(false)
            },
            submitEvent: (newStatus) => {
                this.staticParameters.newStatus = newStatus
                var {selectedItem, newStatus} = this.staticParameters
                this.APIforChangeStatusForm.closeForm()
                this.APIforConfirmForm.openForm(selectedItem, newStatus)
                this.APIforTable.updateAddTransferDeviceMode(false)
                this.props.handleSearchContainerFloatUp(false)

            },

            addDeviceEvent: () => {
                this.APIforTable.updateAddTransferDeviceMode(true)
                this.props.handleSearchContainerFloatUp(true)
                this.staticParameters.addTransferDevices = true

            }
        }
        this.handleConfirmForm = {
            closeEvent: () => {
                this.API.clearAll()
                this.APIforTable.updateAddTransferDeviceMode(false)
                this.props.handleSearchContainerFloatUp(false)
            },
            submitEvent: () => {
                const {selectedItem, newStatus} = this.staticParameters;

                var acn = Object.values(selectedItem).map((item) => {
                    return item.access_control_number
                });

                var Info = {
                    username: Cookies.get('user'),
                    newStatus: newStatus.status,
                    newLocation: newStatus.transferred_location,
                    notes: newStatus.notes,
                    acn: acn
                }

                AxiosFunction.editObjectPackage(Info,(err, res) => {
                    if(err){
                        console.log(error)
                        NotificationManager.error('Edit object Fail', 'Fail', 2000)
                    }else{
                        this.API.clearAll()
                        this.APIforConfirmForm.closeForm()
                        this.props.UpdateTrackingData()
                        NotificationManager.success('Edit object success', 'Success')
                    }
                })
            }
        }
        this.event = {
            onClose: () => {
                this.API.closeSearchResult()
                this.props.onClose()
            }
        }
        this.getAPIfromTable = (API) => {
            this.APIforTable = API
        }
        this.getAPIfromConfirmForm = (API) => {
            this.APIforConfirmForm = API
        }
        this.getAPIfromChangeStatusForm = (API) => {
            this.APIforChangeStatusForm = API
        }

        this.APIforTable = null
        this.APIforConfirmForm = null
        this.APIforChangeStatusForm = null

        this.onClickTableItem = this.onClickTableItem.bind(this)   
    }
    componentDidMount() {
        this.props.getAPI(this.API)
    }
    componentDidUpdate(prepProps, prevState) {
    }
    onClickTableItem(e){
        
        var index = e.target.getAttribute('name')
        var item = this.staticParameters.wholeSearchResult[index]
        var {selectedItem, addTransferDevices} = this.staticParameters
        if(addTransferDevices){     
            if(index in selectedItem){
                delete this.staticParameters.selectedItem[item.mac_address]
            }else{
                this.staticParameters.selectedItem[item.mac_address] = item
            }
        }else{
            this.staticParameters.selectedItem = {}

            this.staticParameters.selectedItem[item.mac_address] = item
        }
        this.APIforTable.updateSelectedMacList(this.staticParameters.selectedItem)
        this.APIforChangeStatusForm.openForm(this.staticParameters.selectedItem)

    }
    render() {   
        const locale = this.context;
        const { searchResult, searchKey} = this.props;
        const defaultSetting={
            
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '35%',
            top: '25%',
            right: '5%',

        }
        var Setting = {
            ...defaultSetting,
            ...this.props.Setting,
        }

        const style = {
            SearchResult:{
                maxHeight: Setting.maxHeight,

                minHeight: Setting.minHeight,

                display: (this.state.show)?'block':'none',

                zIndex: (this.state.show)?1100:0,

                width: config.searchResult.showImage ?  (Setting.width!== null? (parseInt(Setting.width.slice(0,2))*1.3) + '%': null): Setting.width,

                position:'absolute',

                top: Setting.top,
                right: Setting.right,

                borderRadius: '10px',
            },
        }
        return(
            <Fragment>

                <NotificationContainer />
                <div id="searchResult"className='m-0 p-1 shadow bg-white' style={style.SearchResult}>
                    

                    <div className="bg-transparent px-3">
                        
                            <h3 className="text-primary w-100 text-left bg-transparent">{locale.SEARCH_RESULT}</h3>
                                               
                            <h1 onClick={this.event.onClose} className="text-primary bg-transparent" style={{position: 'absolute',top: '0%', right: '5%'}}>x</h1>
                            
                    </div>

                    <SearchResultTable 
                        getAPI = {this.getAPIfromTable}
                        onClick = {this.onClickTableItem}
                        Setting = {Setting}
                    />

                </div>

                <ChangeStatusForm 
                    getAPI = {this.getAPIfromChangeStatusForm}

                    onSubmit = {this.handleChangeStatusForm.submitEvent}
                    onClose = {this.handleChangeStatusForm.closeEvent}
                    onAddDevice = {this.handleChangeStatusForm.addDeviceEvent}

                    title={'Report Devices Status'}
                />
                <ConfirmForm 
                    getAPI = {this.getAPIfromConfirmForm}

                    onSubmit = {this.handleConfirmForm.submitEvent}
                    onClose = {this.handleConfirmForm.closeEvent}

                    title = {'Thank you for reporting'}
                />
            </Fragment>

        )
    }
}
SearchResult.contextType = LocaleContext;
export default SearchResult
                            