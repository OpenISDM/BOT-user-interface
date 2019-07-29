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
            formOption: [],
            thisComponentShouldUpdate: true,
            foundResult: [],
            notFoundResult: [],
            showNotResult: false,
            addTransferDevices: false,
            newStatus: '',
            changeState: false,
            searchResult: [],
            selectedSingleChangeObjectIndex: -1,

            ShouldUpdateChangeStatusForm    : false,
            ShouldUpdateConfirmForm         : false,

        }


        this.handleChangeObjectStatusFormShow = this.handleChangeObjectStatusFormShow.bind(this)


        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);
        this.closeSearchResult = this.closeSearchResult.bind(this)

        this.addDeviceSelection = this.addDeviceSelection.bind(this)
        this.handleConfirmForm = this.handleConfirmForm.bind(this)




        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)
    }
    
    componentDidMount() {

        let foundlist = [];


        for(var searchresult in this.props.searchResult){
            this.props.searchResult[searchresult].checked = false;
            foundlist.push(this.props.searchResult[searchresult])
            this.state.searchResult.push[this.props.searchResult[searchresult]]
        }
        this.setState({
            foundResult: foundlist ? foundlist : [],
        })
        
    }
    componentDidUpdate(prepProps, prevState) {


        if(!(_.isEqual(prepProps.searchResult, this.props.searchResult))) {
            let notFoundResult = [];
            let foundlist = [];


            for(var searchresult in this.props.searchResult){
                this.props.searchResult[searchresult].checked = false;
                foundlist.push(this.props.searchResult[searchresult])
                this.state.searchResult.push[this.props.searchResult[searchresult]]
            }
            this.setState({
                foundResult: foundlist ? foundlist : [],
            })
        }   
        if(this.state.changeState !== prevState.changeState){

            this.setState({

            })
        }    
        if(this.props.searchResult.length !== this.state.searchResult.length){
            var x = this.initializeSearchResultList(this.props.searchResult)

            this.setState({
                searchResult: this.initializeSearchResultList(this.props.searchResult)
            })

        }
        if(this.state.selectedObjectData.length !== prevState.selectedObjectData.length){

            this.setState({

            })
        }

    }

    initializeSearchResultList(searchResults){
        var searchResult = []
        for(var searchresult in searchResults){

            let result = searchResults[searchresult];
            result.checked = false;

            searchResult.push(result);
        }

        return searchResult
    }

    handleChangeObjectStatusFormShow(index) {
        this.handleChangeObjectStatusForm('show', index)
    }

    handleChangeObjectStatusFormClose() {
        this.handleChangeObjectStatusForm('close', null)
    }

    handleChangeObjectStatusForm(command, Option){
        this.setState({
            ShouldUpdateChangeStatusForm: ! this.state.ShouldUpdateChangeStatusForm,
        })
        if(command === 'submit'){
            this.handleConfirmForm('show', null)
            var postOption = Option;

            this.setState({
                newStatus:postOption,
                showEditObjectForm: false,
                showConfirmForm: true,
                changeState : ! this.state.changeState,
            })
            
        }else if(command === 'close'){
            this.handleConfirmForm('close', null)
            this.setState({
                showEditObjectForm: false,
                addTransferDevices: false,
                selectedObjectData: {},
            })
            this.props.shouldUpdateTrackingData(true)
        }else if(command === 'show'){
            var SearchResult = this.initializeSearchResultList(this.props.searchResult)
            this.setState({
                searchResult: SearchResult,
                showEditObjectForm: true,
            })
        }else if(command === 'AddTransferDevices'){
            var state = Option
            this.state.searchResult[this.state.selectedSingleChangeObjectIndex].checked = true
            this.setState({
                addTransferDevices: state,
                changeState: !this.state.changeState

            })
        }


    }

    handleConfirmForm(command, Option){
        
        if(command === 'submit'){
            if(Option === true){
                for(var i in this.state.selectedObjectData){
                    this.state.selectedObjectData[i].status = this.state.newStatus.status
                    this.state.selectedObjectData[i].transferred_location = this.state.newStatus.transferred_location
                }
                var selectedObjectData = []
                for(var i in this.state.selectedObjectData){
                    selectedObjectData.push(this.state.selectedObjectData[i])
                }
                axios.post(dataSrc.editObjectPackage, {
                    formOption: selectedObjectData
                }).then(res => {
                    this.handleConfirmForm('close', null)
                    

                    this.props.shouldUpdateTrackingData()

                }).catch( error => {
                    console.log(error)
                })
            }
            
        }else if(command === 'close'){
            this.setState({
                showEditObjectForm: false,
                showConfirmForm: false,
                addTransferDevices: false,
                selectedObjectData: {},
                changeState: !this.state.changeState
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
            showNotResult: !this.state.showNotResult
        })
        
    }
    closeSearchResult(){
        this.props.closeSearchResult()
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

        const style = {
            searchResult:{
                height: '80vh',
                overflowY: 'hidden',
                boxShadow:'3px 3px 12px gray',
                padding:'0px',
                width: this.state.addTransferDevices ? '100%' : '100%',

                position: 'absolute',
                right: '0%'

                
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
            notFoundResultDiv: {
                display: 'block',
            }, 
            searchResultCloseButton:{
                height: '10px',
                width: '10px',
                fontSize: '30px',
                float: 'right'
                // top: '-2%'
            }

        }

        return(
            <div style = {style.searchResult} className='mx-0 bg-light' >

                <div style={style.titleText} className="bg-primary justify-content-center">
                    
                        <h4 className="text-light w-100">{locale.SEARCH_RESULT}</h4>
                    
                    
                        <button className="btn btn-lg btn-light" onClick={this.closeSearchResult} style={{position: 'absolute',right: '0%'}}>x</button>
                        
                </div>
                
                <h5 className="bg-primary justify-content-center text-light w-100"> {searchResult.length} {locale.DEVICE_FOUND}</h5>
                

                <Row id = "searchResultTable" className="hideScrollBar justify-content-center w-100 m-0 p-0" style={{overflowY: 'scroll',height: '70vh'}}>
                    {this.state.foundResult.length === 0
                    ?   
                            <em className="text-center">no searchResult</em>
                        
                    
                    :   <div className="m-0 p-0 justify-content-center" style={{width:'100%'}}>

                            {this.props.searchResult.map((item,index) => {

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

                    formOption = {this.state.newStatus}

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

                            
                        