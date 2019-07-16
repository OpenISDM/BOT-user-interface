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
        // console.log(this.props.SearchResult)
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
        console.log(prepProps.searchResult)
        if(!(_.isEqual(prepProps.searchResult, this.props.searchResult))) {
            let notFoundResult = [];
            let foundlist = [];
            console.log(this.props.searchResult)

            for(var searchresult in this.props.searchResult){
                foundlist.push(this.props.searchResult[searchresult])
            }
            this.setState({
                foundResult: foundlist ? foundlist : [],
            })
        }        
    }

    handleChangeObjectStatusForm(eventKey) {
        // console.log(eventKey)
        const eventItem = eventKey.split(':');
        const isFound = eventItem[0]
        const number = eventItem[1]

        this.setState({
            showEditObjectForm: true,
            selectedObjectData: isFound.toLowerCase() === 'found' ? this.state.foundResult[number] : this.state.notFoundResult[number]
        })

        this.props.shouldUpdateTrackingData(false)
    }

    handleChangeObjectStatusFormClose() {
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
                height:'60vh',
                overflowY:'scroll',
                boxShadow:'3px 3px 12px gray',
                padding:'0px',
                
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
                width: '3%'
                // background: 'rgb(227, 222, 222)',
                // height: 30,
                // width: 30,
            },
            middleText: {

                paddingLeft: 2,
                paddingRight: 2,

            },
            lastText: {
                // textAlign: 'right'
                width: '10%'
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
            <div style = {style.searchResult} className="hideScrollBar">
            {console.log(searchResult)}
                <div style={style.titleText}>
                    <Col md={11} xs={11} className="mx-1 d-flex justify-content-center">
                        <h4>Search Result</h4>
                    </Col>
                    
                        <button className="btn btn-lg btn-light" onClick={this.props.closeSearchResult} style={{background:'#DDDDDD', padding:'0px', width:'40px', height:'40px'}}>x</button>
                   
                </div>
                <Row className='d-flex justify-content-center mt-3' style={style.titleText}>
                    <h5> {searchResult.length} Devices Found </h5>
                </Row>

                <Row className='' >
                    {console.log(this.state.foundResult.length)}
                    {this.state.foundResult.length === 0
                    ?   <Col className='text-left' style={style.noResultDiv}>
                            <em>no searchResult</em>
                        </Col> 
                    
                    :   <Col className='hideScrollBar'>
                            <ListGroup onSelect={this.handleChangeObjectStatusForm}>
                                {this.state.foundResult.map((item,index) => {
                                    console.log('hello')
                                    let element = 
                                        <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={'found:' + index} key={index}>
                                            <Row className="d-flex justify-content-around">
                                                <Col lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
                                                <Col lg={3} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
                                                <Col lg={4} className="d-flex align-self-center text-muted" style={style.middleText}>ACN: xxxx-xxxx-{item.access_control_number.slice(10, 14)}</Col>
                                                <Col lg={3} className="d-flex align-self-center text-muted justify-content-center" style={style.lastText}>near {item.location_description}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    return element
                                })}
                            </ListGroup>
                        </Col> 
                       
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

// {this.state.notFoundResult.length !== 0 
//                 ? 
//                     <div>
//                         <Row className='d-flex justify-content-center mt-3 ' style={style.titleText}>
//                             <h5> {this.state.notFoundResult.length} Devices Not Found </h5>
//                         </Row>
//                         {/* <Row className='text-left mt-3' style={style.titleText}>
//                             <h5>Devices not found</h5>
//                         </Row> */}
//                         <Row style={style.notFoundResultDiv}>
//                             <Col className=''>
//                                 <ListGroup onSelect={this.handleChangeObjectStatusForm} className='overflow-auto hideScrollBar'>
//                                     {this.state.notFoundResult.map((item,index) => {
//                                         let element = 
//                                             <ListGroup.Item href={'#' + index} action style={style.listItem} className='searchResultList' eventKey={'notfound:' + index} key={index}>
//                                                 <Row className="d-flex justify-content-around">
//                                                     <Col lg={1} className="font-weight-bold d-flex align-self-center" style={style.firstText}>{index + 1}</Col>
//                                                     <Col lg={3} className="d-flex align-self-center justify-content-center" style={style.middleText}>{item.type}</Col>
//                                                     <Col lg={4} className="d-flex align-self-center text-muted" style={style.middleText}>ACN: xxxx-xxxx-{item.access_control_number.slice(10, 14)}</Col>
//                                                     <Col lg={3} className="d-flex align-self-center text-muted justify-content-center" style={style.lastText}>near {item.location_description}</Col>
//                                                 </Row>
//                                             </ListGroup.Item>
//                                         return element
//                                     })}
//                                 </ListGroup>
//                             </Col> 
//                         </Row>
//                     </div>
//                 : null}