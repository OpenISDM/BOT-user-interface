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

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            
            hasSearchKey: false,
            searchKey: '',
            searchableObjectData: [],
            searchResult: [],
            searchType: '',
            colorPanel: null,
            clearColorPanel: false,
            searchResultObjectTypeMap: {},
            closeSearchResult: false,
        }

        this.transferSearchableObjectData = this.transferSearchableObjectData.bind(this)
        this.transferSearchResult = this.transferSearchResult.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this);


    }


    /** Transfer the processed object tracking data from Surveillance to MainContainer */
    transferSearchableObjectData(processedData){
        this.setState({
            searchableObjectData: processedData
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
    }

    clearGridButtonBGColor() {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }


    handleClearButton(e) {
        this.clearGridButtonBGColor();
        console.log(this.state.closeSearchResult)
        if (e != 'not switch'){
            this.state.closeSearchResult = !this.state.closeSearchResult
        }
        
        this.setState({
            hasSearchKey: false,
            searchResult: [],
            colorPanel: null,
            clearColorPanel: true,
            searchResultObjectTypeMap: {},
            


            
        })
    }
    handleCloseSearchResult(){
        this.handleClearButton('not switch')
    }

    

    
    render(){

        const { hasSearchKey, searchResult, searchType, colorPanel, clearColorPanel } = this.state;

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
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResult={this.transferSearchResult}
                            hasSearchKey={this.state.hasSearchKey}
                            closeSearchResult = {this.state.closeSearchResult}

                            handleCloseSearchResult={this.handleClearButton}
                        />

                    </Col>
                </Row>
            </div>
            
        )
    }
}



                                