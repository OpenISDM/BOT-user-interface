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
            showEditObjectForm: false,
            showConfirmForm: false,

            selectedObjectData: {},
            
            // true the search result will be found
            // else will be not found
            foundMode: true,
            foundResult: [],
            notFoundResult: [],

            wholeSearchResult: [],

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



        }

        // check whether props are properly logged in
        this.propsCheck = this.propsCheck.bind(this)

        // show either found list or not found list
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);

        this.closeSearchResult = this.closeSearchResult.bind(this)

        // forms handler
        this.handleConfirmForm = this.handleConfirmForm.bind(this)
        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)

        this.addDeviceSelection = this.addDeviceSelection.bind(this)


        this.initializeSearchResultList = this.initializeSearchResultList.bind(this);

        this.onClickTableItem = this.onClickTableItem.bind(this)


       
    }
    
    componentDidMount() {
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
    
    // componentWillReceiveProps(nextProps){
    //     setTimeout(function(){
         
            
    //         if(nextProps.ShouldUpdate !== this.state.ShouldUpdateForProps){

    //             this.setState({
    //                 ShouldUpdateForProps: nextProps.ShouldUpdate,
    //                 searchResult: nextProps.searchResult
    //             })
    //         }
    //         try{

    //         }catch{

    //         }
    //         }.bind(this),2000)
        
        
    // }

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
        var foundResult = []
        var notFoundResult = []
        var wholeSearchResultMap = []
        var searchResultMap = {}


        for(var searchresult in searchResults){

            let result = searchResults[searchresult];
            
            result.checked = false;
            searchResultMap[result.mac_address] = result
            searchResult.push(result);

            if(result.found){
                foundResult.push(result)
            }else{
                notFoundResult.push(result)
            }
        }
        // console.log(foundResult)
        this.setState({
            searchResultMap: searchResultMap,
            wholeSearchResult: searchResult,
            foundResult: foundResult,
            notFoundResult: notFoundResult,
            searchResult: this.state.foundMode ? foundResult: notFoundResult,
            changeState: this.state.changeState + 1,
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
            this.handleConfirmForm('show', null)
            var postOption = Option;

            this.setState({
                newStatus:postOption,
                showEditObjectForm: false,
                showConfirmForm: true,
                changeState :  this.state.changeState + 1,
            })
          
        }else if(command === 'close'){
            this.handleConfirmForm('close', null)
            this.props.handleSearchContainerFloatUp(false)
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
            

                this.props.UpdateTrackingData()
                this.handleConfirmForm('close', null)
                NotificationManager.success('Edit object success', 'Success')
            
        }).catch( error => {
            console.log(error)
            NotificationManager.error('Edit object Fail', 'Fail', 2000)

        })
    }

    handleConfirmForm(command, Option){
        
        if(command === 'submit'){
            
            if(Option === true){

                const {selectedItem, newStatus} = this.state;

                var macAddresses = [];
                // push the mac address to a list and finally send this to backend
                for(var i in selectedItem){
                    macAddresses.push(selectedItem[i].mac_address)
                }
                // submit to backend
                this.handleSubmitToBackend(newStatus, macAddresses)
                
                
            }
            
        }else if(command === 'close'){
            this.props.handleSearchContainerFloatUp(true)
            this.setState({
                showEditObjectForm: false,
                showConfirmForm: false,
                addTransferDevices: false,
                changeState: this.state.changeState + 1
            })
        }else if(command === 'show'){
            this.setState({
                showConfirmForm: true,
            })
        }
        this.setState({
            ShouldUpdateConfirmForm: ! this.state.ShouldUpdateConfirmForm,
        })
    }

  

    

    handleToggleNotFound(e) {

        e.preventDefault()
        this.setState({
            searchResult: ! this.state.foundMode ? this.state.foundResult : this.state.notFoundResult,
            foundMode: ! this.state.foundMode,
        })
        
    }
    onClickTableItem(e){
        var index = e.target.getAttribute('name')
        var item = this.state.searchResult[index]
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
        this.handleChangeObjectStatusForm('show',this.state.selectedItem)

    }
    closeSearchResult(){
        var closeSearchResult = this.propsCheck('closeSearchResult')
        closeSearchResult()
    }



    addDeviceSelection(e){

        if(this.state.searchResult.length !== 0){
            if(!this.state.addTransferDevices){
                var index = e.target.getAttribute('name')
                var item = this.state.searchResult[index]
                this.setState({
                    selectedSingleChangeObjectIndex: index
                })
                this.state.selectedObjectData = []
                this.state.selectedObjectData[item.mac_address] = this.state.searchResult[index];
                this.handleChangeObjectStatusForm('show',this.state.searchResult[index])

            }else{
                var index = e.target.getAttribute('name')
                this.state.searchResult[index].checked = ! this.state.searchResult[index].checked
                var item = this.state.searchResult[index]
                if(item.checked){
                    this.state.selectedObjectData[item.mac_address] = this.state.searchResult[index];
                }else{
                    delete this.state.selectedObjectData[item.mac_address]
                }
            }
        }
        
        this.setState({
            ShouldUpdateChangeStatusForm: ! this.state.ShouldUpdateChangeStatusForm
        })   
    }

    

    
    render() {
    
        const locale = this.context;
        const { searchResult, searchKey} = this.props;
        const defaultSetting={
            
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '25%',
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

                display: (this.propsCheck('Show'))?'block':'none',

                zIndex: (this.propsCheck('Show'))?1100:0,

                background:'#FFFFFF',
                
                float: 'right', 

                width: config.searchResult.showImage ?  (parseInt(Setting.width.slice(0,2))*1.3) + '%' : Setting.width,

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

            <div id="searchResult"className='m-0 p-0 shadow' style={style.SearchResult}>
                <NotificationContainer />
                <div className="bg-transparent px-3">
                    
                        <h4 className="text-primary w-100 text-left bg-transparent">{locale.SEARCH_RESULT}</h4>
                    
                    
                        <h1 onClick={this.closeSearchResult} className="text-primary bg-transparent" style={{position: 'absolute',top: '0%', right: '5%'}}>x</h1>
                        
                </div>
                
                <SearchResultTable 
                    addDeviceSelection = {this.onClickTableItem}
                    addTransferDevices = {this.state.addTransferDevices}
                    foundResult = {this.state.foundResult}
                    notFoundResult = {this.state.notFoundResult}
                    searchResult = {this.state.searchResult}
                    foundMode = {this.state.foundMode}
                    selectedItem = {this.state.selectedItem}
                    handleToggleNotFound = {this.handleToggleNotFound}
                    Setting = {Setting}
                />
                
                
            

                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedItem} 
                    handleChangeObjectStatusForm = {this.handleChangeObjectStatusForm}

                    ShouldUpdate = {this.state.ShouldUpdateChangeStatusForm}
                />

                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.selectedItem} 
                    handleConfirmForm={this.handleConfirmForm}

                    newStatus = {this.state.newStatus}

                    ShouldUpdate = {this.state.ShouldUpdateConfirmForm}
                />
            </div>

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
                            