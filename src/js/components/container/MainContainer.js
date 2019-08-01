/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */
import { retrieveTrackingData } from '../../action/action';
import { connect } from 'react-redux';
import  UuidToLocation from '../../functions/UuidToLocation'
import  GetTimeStampDifference from '../../functions/GetTimeStampDifference'

import config from '../../config';

import dataSrc from '../../dataSrc';

import 'react-table/react-table.css';
import '../../../css/MainContainer.css';
import SearchResult from '../presentational/SearchResultList'

import axios from 'axios'
import moment from 'moment'

import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';
import GridButton from './GridButton';
import { Alert } from 'react-bootstrap';

import GetResultData from '../../functions/GetResultData'
import GetTypeKeyList from '../../functions/GetTypeKeyList'

class ContentContainer extends React.Component{

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
            ShouldUpdateSearchResult: 0,
            ShouldUpdateSearchContainer: 0


        }
        this.handleClearButton = this.handleClearButton.bind(this);
        this.getSearchResult = this.getSearchResult.bind(this);

        this.transferSearchResult = this.transferSearchResult.bind(this)
        this.closeSearchResult = this.closeSearchResult.bind(this)

        this.shouldUpdateTrackingData = this.shouldUpdateTrackingData.bind(this)
        this.getTrackingData = this.getTrackingData.bind(this)

        this.handleSearchSection= this.handleSearchSection.bind(this)
    }
    componentDidMount(){
        this.interval = setInterval(this.getTrackingData, config.surveillanceMap.intevalTime, true)
        this.getTrackingData(true)
        this.setState({
            loginStatus: this.props.route.loginStatus,

            objectTypeList: GetTypeKeyList(this.props.route.searchableObjectData),

        })
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }

    componentDidUpdate(preProps, prevState){
        // console.log(this.state.ShouldUpdateSearchContainer)
        if(this.state.ShouldUpdate !== prevState.ShouldUpdate){
            this.setState({

            })
        }
        if(this.props.route.ShouldUpdate !== this.state.ShouldUpdateForProps){
            this.setState({
                ShouldUpdateForProps: this.props.route.ShouldUpdate,

                // searchableObjectData: this.props.route.searchableObjectData,
                loginStatus: this.props.route.loginStatus,
                objectTypeList: GetTypeKeyList(this.state.searchableObjectData),


            })
        }
    }

    getTrackingData(update) {
        console.log('update')
        var ShouldUpdate = false
        axios.get(dataSrc.trackingData).then(res => {
            var data = res.data.map((item) =>{
                delete item['rssi']
                return item
            })
            // console.log(data)
            for(var i in  data){

                var a = data[i]
                var b = this.state.searchableObjectData[i]
                if(a && b){
                    if(a.name === b.name &&
                        a.mac_address === b.mac_address &&
                        a.status === b.status
                        ){
                        
                    }else{
                        ShouldUpdate = true
                    }
                }
                
            }
            // console.log(this.state.searchableObjectData=== [])
            this.props.retrieveTrackingData(res.data)
            if(ShouldUpdate || this.state.searchableObjectData.length === 0){
                var state = {
                    searchableObjectData: data,
                    objectTypeList: GetTypeKeyList(data),
                    ShouldUpdate: this.state.ShouldUpdate + 1,
                    ShouldUpdateSearchContainer: this.state.ShouldUpdateSearchContainer + 1,
                    ShouldUpdateSearchResult: this.state.ShouldUpdateSearchResult + 1,
                }

                if(update === false){
                    return state
                }else{
                    this.setState(state)
                }
                console.log('uppppp')

            }else{console.log('no update')}
            

            

        })
        .catch(error => {
            console.log(error)
        })
    }

    async shouldUpdateTrackingData(){
        var state = await this.getTrackingData(true)
        
        var searchResult = await this.getSearchResult(this.state.searchKey)


        this.setState({
            ...state,
            searchResult: searchResult,
        })

        
    }
    /**  the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer
    */
    transferSearchResult(searchResult, colorPanel, searchKey, update) {

        let searchResultObjectTypeMap = {}
        searchResult.map( item => {
            if (!(item.type in searchResultObjectTypeMap)){
                searchResultObjectTypeMap[item.type] = 1
            } else {
                searchResultObjectTypeMap[item.type] = searchResultObjectTypeMap[item.type] + 1
            }
        })
        this.clearGridButtonBGColor();
        var state = {
            hasSearchKey: true,
            IsShowResult: true,
            searchKey: searchKey,
            searchResult: searchResult,
            colorPanel: null,
            clearColorPanel: true,
            searchResultObjectTypeMap: searchResultObjectTypeMap, 
            ShouldUpdateSearchResult : this.state.ShouldUpdateSearchResult + 1,
            changeState: ! this.state.changeState
            
        }
        if(!update){
            return state
        }else{
            this.setState(state)
        }
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

        var searchResult = await GetResultData(e, this.state.searchableObjectData)

        return searchResult
    }

    async handleSearchSection(e){
        var searchResult = await this.getSearchResult(e)
        this.transferSearchResult(searchResult, null, e, true)

        
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
                            getSearchResult={this.handleSearchSection}
                            loginStatus={loginStatus}
                            searchableObjectData={this.state.searchableObjectData}
                            searchResult = {this.state.searchResult} 
                            transferSearchResult={this.transferSearchResult}
                            hasSearchKey={this.state.hasSearchKey}
                            closeSearchResult = {this.state.closeSearchResult}
                            objectTypeList = {this.state.objectTypeList}
                            handleCloseSearchResult={this.handleClearButton}

                            ShouldUpdate={this.state.ShouldUpdateSearchContainer}
                        />

                    </Col>

                </Row>
                
                    <SearchResult 
                        Show = {this.state.IsShowResult}
                        hasSearchKey = {this.state.hasSearchKey}
                        searchResult={this.state.searchResult}
                        transferSearchResult = {this.transferSearchResult}
                        closeSearchResult = {this.closeSearchResult}

                        UpdateTrackingData = {this.shouldUpdateTrackingData}

                        ShouldUpdate={this.state.ShouldUpdateSearchResult}
                    />

            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
        locationAccuracy: state.retrieveTrackingData.locationAccuracy
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        retrieveTrackingData: object => dispatch(retrieveTrackingData(object)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)

                                