// npm packages
import React from 'react';
import { Col, Row, Nav, ListGroup} from 'react-bootstrap'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import LocaleContext from '../../context/LocaleContext';

// self-defined component
import Searchbar from '../presentational/Searchbar';
import FrequentSearch from './FrequentSearch';

import SearchableObjectType from '../presentational/SeachableObjectType';
import SearchResult from '../presentational/SearchResult';

import Cookies from 'js-cookie'


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
            sectionIndexList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            sectionTitleList:{},
            sectionTitleData:[],
            hasIndexItem:{},

            searchableObjectData:{},
            searchResult:{},

            IsShowSection:false,
            IsShowResult:false,
            IsFirstUpdate:false,


        }

        this.SearchIndexMouseOver = this.SearchIndexMouseOver.bind(this);
        this.SearchIndexMouseLeave = this.SearchIndexMouseLeave.bind(this);



        this.getResultData = this.getResultData.bind(this);
      
        this.closeSearchResult = this.closeSearchResult.bind(this);

    }

    

    componentDidMount(){
        
    }
    // this function when the this.props change or you call this.setState() function
    // In this function, if the searchableObjectData is changed, the layout will immediately change
    componentDidUpdate(prepProps, prevState){
       
        
        
        if(this.props.searchableObjectData !=null && !this.state.AlreadyUpdate && this.props.searchableObjectData.length != prepProps.searchableObjectData.length){

            var sectionTitleList = {},
            hasIndexItem = [];
            for(var i in this.state.sectionIndexList){
                sectionTitleList[this.state.sectionIndexList[i]] = new Set();
                hasIndexItem[this.state.sectionIndexList[i]] = false;
            }
            const searchableObjectData = this.props.searchableObjectData;
            // classify based on first alphabet
            for(var i in searchableObjectData){

                let Type = searchableObjectData[i].type[0].toUpperCase();

                sectionTitleList[Type].add(searchableObjectData[i].type)
                hasIndexItem[Type]= true
            }

            
            // update the state of the component
            this.setState({
                hasIndexItem : hasIndexItem,
                sectionTitleList : sectionTitleList,
            })

            this.state.AlreadyUpdate = true;
            this.state.searchableObjectData = searchableObjectData;

        }

        if(this.props.closeSearchResult != prepProps.closeSearchResult){
            this.setState({
                IsShowResult: false,
                IsShowSection: false,
            })
        }


    }
    // when the mouse hover the section Index List (Alphabet List), the section Title List will appear
    SearchIndexMouseOver(e){

        let text = e.target.name;


        location.href = '#' + text;

        this.setState({
            sectionTitleData: this.state.sectionTitleList,
            IsFirstUpdate:true,
            IsShowSection: true,
        })
    }

    SearchIndexMouseLeave(e){

        this.setState({
            IsShowSection:false,
        })
    }


    
    getResultData(e) {
        var searchResult = [];
        var SearchKey = '';
        if(typeof e === 'string'){
            // for frequent search

            SearchKey = e;

            if(SearchKey === 'all devices'){
                // print(SearchKey)
                for( var  i in this.state.searchableObjectData){  
                    searchResult.push(this.state.searchableObjectData[i])
                }
            }else{
                for( var  i in this.state.searchableObjectData){
                    if(this.state.searchableObjectData[i].type.toUpperCase() === SearchKey.toUpperCase()){
                        searchResult.push(this.state.searchableObjectData[i])
                    }
                }
            
            }
            
        }else if(e.target){
            //  for section List Search
            SearchKey = e.target.innerHTML;
            for( var  i in this.state.searchableObjectData){
                if(this.state.searchableObjectData[i].type.toUpperCase() === SearchKey.toUpperCase()){
                    searchResult.push(this.state.searchableObjectData[i])
                }
            }

        }else{
            //  for my device (SSID)
            SearchKey = e
            
            for( var  i in this.state.searchableObjectData){
                if(SearchKey.has(this.state.searchableObjectData[i].access_control_number)){
                    searchResult.push(this.state.searchableObjectData[i])
                }
            }
        }



        this.setState({
            IsShowSection:false,
            searchResult: searchResult,
            IsShowResult: true,
        })

        this.props.transferSearchResult(searchResult, null, SearchKey)
        
    }


    closeSearchResult(e){

        this.props.handleCloseSearchResult()
        this.setState({
            IsShowResult: false,
            IsShowSection: false,
        })

    }
    render() {
        /** Customized CSS of searchResult */
        const locale = this.context;
        let {searchableObjectData} = this.state;
        let transferSearchResult = this.props.transferSearchResult

        const style = {
            SearchList:{
                height: '70vh',
            },
            SearchableObjectType:{
                height: '70vh',

                zIndex: (this.state.IsShowSection)?1003:0,



                float: 'right', 

                position:'absolute',


                
            },
            FrequentSearch:{
                height: '70vh',

                zIndex: 1,

                background:'#FFFFFF',
                
                float: 'left', 

                position:'absolute',
            }, 
            SearchResult:{
                height: '70vh',

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
                                getResultData={this.getResultData}    
                            />
                            
                        </div>
                    </div>
                </Row>
                <div id="searchList"  className="col-md-12 col-sm-12 px-0" style={style.SearchList}>
                    <Col id='FrequentSearch' xl={10} lg={10} md={11} sm={10} xs={10} className=' mx-1 px-0' style = {style.FrequentSearch} >
                        <FrequentSearch 
                            SingIn = {this.state.SignIn}
                            searchableObjectData={searchableObjectData}
                            getResultData={this.getResultData}  
                            transferSearchResult={transferSearchResult}  
                            getResultData={this.getResultData}    
                        />
                    </Col>
                    <Col id='searchableObjectType' md={12} sm={12} xs={12} className='mx-0 px-0' style = {style.SearchableObjectType}>
                        <SearchableObjectType
                            sectionIndexList = {this.state.sectionIndexList}
                            sectionTitleData = {this.state.sectionTitleData}
                            IsShowSection = {this.state.IsShowSection}
                            hasIndexItem = {this.state.hasIndexItem}
                            handleMouseLeave = {this.SearchIndexMouseLeave}
                            handleMouseOver = {this.SearchIndexMouseOver}
                            getResultData = {this.getResultData}
                        />
                    </Col> 
                    <div id="searchResult" md={12} sm={12} xs={12} className='m-2 px-0' style={style.SearchResult} onMouseLeave={this.SearchResultMouseLeave}>
                        <SearchResult 
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