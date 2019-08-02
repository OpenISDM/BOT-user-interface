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

import { NotificationContainer, NotificationManager } from 'react-notifications';


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


        this.generateResultHTML = this.generateResultHTML.bind(this)
        this.generateResultTableRowHTML = this.generateResultTableRowHTML.bind(this)

        this.generateResultListRowHTML = this.generateResultListRowHTML.bind(this)
        this.handleDisplayMode = this.handleDisplayMode.bind(this)
    }
    
    componentDidMount() {
        this.initializeSearchResultList()
        
    }
    componentDidUpdate(prepProps, prevState) {
        var state = {}
        var update = false
    

        if(this.propsCheck('ShouldUpdate') !== this.state.ShouldUpdateForProps){
            this.initializeSearchResultList()
            update = true
            state = {
                ...state,
                ShouldUpdateForProps: this.props.ShouldUpdate
            }

            if(!this.state.addTransferDevices){
                this.initializeSearchResultList()
            }
        }
        if(update){
            this.setState(state)
        }

    }

    componentWillReceiveProps(nextProps){
        setTimeout(function(){
            try{
                console.log(10101)
                console.log(nextProps.searchResult[0].status)
            }catch{}
            
            if(nextProps.ShouldUpdate !== this.state.ShouldUpdateForProps){
                this.setState({
                    ShouldUpdateForProps: nextProps.ShouldUpdate,
                    searchResult: nextProps.searchResult
                })
            }
            try{
                console.log(nextProps.ShouldUpdate)
            }catch{

            }
            }.bind(this),2000)
        
        
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
        var foundResult = []
        var notFoundResult = []


        for(var searchresult in searchResults){

            let result = searchResults[searchresult];
            
            result.checked = false;

            searchResult.push(result);

            if(result.found){
                foundResult.push(result)
            }else{
                notFoundResult.push(result)
            }
        }
        // console.log(foundResult)
        this.setState({
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
            this.setState({
                showEditObjectForm: false,
                addTransferDevices: false,
                selectedObjectData: {},
            })
            // this.props.shouldUpdateTrackingData(true)
        }else if(command === 'show'){
            this.initializeSearchResultList()
            this.setState({
                showEditObjectForm: true,
            })
        }else if(command === 'AddTransferDevices'){
            var state = Option
            this.state.searchResult[this.state.selectedSingleChangeObjectIndex].checked = true
            this.setState({
                addTransferDevices: state,
                changeState: this.state.changeState + 1

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
                NotificationManager.success('Edit object success', 'Success', 2000)
            
        }).catch( error => {
            NotificationManager.error('Edit object Fail', 'Fail', 2000)
            console.log(error)
        })
    }

    handleConfirmForm(command, Option){
        
        if(command === 'submit'){
            
            if(Option === true){

                const {selectedObjectData, newStatus} = this.state;

                var macAddresses = [];
                // push the mac address to a list and finally send this to backend
                for(var i in selectedObjectData){
                    macAddresses.push(selectedObjectData[i].mac_address)
                }
                // submit to backend
                this.handleSubmitToBackend(newStatus, macAddresses)
                
                
            }
            
        }else if(command === 'close'){
            this.setState({
                showEditObjectForm: false,
                showConfirmForm: false,
                addTransferDevices: false,
                selectedObjectData: {},
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
    closeSearchResult(){
        var closeSearchResult = this.propsCheck('closeSearchResult')
        closeSearchResult()
        this.handleChangeObjectStatusForm('close', null)
        this.setState({
            showConfirmForm: false,
            showEditObjectForm: false,
            addTransferDevices: false,
            selectedObjectData: {},
        })
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

    generateResultListRowHTML(item, index){

        var {addDeviceSelection} = this
        var {addTransferDevices} = this.state
        var showImage = config.searchResult.showImage
        const style = {
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                float: 'left',
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
                float: 'left',
                textAlign: 'center',
            },
            lastText: {
                float: 'left',
            },
        }
        let element = 

            <Row key={index} className = "w-100" onClick={addDeviceSelection} name={index}>
                
                <>
                    <div  name={index} className = "mx-3">{index + 1}.</div>
                    <div  name={index}  className = "mx-3 text-left">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            style={{textAlign: 'left'}}
                            onChange={addDeviceSelection}
                            checked = {item.checked}
                            id={'check'+item.mac_address}
                            name={index}
                        />

                        {addTransferDevices
                            ?   
                                <label className="custom-control-label text-left" name={index} htmlFor={'check'+item.mac_address}/>
                            :
                                null
                        }

                        {item.type}, is near at {item.location_description}, <br /> 

                        ACN: xxxx-xxxx-{item.last_four_acn},status is {item.status}<br />

                        near at {item.location_description}
                        
                    </div>


                    {showImage
                        ?
                            <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>
                        :
                            null
                    }
                </>
            </Row>

        return element
        
    }
    generateResultTableRowHTML(item, index){
        var {addDeviceSelection} = this
        var {addTransferDevices} = this.state
        var showImage = config.searchResult.showImage
        const style = {
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                float: 'left',
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
                float: 'left',
                textAlign: 'center',
            },
            lastText: {
                float: 'left',
            },
        }
        let element =
            <ListGroup.Item  action style={style.listItem} className='searchResultList ' eventKey={'found:' + index} key={index} >
            <div className = "w-100" key={item.mac_address}>
                <Col xl={2} lg={2} md={2} xs={2} className="float-left p-0"  onClick={this.addDeviceSelection} name={index}>{index + 1}</Col>
                <Col xl={3} lg={3} md={3} xs={4} className="float-left p-0"  onClick={this.addDeviceSelection} name={index}>{item.type}</Col>
                {addTransferDevices
                    ?   
                        <>
                            <input
                                type="checkbox"
                                className="float-left p-0"
                                onChange={addDeviceSelection}
                                checked = {item.checked}
                                id={'check'+item.mac_address}
                                name={index}
                            />
                            <label name={index} htmlFor={'check'+item.mac_address} />
                        </>
                    :
                        null 
                }
                <Col xl={4} lg={7} md={7} xs={6} onClick={addDeviceSelection} className="float-left p-0" name={index}>ACN: xxxx-xxxx-{item.last_four_acn}</Col>
                {showImage
                    ?
                        
                            <img src={config.objectImage[item.type]} className="float-left p-0 objectImage" alt="image"/>

                    :
                        null
                }
            </div>
            </ListGroup.Item>
        return element
    }
    generateResultHTML(searchResult){
        var {addTransferDevices} = this.state

        var resultStyle = config.searchResult.style

        if(searchResult === undefined){
            console.error('search Result is undefined at generateResultTableHTML, ERROR!!!!')
            return null
        }
        if(searchResult.length === 0){
            return <h1 className="text-center m-3">no searchResult</h1>
        }else{

            return  <Row className="m-0 p-0 justify-content-center" style={{width:'100%'}}>
                {this.state.searchResult.map((item,index) => {
                    if(resultStyle === 'table'){
                        var html = this.generateResultTableRowHTML(item, index)
                    }
                    else if(resultStyle === 'list'){
                        var html = this.generateResultListRowHTML(item, index)
                    }
                    
                    return html
                })}
            </Row>

        }
    }

    handleDisplayMode(){
        var locale = this.context
        var {foundResult, notFoundResult, searchResult} = this.state
        var mode = config.searchResult.displayMode
        var x;
        if(mode === 'showAll'){

            x = 
                <>
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {locale.DEVICE_FOUND(foundResult.length)}</h6>
                    {
                        this.generateResultHTML(foundResult)
                    }
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {locale.DEVICE_NOT_FOUND(notFoundResult.length)}</h6>
                    {
                        this.generateResultHTML(notFoundResult)
                    }
                </>

        }else if(mode === 'switch'){
            x = 
                <>
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {this.state.foundMode? locale.DEVICE_FOUND(searchResult.length) : locale.DEVICE_NOT_FOUND(searchResult.length)}</h6>
                    
                    {
                        this.generateResultHTML(searchResult)
                    }
                </>
        }else{
            console.error(`the mode isn't recognized, please modify the config.js file {searchResult.displayMode} to {'switch', 'showAll'}`)
            
        }
        return x 
    }
    
    render() {
        console.log(this.props.ShouldUpdate)
        const locale = this.context;
        const { searchResult, searchKey} = this.props;
        const defaultSetting={
            
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '25%',
            top: '10%',
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

                zIndex: (this.propsCheck('Show'))?1051:0,

                background:'#FFFFFF',
                
                float: 'right', 

                width: config.searchResult.showImage ?  (parseInt(Setting.width.slice(0,2))*1.3) + '%' : Setting.width,

                position:'absolute',

                top: Setting.top,
                right: Setting.right,
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

// console.log(this.state.searchResult)
console.log('render1231')
            // <div style = {style.searchResult} className='mx-0 bg-light' >
        return(

            <div id="searchResult"className='m-0 p-0 shadow' style={style.SearchResult}>
                <NotificationContainer />
                <div className="bg-transparent px-3">
                    
                        <h4 className="text-primary w-100 text-left bg-transparent">{locale.SEARCH_RESULT}</h4>
                    
                    
                        <h1 onClick={this.closeSearchResult} className="text-primary bg-transparent" style={{position: 'absolute',top: '0%', right: '5%'}}>x</h1>
                        {config.searchResult.displayMode === 'switch'
                            ?
                                <h6 onClick ={this.handleToggleNotFound} className="text-left text-primary w-100 bg-transparent" style={{maxHeight: '8vh'}}>Show {this.state.foundMode? 'Not Found' : 'Found'} Result</h6>
                            :
                                null
                        }
                        
                
                        
                        
                </div>
                
                
                
                <Row id = "searchResultTable" className="hideScrollBar justify-content-center w-100 m-2 p-0" style={{overflowY: 'scroll',maxHeight: (parseInt(Setting.maxHeight.slice(0,2)) -12).toString() + 'vh'}} >      
                    {
                        this.handleDisplayMode()
                    }
                </Row>
            

                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedObjectData} 
                    handleChangeObjectStatusForm = {this.handleChangeObjectStatusForm}

                    ShouldUpdate = {this.state.ShouldUpdateChangeStatusForm}
                />

                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.selectedObjectData} 
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
                            
                        