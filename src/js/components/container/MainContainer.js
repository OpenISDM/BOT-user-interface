/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */

import 'react-table/react-table.css';
import '../../../css/MainContainer.css';
import SearchResult from '../presentational/SearchResult'


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';
import GridButton from './GridButton';
import { Alert } from 'react-bootstrap';

import GetResultData from '../../functions/GetResultData'
import GetTypeKeyList from '../../functions/GetTypeKeyList'

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            timer: null,
            hasSearchKey: false,
            searchKey: '',
            searchableObjectData: [],
            searchResult: [],
            searchType: '',
            colorPanel: null,
            clearColorPanel: false,
            searchResultObjectTypeMap: {},
            closeSearchResult: false,
            loginStatus: null,
            changeState: false,
            objectTypeList: []
        }
        this.handleClearButton = this.handleClearButton.bind(this);
        this.getSearchResult = this.getSearchResult.bind(this);

        this.transferSearchResult = this.transferSearchResult.bind(this)


    }
    componentDidMount(){
        var intervalId = setInterval(this.getTracking, 1000);
        this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.route.searchableObjectData.length !== this.state.searchableObjectData.length){
            return true
        }
        if(nextProps.route.loginStatus !== this.state.loginStatus){
            return true
        }
        if(this.state.changeState !== nextState.changeState){
            return true
        }
        return false
    }
    componentDidUpdate(preProps){

        this.setState({
            searchableObjectData: this.props.route.searchableObjectData,
            loginStatus: this.props.route.loginStatus,
            objectTypeList: GetTypeKeyList(this.props.route.searchableObjectData)
        })
    }




    /**  the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer
    */
    transferSearchResult(searchResult, colorPanel, searchKey) {
        let searchResultObjectTypeMap = {}
        searchResult.map( item => {
            if (!(item.type in searchResultObjectTypeMap)){
                searchResultObjectTypeMap[item.type] = 1
            } else {
                searchResultObjectTypeMap[item.type] = searchResultObjectTypeMap[item.type] + 1
            }
        })
        if(colorPanel) {
            this.setState({
                hasSearchKey: colorPanel.size === 0 ? false : true,
                searchResult: searchResult,
                colorPanel: colorPanel,
                clearColorPanel: false,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                
            })
        } else {

            this.clearGridButtonBGColor();
            this.setState({
                hasSearchKey: true,
                searchKey: searchKey,
                searchResult: searchResult,
                colorPanel: null,
                clearColorPanel: true,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                
            })
        }
        this.setState({
            changeState: ! this.state.changeState
        })
    }

    clearGridButtonBGColor() {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }


    handleClearButton(e) {
        this.clearGridButtonBGColor();
        if (e != 'not switch'){
            this.state.closeSearchResult = !this.state.closeSearchResult
        }
        
        this.setState({
            hasSearchKey: false,
            searchResult: [],
            colorPanel: null,
            clearColorPanel: true,
            searchResultObjectTypeMap: {},
            changeState: !this.state.changeState        
        })
    }
    handleCloseSearchResult(){
        this.handleClearButton('not switch')
    }

    async getSearchResult(e){

        var searchResult = [];
        var SearchKey = e;
        searchResult = await GetResultData(e, this.state.searchableObjectData)
        this.transferSearchResult(searchResult, null, SearchKey)
    }

    

    
    render(){

        const { hasSearchKey, searchResult, searchType, colorPanel, clearColorPanel, loginStatus } = this.state;

        const style = {
            container: {
                height: '92vh'
            },
            searchResult: {
                display: this.state.hasSearchKey ? null : 'none',
                paddingTop: 30,
            },
            alertText: {
                fontWeight: '700'
            }

        }
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='' >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 px-0 overflow-hidden' style={style.container}>
                    
                    <Col id="SurveillanceSection"sm={8} md={8} lg={8} xl={8}>
                        <br/>
                        <SurveillanceContainer 
                            hasSearchKey={hasSearchKey} 
                            searchResult={searchResult}
                            searchableObjectData = {this.state.searchableObjectData}
                            transferSearchableObjectData={this.transferSearchableObjectData}
                            searchType={searchType}
                            colorPanel={colorPanel}
                            handleClearButton={this.handleClearButton}
                            transferSearchResult={this.transferSearchResult}
                            clearColorPanel={clearColorPanel}

                        />
                    </Col>
                    
                    <Col id="seachSection" xs={12} sm={12} md={12} lg={4} xl={4} className="w-100 px-0 mx-0">

                        <SearchContainer 
                            getSearchResult={this.getSearchResult}
                            loginStatus={loginStatus}
                            searchableObjectData={this.state.searchableObjectData}
                            searchResult = {this.state.searchResult} 
                            transferSearchResult={this.transferSearchResult}
                            hasSearchKey={this.state.hasSearchKey}
                            closeSearchResult = {this.state.closeSearchResult}
                            objectTypeList = {this.state.objectTypeList}
                            searchResult = {this.state.searchResult}
                            handleCloseSearchResult={this.handleClearButton}
                        />

                    </Col>
                </Row>


            </div>
            
        )
    }
}



                                