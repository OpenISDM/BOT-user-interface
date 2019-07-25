// npm packages
import React from 'react';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import LocaleContext from '../../context/LocaleContext';

// self-defined component
import Searchbar from '../presentational/Searchbar';
import FrequentSearch from './FrequentSearch';

import SearchableObjectType from '../presentational/SeachableObjectType';
import SearchResult from '../presentational/SearchResultList';

import Cookies from 'js-cookie'

import GetResultData from '../../functions/GetResultData'
/*
    In the SearchContainer, there are three components
        1. SearchBar
        2. FrequentSearch
        3. SearchableObjectType
*/




class SearchContainer extends React.Component {

    constructor(){
        super()
        this.state = {

            hasSearchKey: false,
            objectTypeList: [],

            searchableObjectData:{},
            searchResult:{},

            IsShowSection:false,
            IsShowResult:false,
            ShouldUpdate:true,

            loginStatus: null,


        }

        this.SearchIndexMouseOver = this.SearchIndexMouseOver.bind(this);
        this.SearchIndexMouseLeave = this.SearchIndexMouseLeave.bind(this);


        this.getShowSectionState = this.getShowSectionState.bind(this)
        // this.getResultData = this.getResultData.bind(this);
      
        this.closeSearchResult = this.closeSearchResult.bind(this);
        this.clickButtonHandler = this.clickButtonHandler.bind(this);

    }

    

    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.props.loginStatus !== this.state.loginStatus){
            return true
        }
        
        if(this.props.objectTypeList !== this.state.objectTypeList){

            return true
        }
        if(nextProps.hasSearchKey !== this.state.IsShowResult){
            return true
        }
        if(this.state.changeState !== nextState.changeState){
            return true
        }
        if(nextProps.searchResult !== this.state.searchResult){
            return true
        }
        if(nextProps.searchableObjectData.length !== this.state.searchableObjectData.length){
            return true
        }
        return false
    }
    // this function when the this.props change or you call this.setState() function
    // In this function, if the searchableObjectData is changed, the layout will immediately change
    componentDidUpdate(prepProps, prevState){


        this.setState({
            loginStatus: this.props.loginStatus,
            objectTypeList: this.props.objectTypeList,
            searchResult: this.props.searchResult,
            searchableObjectData: this.props.searchableObjectData,
            IsShowResult: this.props.hasSearchKey
        })

    }
    // when the mouse hover the section Index List (Alphabet List), the section Title List will appear
    SearchIndexMouseOver(e){

        let text = e.target.name;


        location.href = '#' + text;

        this.setState({
            sectionTitleData: this.state.sectionTitleList,
            IsFirstUpdate:true,
            IsShowSection: true,
            changeState: !this.state.changeState
        })
    }

    SearchIndexMouseLeave(e){

        this.setState({
            IsShowSection:false,
            changeState: !this.state.changeState
        })
    }


    
    // async getResultData(e) {
    //     var searchResult = [];
    //     var SearchKey = '';
    //     console.log('searchResult')
    //     searchResult = await GetResultData(e, this.state.searchableObjectData)
    //     console.log('searchResult')
    //     this.setState({
    //         IsShowSection:false,
    //         searchResult: searchResult,
    //         IsShowResult: true,
    //         changeState: !this.state.changeState
    //     })
    //     console.log(searchResult)
    //     this.props.transferSearchResult(searchResult, null, SearchKey)

    // }


    closeSearchResult(e){

        this.props.handleCloseSearchResult()
        this.setState({
            IsShowResult: false,
            IsShowSection: false,
            changeState: !this.state.changeState,
        })

    }
    clickButtonHandler(){
        this.setState({
            IsShowResult: true,
            IsShowSection: false,
            changeState: !this.state.changeState,
        })
    }
    getShowSectionState(state){



        this.setState({
            IsShowSection: state,
            changeState: !this.state.changeState,
        })
        
    }
    render() {
        /** Customized CSS of searchResult */
        const locale = this.context;
        let {searchableObjectData} = this.state;
        let transferSearchResult = this.props.transferSearchResult

        const style = {
            SearchList:{
                height: '80vh',
            },
            
            FrequentSearch:{
                height: '80vh',

                zIndex: 1,

                background:'#FFFFFF',
                
                float: 'left', 

                position:'absolute',

                left: '3%'
            }, 
            SearchResult:{
                height: '80vh',

                display: (this.state.IsShowResult)?'block':'none',

                zIndex: (this.state.IsShowResult)?1002:0,

                background:'#FFFFFF',
                
                float: 'right', 

                

                position:'absolute',
            }
        }
        
        return (
            <Row>


                <Row className='col-12 mx-2 d-flex justify-content-center'>
                    <div  className='col-xs-12 col-md-9 mx-2 d-flex justify-content-center'>
                        <div id='searchBar' className='d-flex justify-content-center align-items-center pt-4 pb-2 mx-3'>
                            <Searchbar 
                                placeholder={this.state.SearchKey}
                                getResultData={this.props.getSearchResult}  
                                clickButtonHandler = {this.clickButtonHandler}  
                            />
                            
                        </div>
                    </div>
                </Row>
                <div id="searchList"  className="col-md-12 col-sm-12 px-0" style={style.SearchList}>
                    <Col id='FrequentSearch' sm={10} xs={10} className=' mx-1 px-0 float-left' style = {style.FrequentSearch} >
                        <FrequentSearch 
                            getResultData={this.props.getSearchResult}
                            clickButtonHandler = {this.clickButtonHandler}
                        />
                    </Col>
                    <Col id='searchableObjectType' md={12} sm={12} xs={12} className='mx-0 px-0 float-right' style={{zIndex: (this.state.IsShowSection)?1003:0}}>

                        <SearchableObjectType
                            handleMouseLeave = {this.state.handleMouseLeave}
                            sectionTitleData = {this.state.objectTypeList}
                            getShowSectionState = {this.getShowSectionState}
                            getResultData = {this.props.getSearchResult}
                            clickButtonHandler = {this.clickButtonHandler}
                        />
                    </Col> 

                    <div id="searchResult" md={12} sm={12} xs={12} className='m-2 px-0' style={style.SearchResult} onMouseLeave={this.SearchResultMouseLeave}>
                        <SearchResult 
                            hasSearchKey = {this.state.hasSearchKey}
                            transferSearchResult = {this.props.transferSearchResult}
                            closeSearchResult = {this.closeSearchResult}
                            searchResult={this.state.searchResult}
                        />
                    </div>
                </div>
            </Row>

        )
            
        
    }
}

SearchContainer.contextType = LocaleContext;
export default SearchContainer;