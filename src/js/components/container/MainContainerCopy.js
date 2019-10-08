import React from 'react';
import SearchContainer from './SearchContainer';
import 'react-table/react-table.css';
import SearchResultList from '../presentational/SearchResultList'
import { Row, Col } from 'react-bootstrap'
import SurveillanceContainer from './SurveillanceContainer';
import { connect } from 'react-redux'
import config from '../../config';
import InfoPrompt from '../presentational/InfoPrompt';
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios';
import dataSrc from '../../dataSrc'
import { AppContext } from '../../context/AppContext'

const myDevices = config.frequentSearchOption.MY_DEVICES ;
const allDevices = config.frequentSearchOption.ALL_DEVICES;

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        proccessedTrackingData: [],
        hasSearchKey: false,
        searchKey: '',
        searchResult: [],
        colorPanel: null,
        clearColorPanel: false,
        searchResultObjectTypeMap: {},
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        rssiThreshold: window.innerWidth < 600 
            ? config.surveillanceMap.locationAccuracyMapToDefault[0]
            : config.surveillanceMap.locationAccuracyMapToDefault[1],
        auth: this.context.auth,
        area: this.context.auth.authenticated ? this.context.auth.user.area : config.surveillanceMap.defaultArea
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, prevState.trackingData))
        if (isTrackingDataChange && this.state.hasSearchKey) {
            this.handleRefreshSearchResult()
        }
        if (!(_.isEqual(prevState.auth, this.context.auth))) {
            this.getTrackingData()
            this.setState({
                auth: this.context.auth,
                area: this.context.auth.user.area
            })
        } 
    }

    shouldComponentUpdate = (nextProps,nextState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, nextState.trackingData))
        let hasSearchKey = nextState.hasSearchKey !== this.state.hasSearchKey
        let isSearchKeyChange = this.state.searchKey !== nextState.searchKey
        let isSearchResultChange = !(_.isEqual(this.state.searchResult, nextState.searchResult))
        let isStateChange = !(_.isEqual(this.state, nextState))
        let isHighlightSearchPanelChange = !(_.isEqual(this.state.isHighlightSearchPanel, nextState.isHighlightSearchPanel))
        let shouldUpdate = isTrackingDataChange || 
                                hasSearchKey || 
                                isSearchKeyChange || 
                                isSearchResultChange || 
                                isHighlightSearchPanelChange
        // console.log(shouldUpdate)
        // console.log(JSON.stringify(this.state.trackingData)[0] === JSON.stringify(nextState.trackingData)[0])
        // console.log(JSON.stringify(this.state.trackingData[1]) === JSON.stringify(nextState.trackingData[1]))
        // console.log(JSON.stringify(this.state.trackingData[1]), JSON.stringify(nextState.trackingData[1]))

        return shouldUpdate
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    handleRefreshSearchResult = () => {
        let { searchKey, colorPanel, searchValue } = this.state
        this.getSearchKey(searchKey, colorPanel, searchValue)
    }

    changeLocationAccuracy = (locationAccuracy) => {
        const rssiThreshold = config.surveillanceMap.locationAccuracyMapToDefault[locationAccuracy]
        this.setState({
            rssiThreshold
        })
    }

    changeArea = (area) => {
        this.getTrackingData(area)
        this.setState({
            area, 
        })
    }

    getTrackingData = (area = this.state.area, func) => {
        let { auth, locale } = this.context
        axios.post(dataSrc.getTrackingData,{
            rssiThreshold: this.state.rssiThreshold,
            locale: locale.abbr,
            user: auth.user,
            area: area,
            func: 'track'
        })
        .then(res => {
            const trackingData = this.handleRawTrackingData(res.data.rows)
            this.setState({
                trackingData,
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleRawTrackingData = (rawTrackingData) => {
        const trackingData = rawTrackingData.map(item => {

            /** Set the object's location in the form of lbeacon coordinate parsing by lbeacon uuid  */
            const lbeaconCoordinate = item.lbeacon_uuid ? this.createLbeaconCoordinate(item.lbeacon_uuid) : null;
            item.currentPosition = lbeaconCoordinate

            delete item.lbeacon_uuid

            return item
        })
        return trackingData
    }

    /** Parsing the lbeacon's location coordinate from lbeacon_uuid*/
    createLbeaconCoordinate = (lbeacon_uuid) => {
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx];
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer */
    processSearchResult = (searchResult, colorPanel, searchKey, searchValue) => {
        /** Count the number of found object type */
        let duplicateSearchKey = []

        if (typeof searchKey !== 'string') {
            duplicateSearchKey = [...searchKey]
        }

        duplicateSearchKey.filter(key => {
            return key !== 'all devices' || key !== 'my devices'
        })
        let searchResultObjectTypeMap = searchResult
            .filter(item => item.found)
            .reduce((allObjectTypes, item) => {
                if (item.type in allObjectTypes) allObjectTypes[item.type]++
                else {
                    allObjectTypes[item.type] = 1
                    let index = duplicateSearchKey.indexOf(item.type)
                    if (index > -1) {
                        duplicateSearchKey.splice(index, 1)
                    }
                }
                return allObjectTypes
        }, {})

        duplicateSearchKey.map(key => searchResultObjectTypeMap[key] = 0)
        if(colorPanel) {
            this.setState({
                hasSearchKey: Object.keys(colorPanel).length === 0 ? false : true,
                searchResult: searchResult,
                searchKey,
                colorPanel: colorPanel,
                clearColorPanel: false,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                clearSearchResult: false,
                hasGridButton: true,
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
                clearSearchResult: false,
                hasGridButton: false,
                searchValue
            })
        }
    }

    clearGridButtonBGColor = () => {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }

    handleClearButton = () => {
        this.clearGridButtonBGColor();
        this.setState({
            hasSearchKey: false,
            searchResult: [],
            colorPanel: null,
            clearColorPanel: true,
            searchResultObjectTypeMap: {},
            clearSearchResult: this.state.hasSearchKey ? true : false,
            proccessedTrackingData: []
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = (searchKey, colorPanel = null, searchValue = null) => {
        const searchResult = this.getResultBySearchKey(searchKey, colorPanel, searchValue)
        this.processSearchResult(searchResult, colorPanel, searchKey, searchValue)
    }

    getResultBySearchKey = (searchKey, colorPanel, searchValue) => {
        let searchResult = [];
        let { auth } = this.context
        let proccessedTrackingData = _.cloneDeep(this.state.trackingData)
        if (searchKey === myDevices) {
            const devicesAccessControlNumber = auth.user.myDevice || []
            proccessedTrackingData.map(item => {
                if (devicesAccessControlNumber.includes(item.access_control_number)) {
                    item.searched = true;
                    searchResult.push(item)
                }
            })
        } else if (searchKey === allDevices) {
            searchResult = proccessedTrackingData.map(item => {
                item.searched = true
                return item
            })
        } else if (searchKey === 'coordinate') {
            searchResult = this.collectObjectsByLatLng(searchValue,proccessedTrackingData)
        } else if (typeof searchKey === 'object') {
            proccessedTrackingData.map(item => {
                if (searchKey.includes(item.type)) {
                    item.searched = true;
                    item.pinColor = colorPanel[item.type];
                    searchResult.push(item)
                } 
            })
        } else {
            proccessedTrackingData.map(item => {
                if (item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0
                    || item.access_control_number.slice(10,14).indexOf(searchKey) >= 0
                    || item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) {
                    item.searched = true
                    searchResult.push(item)
                }
            })
        }
        this.setState({
            proccessedTrackingData
        })
        return searchResult
    }

    collectObjectsByLatLng = (lbPosition, proccessedTrackingData) => {
        let objectList = []
        proccessedTrackingData.map(item => {
            if (item.currentPosition && item.currentPosition.toString() === lbPosition.toString()) {
                item.searched = true;
                objectList.push(item);
            }
        })
        return objectList 
    }
    highlightSearchPanel = (boolean) => {
        this.setState({
            isHighlightSearchPanel: boolean
        })
    }
    
    render(){

        const { 
            hasSearchKey,
            colorPanel, 
            clearColorPanel,
            trackingData,
            proccessedTrackingData,
            searchResult,
            searchResultObjectTypeMap
        } = this.state;

        const style = {
            container: {

                /** The height: 100vh will cause the page can only have 100vh height.
                 * In other word, if the seaerch result is too long and have to scroll down, the page cannot scroll down
                 */
                // height: '100vh'
            },
            searchResultDiv: {
                display: this.state.hasSearchKey ? null : 'none',
                // paddingTop: 30,
            },
            
            searchPanel: {
                zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                background: 'white',
                borderRadius: 10,
                // height: '90vh'
            }
        }
        const { locale, auth } = this.context

        let deviceNum = this.state.trackingData.filter(item => item.found).length
        let devicePlural = deviceNum === 1 ? locale.texts.DEVICE : locale.texts.DEVICES
        let data = hasSearchKey 
            ? searchResult.length !== 0 
                ? Object.keys(searchResultObjectTypeMap).length !== 0 
                    ? searchResultObjectTypeMap
                    : {[devicePlural] : 0} 
                : {[devicePlural] : 0} 
            : {[devicePlural]: this.state.trackingData.filter(item => item.found).length}

        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='mx-1 my-2' >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                    <Col sm={7} md={9} lg={8} xl={8} id='searchMap' className="pl-2 pr-1" >
                        <InfoPrompt 
                            data={data}
                            title={locale.texts.FOUND} 
                        />
                        {/* {this.state.hasSearchKey 
                            ?   this.state.searchResult.length !== 0   
                                ?   <InfoPrompt 
                                        data={this.state.searchResultObjectTypeMap} 
                                        title={locale.texts.FOUND} 
                                    />
                                :                                         
                            :   <InfoPrompt 
                                    data={{
                                        [devicePlural]: this.state.trackingData.filter(item => item.found).length
                                    }}
                                    title={locale.texts.FOUND} 
                                />
                        }      */}
                        <SurveillanceContainer 
                            proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                            hasSearchKey={hasSearchKey}
                            colorPanel={colorPanel}
                            handleClearButton={this.handleClearButton}
                            getSearchKey={this.getSearchKey}
                            clearColorPanel={clearColorPanel}
                            changeLocationAccuracy={this.changeLocationAccuracy}
                            changeArea={this.changeArea}
                            auth={auth}
                            area={this.state.area}
                        />
                    </Col>
                    <Col id='searchPanel' xs={12} sm={5} md={3} lg={4} xl={4} className="w-100 px-2" style={style.searchPanel}>
                        <SearchContainer 
                            hasSearchKey={this.state.hasSearchKey}
                            clearSearchResult={this.state.clearSearchResult}
                            hasGridButton={this.state.hasGridButton}
                            auth={auth}
                            getSearchKey={this.getSearchKey}
                            // objectTypeList={this.state.objectTypeList}
                        />
                        
                        <div 
                            id='searchResult' 
                            style={style.searchResultDiv} 
                        >
                            <SearchResultList
                                searchResult={this.state.searchResult} 
                                searchKey={this.state.searchKey}
                                highlightSearchPanel={this.highlightSearchPanel}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
    }
}

export default connect(mapStateToProps)(MainContainer)




