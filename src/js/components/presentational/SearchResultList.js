import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap';


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
            setTimeout( function() {
                this.props.UpdateTrackingData()
                this.handleConfirmForm('close', null)
            }.bind(this), 500);
        }).catch( error => {
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
    render() {
        const locale = this.context;
        const { searchResult, searchKey} = this.props;
        const Setting={
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '25%',
            top: '10%',
            right: '5%',
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
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                float: 'left',
                // background: 'rgb(227, 222, 222)',
                // height: 30,
                // width: 30,
            },
            middleText: {

                paddingLeft: 2,
                paddingRight: 2,
                float: 'left',
                textAlign: 'center',

            },
            lastText: {
                // textAlign: 'right'

                float: 'left',
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
            // <div style = {style.searchResult} className='mx-0 bg-light' >
        return(

            <div id="searchResult"className='m-2 p-0 shadow' style={style.SearchResult}>

                <div className="bg-transparent px-3">
                    
                        <h4 className="text-primary w-100 text-left bg-transparent">{locale.SEARCH_RESULT}</h4>
                    
                    
                        <h1 onClick={this.closeSearchResult} className="text-primary bg-transparent" style={{position: 'absolute',top: '0%', right: '5%'}}>x</h1>

                        <h6 className=" text-left  text-primary w-100 bg-transparent"> {this.state.foundMode? locale.DEVICE_NOT_FOUND(searchResult.length) : locale.DEVICE_FOUND(searchResult.length)}</h6>
                
                        <h6 onClick ={this.handleToggleNotFound} className="text-left text-primary w-100 bg-transparent" style={{maxHeight: '8vh'}}>Show {this.state.foundMode? 'Not Found' : 'Found'} Result</h6>
                        
                </div>
                
                
                
                <Row id = "searchResultTable" className="hideScrollBar justify-content-center w-100 m-2 p-0" style={{overflowY: 'scroll',maxHeight: (parseInt(Setting.maxHeight.slice(0,2)) -12).toString() + 'vh'}} >
                    
                    

                    {this.state.searchResult.length === 0
                    ?   
                            <h1 className="text-center m-3">no searchResult</h1>
                        
                    
                    :   <div className="m-0 p-0 justify-content-center" style={{width:'100%'}}>

                            {this.state.searchResult.map((item,index) => {

                                    let element = 
                                        <Row key={index} className={"px-4 my-1 d-flex align-left"} onClick={this.addDeviceSelection} name={index}>
                                            {this.state.addTransferDevices
                                                ?   
                                                    <>
                                                        <div className="m-1" name={index}>{index + 1}</div>
                                                        <div className="custom-control custom-checkbox m-2" name={index} style={{textAlign: 'left'}} >
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                style={{textAlign: 'left'}}
                                                                onChange={this.addDeviceSelection}
                                                                checked = {item.checked}
                                                                id={'check'+item.mac_address}
                                                                name={index}
                                                            />
                                                            <label className="custom-control-label text-left" name={index} htmlFor={'check'+item.mac_address}>
                                                                {item.type}, is near at {item.location_description}, <br /> 
                                                                ACN: xxxx-xxxx-{item.last_four_acn},status is {item.status}
                                                            </label>
                                                        </div>
                                                        <br/>
                                                        {config.searchResult.showImage
                                                            ?
                                                                <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>
                                                            :
                                                                null
                                                        }
                                                        
                                                       
                                                    </>
                                                :
                                                    <>
                                                        <div className="m-1" name={index}>{index + 1}</div>
                                                        <div className="custom-control custom-checkbox"  style={{textAlign: 'left'}} name={index}>
                                                            <input
                                                                type="checkbox"
                                                                name={index}
                                                                className="custom-control-input"
                                                                style={{textAlign: 'left'}}
                                                                onChange={this.addDeviceSelection}
                                                                checked = {parseInt(this.state.selectedSingleChangeObjectIndex) === index}
                                                                id={'check'+item.mac_address}
                                                            />
                                                            
                                                                {item.type}, is near at {item.location_description}, <br /> 
                                                                ACN: xxxx-xxxx-{item.last_four_acn},status is {item.status}
                                                        </div>
                                                        <br />
                                                       

                                                       {config.searchResult.showImage
                                                            ?
                                                                <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>
                                                            :
                                                                null
                                                        }
                                                    </>


                                            }
                                                
                                            

                                        </Row>
                                    return element
                                })}
                        
                        </div>

                        
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
// this.state.addTransferDevices 

//                         ?
//                             <ol className="m-0 p-0 justify-content-center" style={{width:'90%'}}>

//                                 {this.state.foundResult.map((item,index) => {
//                                         let element = 
//                                             <Row key={index} className="px-5 d-flex justify-content-center align-middle">
//                                                 <Col xl={1} className="px-0 my-4">
//                                                    <input type="checkbox" checked={this.state.selectedObjectData[item.mac_address] !== undefined} className="form-check-input align-self-center d-flex" name={index + 1} onChange={this.addDeviceSelection}/>
                                                    
//                                                 </Col>
//                                                 <Col xl={11} className="px-0 d-flex justify-content-center align-middle">
//                                                     <li href={'#' + index} className='searchResultList h6 text-left' onClick={this.handleChangeObjectStatusFormShow}  name={index + 1}>
//                                                         {item.type}, ACN: xxxx-xxxx-{item.last_four_acn}, is near at {item.location_description} &nbsp;&nbsp;
//                                                         <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>

//                                                     </li>
//                                                 </Col>
//                                             </Row>
//                                         return element
//                                     })}
//                             }
//                             </ol>
//                         :
//                             <ol className="m-0 p-2 justify-content-center" style={{width:'90%'}}>
//                                 {this.state.foundResult.map((item,index) => {
//                                         let element = 
//                                                 <li href={'#' + index} className='searchResultList h6 text-left' onClick={this.handleChangeObjectStatusFormShow} key={index} name={index + 1}>
                                                    
//                                                     {item.type}, ACN: xxxx-xxxx-{item.last_four_acn}, is near at {item.location_description} &nbsp;&nbsp;
//                                                     <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>

//                                                 </li>
                                            
                                           
//                                         return element
//                                     })}
//                             </ol>

                            
                        