// npm packages
import React from 'react';
import { Col, Row} from 'react-bootstrap'

import LocaleContext from '../../context/LocaleContext';

// self-defined component
import Searchbar from '../presentational/Searchbar';
import FrequentSearch from './FrequentSearch';
import SearchableObjectType from '../presentational/SeachableObjectType';
// import SearchResult from '../presentational/SearchResultList';

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
            loginStatus: null,

            ShouldUpdateFrequentSearch: 0,
        }
        this.staticState = {
            objectTypeList: [],
        }
    }
    componentDidMount(){
        
    }
    // this function when the this.props change
    // In this function, if the searchableObjectData is changed, the layout will immediately change
    componentWillReceiveProps(nextProps){
        var state ={}
        let {objectTypeList, ShouldUpdate} = nextProps
        if( this.state.ShouldUpdate !== nextProps.ShouldUpdate){
            // this.APIforSearchableObjectType.setObjectList(objectTypeList)
            state = {
                ...state,
                objectTypeList: objectTypeList,
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
                    objectTypeList = {this.state.objectTypeList}
                    onSubmit={getSearchResult}
                />

            </Col>
        )  
    }
}

SearchContainer.contextType = LocaleContext;
export default SearchContainer;
