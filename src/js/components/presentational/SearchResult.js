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

const Fragment = React.Fragment;
class SearchResult extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            selectedObjectData: {},
            
            // true the search result will be found
            // else will be not found
            show: false,
            foundMode: true,
            foundResult: {},
            notFoundResult: {},

            wholeSearchResult: [],
            searchResultBoth: {
                foundResult: null,
                notFoundResult: null,
            },
            searchResult: [],
            newStatus: {},

            addTransferDevices: false,
            changeState: false,
            selectedSingleChangeObjectIndex: -1,

            ShouldUpdateForProps: -1,
            ShouldUpdateForState: -1,

            thisComponentShouldUpdate       : 0,
            ShouldUpdateChangeStatusForm    : 0,
            ShouldUpdateConfirmForm         : 0,

            selectedItem: [],

            tableRef: null, 
            scrollToTop: 0

        }
        this.staticParameters = {

        }

        this.API = {
            closeSearchResult: () => {
                this.setState({
                    show: false,
                    searchResult: [],
                })
            },
            openSearchResult: (searchResult) => {
                this.setState({
                    show: true,
                    searchResult: searchResult
                })
            },
            clearSelectedItem: () => {
                this.setState({
                    selectedItem: [],
                    addTransferDevices: false
                })
            },
            clearAll: () => {
                this.setState({
                    searchResult: [],
                    selectedItem: [],
                    addTransferDevices: false
                })
            }
        }


        this.handleChangeStatusForm = {
      
            closeEvent: () => {
                this.APIforConfirmForm.closeForm()
                this.APIforTable.updateAddTransferDeviceMode(false)
                this.API.clearAll()
                this.props.handleSearchContainerFloatUp(false)
            },
            submitEvent: (status, transferred_location) => {
                this.setState({
                    newStatus: {
                        status: status,
                        transferred_location: transferred_location
                    }
                })
                var {selectedItem, newStatus} = this.state
                this.APIforChangeStatusForm.closeForm()
                this.APIforConfirmForm.openForm(selectedItem, newStatus)
                this.APIforTable.updateAddTransferDeviceMode(false)
                this.props.handleSearchContainerFloatUp(false)
            },

            addDeviceEvent: () => {
                this.APIforTable.updateAddTransferDeviceMode(true)
                this.setState({
                    addTransferDevices: true
                })
                this.props.handleSearchContainerFloatUp(true)
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
        // this.handleConfirmForm = this.handleConfirmForm.bind(this)
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)

        // this.addDeviceSelection = this.addDeviceSelection.bind(this)


        this.initializeSearchResultList = this.initializeSearchResultList.bind(this);

        this.onClickTableItem = this.onClickTableItem.bind(this)

        this.getAPIfromTable = this.getAPIfromTable.bind(this)
        this.getAPIfromConfirmForm = this.getAPIfromConfirmForm.bind(this)
        this.getAPIfromChangeStatusForm = this.getAPIfromChangeStatusForm.bind(this)


        this.confirmFormOnSubmit = this.confirmFormOnSubmit.bind(this)

       
    }

    getAPIfromTable(API){
        // console.log('API')
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
        setTimeout(this.initializeSearchResultList,1000)
    }
    componentDidUpdate(prepProps, prevState) {
        var state = {}
        var update = false
    

        if(this.propsCheck('ShouldUpdate') !== this.state.ShouldUpdateForProps){
            this.initializeSearchResultList()
            this.setState({
                ShouldUpdateForProps: this.propsCheck('ShouldUpdate')
            })
                

            
        }
        if(update){
            this.setState(state)
        }

    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.ShouldUpdate !== this.state.ShouldUpdateForProps){

           return true
        }else{return true}
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

    handleChangeObjectStatusFormShow(index) {
        this.handleChangeObjectStatusForm('show', index)
    }

    handleChangeObjectStatusFormClose() {
        this.handleChangeObjectStatusForm('close', null)
    }

    handleChangeObjectStatusForm(command, Option){
        this.setState({
            ShouldUpdateChangeStatusForm: this.state.ShouldUpdateChangeStatusForm + 1,
        })
        if(command === 'submit'){
            this.APIforTable.updateAddTransferDeviceMode(false)
            var newStatus = Option;
            this.APIforConfirmForm.openForm(this.state.selectedItem, newStatus)
            // this.handleConfirmForm('show', null)
            

            this.setState({
                newStatus:newStatus,
                showEditObjectForm: false,
                showConfirmForm: true,
                changeState :  this.state.changeState + 1,
            })
          
        }else if(command === 'close'){
            // this.handleConfirmForm('close', null)

            this.APIforConfirmForm.closeForm()
            this.props.handleSearchContainerFloatUp(false)
            this.APIforTable.updateAddTransferDeviceMode(false)
            this.setState({
                showEditObjectForm: false,
                addTransferDevices: false,
            })
            // this.props.shouldUpdateTrackingData(true)
        }else if(command === 'show'){
            this.initializeSearchResultList()
            this.props.handleSearchContainerFloatUp(true)
            this.setState({
                showEditObjectForm: true,
            })
        }else if(command === 'AddTransferDevices'){
            var state = Option
            this.APIforTable.updateAddTransferDeviceMode(true)
            this.setState({
                addTransferDevices: state,
            })
        }
    }

    handleSubmitToBackend(newStatus, macAddresses){
        // send format are as follow
        axios.post(dataSrc.editObjectPackage, {
            newStatus: newStatus.status,
            newLocation: newStatus.transferred_location,
            macAddresses: macAddresses
        }).then(res => {
            
                this.APIforConfirmForm.closeForm()
                this.props.UpdateTrackingData()
                // this.handleConfirmForm('close', null)
                NotificationManager.success('Edit object success', 'Success')
            
        }).catch( error => {
            console.log(error)
            NotificationManager.error('Edit object Fail', 'Fail', 2000)

        })
    }
    confirmFormOnSubmit(){
        const {selectedItem, newStatus} = this.state;
        var macAddresses = [];
        // push the mac address to a list and finally send this to backend
        for(var i in selectedItem){
            macAddresses.push(selectedItem[i].mac_address)
        }
        // submit to backend
        console.log(newStatus)
        this.handleSubmitToBackend(newStatus, macAddresses)
    }

    onClickTableItem(e){
        
        var index = e.target.getAttribute('name')
        
        var item = this.state.searchResultMap[index]
        if(this.state.addTransferDevices){          
            if(item.mac_address in this.state.selectedItem){
                delete this.state.selectedItem[item.mac_address]
            }else{
                this.state.selectedItem[item.mac_address] = item
            }
        }else{
            this.state.selectedItem = []
            this.state.selectedItem[item.mac_address] = item
        }
        this.APIforTable.updateSelectedMacList(this.state.selectedItem)
        this.APIforChangeStatusForm.openForm(this.state.selectedItem)
        // this.APIforChangeStatusForm.updateselectedObjectData(this.state.selectedItem)
        // this.handleChangeObjectStatusForm('show',this.state.selectedItem)

    }
    closeSearchResult(){
        this.API.closeSearchResult()
        var closeSearchResult = this.propsCheck('closeSearchResult')
        console.log('close')
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
        console.log('render')

        return(
            <Fragment>
                <div id="searchResult"className='m-0 p-0 shadow' style={style.SearchResult}>
                    <NotificationContainer />

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
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedItem} 
                    handleChangeObjectStatusForm = {this.handleChangeObjectStatusForm}

                    ShouldUpdate = {this.state.ShouldUpdateChangeStatusForm}
                />

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
                            