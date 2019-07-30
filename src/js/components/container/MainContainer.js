/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */

import 'react-table/react-table.css';
import '../../../css/MainContainer.css';
import SearchResult from '../presentational/SearchResultList'


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
            objectTypeList: [],
            IsShowResult: false,



            ShouldUpdateForProps: -1,
            ShouldUpdate: false,
            ShouldUpdateSearchResult: 0


        }
        this.handleClearButton = this.handleClearButton.bind(this);
        this.getSearchResult = this.getSearchResult.bind(this);

        this.transferSearchResult = this.transferSearchResult.bind(this)
        this.closeSearchResult = this.closeSearchResult.bind(this)


    }
    componentDidMount(){
        
        this.setState({
            searchableObjectData: this.props.route.searchableObjectData,
            loginStatus: this.props.route.loginStatus,
            objectTypeList: GetTypeKeyList(this.props.route.searchableObjectData),
            ShouldUpdateSearchResult: !this.state.ShouldUpdateSearchResult,
        })
    }
    componentWillUnmount(){
        
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     if(nextProps.route.ShouldUpdate !== this.state.ShouldUpdateForProps){
    //         return true
    //     }
    //     // if(this.state.ShouldUpdate !== nextState.ShouldUpdate){
    //     //     return true
    //     // }
    //     return false
    // }
    componentDidUpdate(preProps){

        if(this.props.route.ShouldUpdate !== this.state.ShouldUpdateForProps){
            this.setState({
                ShouldUpdateForProps: this.props.route.ShouldUpdate,

                searchableObjectData: this.props.route.searchableObjectData,
                loginStatus: this.props.route.loginStatus,
                objectTypeList: GetTypeKeyList(this.props.route.searchableObjectData),

                ShouldUpdateSearchResult: this.state.ShouldUpdateSearchResult + 1,
            })
        }
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
                ShouldUpdateSearchResult : this.state.ShouldUpdateSearchResult + 1
                
            })
        } else {

            this.clearGridButtonBGColor();
            this.setState({
                hasSearchKey: true,
                IsShowResult: true,
                searchKey: searchKey,
                searchResult: searchResult,
                colorPanel: null,
                clearColorPanel: true,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                ShouldUpdateSearchResult : this.state.ShouldUpdateSearchResult + 1
                
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
            IsShowResult: false,
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

    closeSearchResult(){


        this.handleClearButton()
        this.setState({
            IsShowResult: false,
            hasSearchKey: false,
            SearchResult:[],
            SearchKey:null,
            searchResultObjectTypeMap: {},
            ShouldUpdateSearchResult :  this.state.ShouldUpdateSearchResult + 1,
        })
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
            },
            

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
                            handleCloseSearchResult={this.handleClearButton}
                        />

                    </Col>

                </Row>
                
                    <SearchResult 
                        Show = {this.state.IsShowResult}
                        hasSearchKey = {this.state.hasSearchKey}
                        searchResult={this.state.searchResult}
                        transferSearchResult = {this.transferSearchResult}
                        closeSearchResult = {this.closeSearchResult}

                        shouldUpdateTrackingData = {this.props.route.shouldUpdateTrackingData}

                        ShouldUpdate={this.state.ShouldUpdateSearchResult}
                    />

            </div>
            
        )
    }
}

// 

                                