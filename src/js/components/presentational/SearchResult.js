import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap';
// import {NotificationContainer, NotificationManager} from 'react-notifications';

import LocaleContext from '../../context/LocaleContext';
import ChangeStatusForm from '../container/ChangeStatusForm';
import ConfirmForm from '../container/ConfirmForm';
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { shouldUpdateTrackingData } from '../../action/action';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import _ from 'lodash';
import { deepEqual } from 'assert';


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
                this.APIforTable.toTop()
                var foundResult = {}, notFoundResult = {}
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
                // this.setState({
                //     selectedItem: [],
                //     addTransferDevices: false
                // })
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

        this.APIforTable = null
        this.APIforConfirmForm = null
        this.APIforChangeStatusForm = null


        // check whether props are properly logged in
        this.propsCheck = this.propsCheck.bind(this)

        // show either found list or not found list
        // this.handleToggleNotFound = this.handleToggleNotFound.bind(this);

        this.closeSearchResult = this.closeSearchResult.bind(this)

        // forms handler
        this.initializeSearchResultList = this.initializeSearchResultList.bind(this);

        this.onClickTableItem = this.onClickTableItem.bind(this)

        this.getAPIfromTable = this.getAPIfromTable.bind(this)
        this.getAPIfromConfirmForm = this.getAPIfromConfirmForm.bind(this)
        this.getAPIfromChangeStatusForm = this.getAPIfromChangeStatusForm.bind(this)


        this.confirmFormOnSubmit = this.confirmFormOnSubmit.bind(this)

       
    }

    getAPIfromTable(API){

        this.APIforTable = API

        this.APIforTable.setOnClick(this.onClickTableItem)
    }

    getAPIfromConfirmForm(API){
        this.APIforConfirmForm = API

        this.APIforConfirmForm.setOnSubmit(this.confirmFormOnSubmit)

        this.APIforConfirmForm.setTitle('Thank you for reporting')
    }

    getAPIfromChangeStatusForm(API){
        this.APIforChangeStatusForm = API

        this.APIforChangeStatusForm.setOnSubmit(this.handleChangeStatusForm.submitEvent)

        this.APIforChangeStatusForm.setOnClose(this.handleChangeStatusForm.closeEvent)

        this.APIforChangeStatusForm.setAddDevice(this.handleChangeStatusForm.addDeviceEvent)

        this.APIforChangeStatusForm.setTitle('Report device status')
    }
    
    componentDidMount() {
        this.props.getAPI(this.API)
        setTimeout(this.initializeSearchResultList,300)
    }
    componentDidUpdate(prepProps, prevState) {
        var state = {}
        var update = false
    }
    

    propsCheck(attribute){

        if(attribute){
            return this.props[attribute]
        }else{
            console.error(attribute + 'is undefined')
        }
    }


    initializeSearchResultList(){
        // console.log(this.props.searchResult)
        var searchResults = this.propsCheck('searchResult');

        var searchResult = []
        var foundResult = {}
        var notFoundResult = {}
        var wholeSearchResultMap = []
        var searchResultMap = {}


        for(var searchresult in searchResults){

            let result = searchResults[searchresult];
            
            result.checked = false;
            searchResultMap[result.mac_address] = result
            searchResult.push(result);

            if(result.found){
                foundResult[result.mac_address] = result
            }else{
                notFoundResult[result.mac_address] = result
            }
        }
        var searchResultBoth = {
            foundResult: foundResult,
            notFoundResult: notFoundResult,
        }

        this.APIforTable.updateSearchResult(searchResultBoth)

        this.setState({
            searchResultMap: searchResultMap,
        })


    }


    handleSubmitToBackend(newStatus, macAddresses){
        // send format are as follow
        var Info = {
            newStatus: newStatus.status,
            newLocation: newStatus.transferred_location,
            notes: newStatus.notes,
            macAddresses: macAddresses
        }
        AxiosFunction.editObjectPackage(Info,(err, res) => {
            if(err){
                console.log(error)
                NotificationManager.error('Edit object Fail', 'Fail', 2000)
            }else{
                this.APIforConfirmForm.closeForm()
                this.props.UpdateTrackingData()
                NotificationManager.success('Edit object success', 'Success')
            }
        })
    }
    confirmFormOnSubmit(){

        const {selectedItem, newStatus} = this.staticParameters;
        var macAddresses = [];
        // push the mac address to a list and finally send this to backend
        for(var i in selectedItem){
            macAddresses.push(selectedItem[i].mac_address)
        }
        // submit to backend

        this.handleSubmitToBackend(newStatus, macAddresses)
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
    closeSearchResult(){
        this.API.closeSearchResult()
        var closeSearchResult = this.propsCheck('closeSearchResult')
        closeSearchResult()
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

                background:'#FFFFFF',
                
                float: 'right', 

                width: config.searchResult.showImage ?  (Setting.width!== null? (parseInt(Setting.width.slice(0,2))*1.3) + '%': null): Setting.width,

                position:'absolute',

                top: Setting.top,
                right: Setting.right,

                borderRadius: '3%',
            },
            listItem: {
                position: 'relative',
                zIndex: 6,
            }, 
            noResultDiv: {
                color: 'grey',
                fontSize: 30,
            },
            
            titleText: {

                color: 'rgb(80, 80, 80, 0.9)', 
                textAlign: 'center',
                overflowX: 'hidden',
                display: 'flex'
                
            }, 
            searchResultCloseButton:{
                height: '10px',
                width: '10px',
                fontSize: '30px',
                float: 'right'
            }

        }


        return(
            <Fragment>

                <NotificationContainer />
                <div id="searchResult"className='m-0 p-0 shadow' style={style.SearchResult}>
                    

                    <div className="bg-transparent px-3">
                        
                            <h3 className="text-primary w-100 text-left bg-transparent">{locale.SEARCH_RESULT}</h3>
                        
                        
                            <h1 onClick={this.closeSearchResult} className="text-primary bg-transparent" style={{position: 'absolute',top: '0%', right: '5%'}}>x</h1>
                            
                    </div>

                    <SearchResultTable 
                        getAPI = {this.getAPIfromTable}

                        Setting = {Setting}
                    />
                </div>

                <ChangeStatusForm 
                    getAPI = {this.getAPIfromChangeStatusForm}
                    
                />
                {
                    // show={this.state.showEditObjectForm} 
                    // title='Report device status' 
                    // selectedObjectData={this.state.selectedItem} 
                    // handleChangeObjectStatusForm = {this.handleChangeObjectStatusForm}

                    // ShouldUpdate = {this.state.ShouldUpdateChangeStatusForm}
                }
                <ConfirmForm 
                    getAPI = {this.getAPIfromConfirmForm}
                />
            </Fragment>

        )
    }
}
SearchResult.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(SearchResult);
                            