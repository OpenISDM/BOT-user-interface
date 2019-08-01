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

            ShouldUpdateSearchableObjectType: 0,

            ShouldUpdate: 0
        }

        // this.SearchIndexMouseOver = this.SearchIndexMouseOver.bind(this);
        // this.SearchIndexMouseLeave = this.SearchIndexMouseLeave.bind(this);


        this.getShowSectionState = this.getShowSectionState.bind(this)
        // this.getResultData = this.getResultData.bind(this);
      
        this.closeSearchResult = this.closeSearchResult.bind(this);
        this.clickButtonHandler = this.clickButtonHandler.bind(this);

    }

    

    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps, nextState){
        return true
    }
    // this function when the this.props change or you call this.setState() function
    // In this function, if the searchableObjectData is changed, the layout will immediately change
    componentDidUpdate(prepProps, prevState){

        

        

    }
    componentWillReceiveProps(nextProps, nextState){
        console.log('Receive')
        // console.log(this.props.searchableObjectData)
        var state ={}
        // console.log(this.state.ShouldUpdate)
        if( this.state.ShouldUpdate !== nextProps.ShouldUpdate){
            state.searchableObjectData = nextProps.searchableObjectData
            state.objectTypeList = nextProps.objectTypeList
            state.ShouldUpdateSearchableObjectType = this.state.ShouldUpdateSearchableObjectType + 1
            state.ShouldUpdate = nextProps.ShouldUpdate
        }
        if(!_.isEqual(this.state.searchResult, nextProps.searchResult)){
            state.searchResult = nextProps.searchResult
        }
        if(this.state.IsShowResult !== nextProps.IsShowResult){
            state.IsShowResult = nextProps.IsShowResult
        }
        if(state.length!== {}){
            this.setState(state)
        }
    }
    // // when the mouse hover the section Index List (Alphabet List), the section Title List will appear
    // SearchIndexMouseOver(e){

    //     let text = e.target.name;


    //     location.href = '#' + text;

    //     this.setState({
    //         sectionTitleData: this.state.sectionTitleList,
    //         IsFirstUpdate:true,
    //         IsShowSection: true,
    //         changeState: !this.state.changeState
    //     })
    // }

    // SearchIndexMouseLeave(e){

    //     this.setState({
    //         IsShowSection:false,
    //         changeState: !this.state.changeState
    //     })
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

    getSearchResultfromSearchableObjectType(e){
        this.props.getSearchResult(e)

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
                    

                    <SearchableObjectType
                        Show = {this.state.IsShowSection}
                        objectTypeList = {this.state.objectTypeList}
                        getResultData = {this.props.getSearchResult}
                        ShouldUpdate = {this.state.ShouldUpdateSearchableObjectType}
                    />

                   
                </div>
            </Row>

        )
            
        
    }
}

SearchContainer.contextType = LocaleContext;
export default SearchContainer;
