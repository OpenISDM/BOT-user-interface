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
            <Col id="seachSection"  className="w-100" style={{ position: 'relative'}}>
            {console.log(this.props.floatUp)}
                <div className="bg-white w-100 m-1"style={{zIndex: this.props.floatUp? 1070 : 1, position: 'absolute', height: '80vh', borderRadius: '3%', right: '1%'}}>
                    <Row className='col-12 mx-3 d-flex justify-content-center ' >
                            <div id='searchBar' className='d-flex justify-content-center align-items-center pt-4 pb-2 mx-3'  >
                                <Searchbar 
                                    placeholder={SearchKey}
                                    getResultData={getSearchResult} 
                                />
                            </div>
                    </Row>
                    <FrequentSearch 
                        getResultData={getSearchResult}
                        ShouldUpdate = {ShouldUpdateFrequentSearch}
                    />
                </div>
                <SearchableObjectType
                    floatUp = {this.props.floatUp}
                    Show = {IsShowSearchableObjectTypeList}
                    objectTypeList = {objectTypeList}
                    getResultData = {getSearchResult}
                    ShouldUpdate = {ShouldUpdateSearchableObjectType}
                />

            </Col>
        )  
    }
}

SearchContainer.contextType = LocaleContext;
export default SearchContainer;
