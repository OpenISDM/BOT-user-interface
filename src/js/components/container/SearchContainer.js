// npm packages
import React from 'react';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import LocaleContext from '../../context/LocaleContext';

// self-defined component
import Searchbar from '../presentational/Searchbar';
import FrequentSearch from './FrequentSearch';

import SearchableObjectType from '../presentational/SeachableObjectType';
// import SearchResult from '../presentational/SearchResultList';

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

            objectTypeList: [],

            loginStatus: null,

            ShouldUpdateFrequentSearch: 0,
            ShouldUpdateSearchableObjectType: 0,
        }
    }
    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps, nextState){
        return true
    }
    // this function when the this.props change
    // In this function, if the searchableObjectData is changed, the layout will immediately change
    componentWillReceiveProps(nextProps){
        var state ={}
        let {searchableObjectData, objectTypeList, ShouldUpdate} = nextProps
        if( this.state.ShouldUpdate !== nextProps.ShouldUpdate){
            state = {
                ...state,
                searchableObjectData: searchableObjectData,
                objectTypeList: objectTypeList,
                ShouldUpdateSearchableObjectType: this.state.ShouldUpdateSearchableObjectType + 1,
                ShouldUpdate: ShouldUpdate,
            }
        }
        if(state.length!== {}){
            this.setState(state)
        }
    }
    render() {
        /** Customized CSS of searchResult */
        const locale = this.context;
        let {
                ShouldUpdateSearchableObjectType, 
                IsShowSearchableObjectTypeList,
                ShouldUpdateFrequentSearch, 
                objectTypeList, 
                SearchKey, 
            } = this.state;

        let {getSearchResult} = this.props

        const style = {
            SearchList:{
                height: '80vh',
            },
        }
        
        return (
            <Row >
                <Row className='col-12 mx-3 d-flex justify-content-center ' >
                        <div id='searchBar' className='d-flex justify-content-center align-items-center pt-4 pb-2 mx-3'  >
                            <Searchbar 
                                placeholder={SearchKey}
                                getResultData={getSearchResult} 
                            />
                        </div>
                </Row>
                <div id="searchList"  className="col-md-12 col-sm-12 px-0" style={style.SearchList}>
                    <FrequentSearch 
                        getResultData={getSearchResult}
                        ShouldUpdate = {ShouldUpdateFrequentSearch}
                    />
                    <SearchableObjectType
                        Show = {IsShowSearchableObjectTypeList}
                        objectTypeList = {objectTypeList}
                        getResultData = {getSearchResult}
                        ShouldUpdate = {ShouldUpdateSearchableObjectType}
                    />
                </div>
            </Row>
        )  
    }
}

SearchContainer.contextType = LocaleContext;
export default SearchContainer;
