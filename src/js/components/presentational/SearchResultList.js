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
            selectedObjectData: [],
            formOption: [],
            thisComponentShouldUpdate: true,
            foundResult: [],
            notFoundResult: [],
            showNotResult: false,

        }

        this.handleChangeObjectStatusForm = this.handleChangeObjectStatusForm.bind(this)
        this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this)
        this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this)
        this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        this.handleToggleNotFound = this.handleToggleNotFound.bind(this);
    }
    
    componentDidMount() {

        let foundlist = [];


        for(var searchresult in this.props.searchResult){
            foundlist.push(this.props.searchResult[searchresult])
        }
        this.setState({
            foundResult: foundlist ? foundlist : [],
        })
        
    }
    componentDidUpdate(prepProps) {
        // console.log('Submit')

        if(!(_.isEqual(prepProps.searchResult, this.props.searchResult))) {
            let notFoundResult = [];
            let foundlist = [];


            for(var searchresult in this.props.searchResult){
                foundlist.push(this.props.searchResult[searchresult])
            }
            this.setState({
                foundResult: foundlist ? foundlist : [],
            })
        }   
        if(!this.props.hasSearchKey && prepProps.hasSearchKey){
            
        }     
    }

    handleChangeObjectStatusForm(eventKey) {
        console.dir(eventKey.target.attributes.Name.nodeValue)
        const isFound = 'found'
        const number = eventKey.target.attributes.Name.nodeValue
        console.log(this.state.foundResult[number])
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: isFound.toLowerCase() === 'found' ? this.state.foundResult[number] : this.state.notFoundResult[number]
        })

        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
        console.log('handleChangeObjectStatusFormClose')
        this.setState({
            showEditObjectForm: false,
            showConfirmForm: false,
        })
        this.props.shouldUpdateTrackingData(true)
    }

    handleChangeObjectStatusFormSubmit(postOption) {

        this.setState({
            selectedObjectData: {
                ...this.state.selectedObjectData,
                ...postOption,
            },
            showEditObjectForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    showConfirmForm: true,
                    formOption: postOption,
                })
            }.bind(this),
            500
        )
    }

    handleConfirmFormSubmit(e) {
        const button = e.target
        const postOption = this.state.formOption;
        const colorPanel = this.props.colorPanel ? this.props.colorPanel : null;
        let changedStatusSearchResult = this.props.searchResult.map(item => {
            if (postOption.mac_address === item.mac_address) {
                item = {
                    ...item,
                    ...postOption
                }
            }
            return item
        })

        axios.post(dataSrc.editObject, {
            formOption: postOption
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                    this.setState ({
                        showConfirmForm: false,
                        formOption: [],
                    })

                    this.props.transferSearchResult(changedStatusSearchResult, colorPanel )
                    this.props.shouldUpdateTrackingData(true)
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })
    } 

    handleToggleNotFound(e) {
        e.preventDefault()
        this.setState({
            showNotResult: !this.state.showNotResult
        })
        
    }

    
    render() {
        const locale = this.context;
        const { searchResult, searchKey} = this.props;

        const style = {
            searchResult:{
                height: '70vh',
                overflowY: 'hidden',
                boxShadow:'3px 3px 12px gray',
                padding:'0px',
                width: '100%',

                
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
            <div style = {style.searchResult} className='mx-0' >

                <div style={style.titleText} className="bg-primary justify-content-center">
                    
                        <h4 className="text-light w-100">{locale.SEARCH_RESULT}</h4>
                    
                    
                        <button className="btn btn-lg btn-light" onClick={this.props.closeSearchResult} style={{position: 'absolute',right: '0%'}}>x</button>
                        
                </div>
                
                <h5 className="bg-primary justify-content-center text-light w-100"> {searchResult.length} {locale.DEVICE_FOUND}</h5>
                

                <Row id = "searchResultTable" className="hideScrollBar justify-content-center" style={{overflowY: 'scroll',height: '55vh'}}>
                    {this.state.foundResult.length === 0
                    ?   
                            <em className="text-center">no searchResult</em>
                        
                    
                    :   

                        <ol className="m-2">
                            {this.state.foundResult.map((item,index) => {
                                console.log(item)
                                    let element = 
                                        <li href={'#' + index} className='searchResultList h6 text-left' onClick={this.handleChangeObjectStatusForm} key={index} name={index + 1}>
                                            {item.type}, ACN: xxxx-xxxx-{item.last_four_acn}, is near at {item.location_description} &nbsp;&nbsp;
                                            <img src={config.objectImage[item.type]} className="objectImage" alt="image"/>
                                            
                                        </li>
                                    return element
                                })}
                        </ol>

                            
                        
                       
                    }
                </Row>
            


                <ChangeStatusForm 
                    show={this.state.showEditObjectForm} 
                    title='Report device status' 
                    selectedObjectData={this.state.selectedObjectData} 
                    searchKey={searchKey}
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
                    handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
                />

                <ConfirmForm 
                    show={this.state.showConfirmForm}  
                    title='Thank you for reporting' 
                    selectedObjectData={this.state.formOption} 
                    handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
                    handleConfirmFormSubmit={this.handleConfirmFormSubmit}
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
