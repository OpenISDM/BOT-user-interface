import React, { Fragment } from 'react';
import _ from 'lodash';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import {
    BrowserView,
    MobileOnlyView,
    TabletView
} from 'react-device-detect';
import { disableBodyScroll } from 'body-scroll-lock';
import retrieveDataHelper from '../../service/retrieveDataHelper';
import messageGenerator from '../../service/messageGenerator';
import TabletMainContainer from '../platform/tablet/TabletMainContainer';
import MobileMainContainer from '../platform/mobile/MobileMainContainer';
import BrowserMainContainer from '../platform/browser/BrowserMainContainer';
import axios from 'axios';
import dataSrc from '../../dataSrc';

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        hasSearchKey: false,
        searchKey: '',
        lastsearchKey: '',
        searchResult: [],
        colorPanel: null,
        clearColorPanel: false,
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        authenticated: this.context.auth.authenticated,
        shouldUpdateTrackingData: true,
        showPath: false,
        pathMacAddress:'',
        display: true,
        showMobileMap: true,
    }

    errorToast = null

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }

    componentDidUpdate = (prevProps, prevState) => {

        /** clear out search result when user sign out */
        if (!(_.isEqual(prevState.authenticated, this.context.auth.authenticated))) {
            this.setState({
                authenticated: this.context.auth.authenticated,
                searchResult: [],
                searchKey: '',
                hasSearchKey: false,
            })
        } 

    }

    /** Get tracking data from database.
     *  Once get the tracking data, violated objects would be collected. */ 
    getTrackingData = (callback) => {
        
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {
            /** dismiss error message when the database is connected */
            if (this.errorToast) {
                this.errorToast = null;
                toast.dismiss(this.errorToast)
            }
            this.setState({
                trackingData: res.data,
            }, callback)
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)

            /** sent error message when database is not connected */
            if (!this.errorToast) {
                this.errorToast = messageGenerator.setErrorMessage()
            }
        })
    }

    // async function getTrackingData (searchKey) {
    //     return await axios.post(dataSrc.trackingData, {
    //         locale: locale.abbr,
    //         user: auth.user,
    //         areaId,
    //         key: searchKey
    //     })
    // }


    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = searchKey => {
        this.getTrackingData(() => this.getResultBySearchKey(searchKey))
        // let {
        //     locale,
        //     auth,
        //     stateReducer
        // } = this.context;

        // let [{areaId}] = stateReducer;

        // // let trackingData = await this.getTrackingData(searchKey);
        // console.log(dataSrc.trackingData)

        // console.log(searchKey)
        // axios.post(dataSrc.trackingData, {
        //     locale: locale.abbr,
        //     user: auth.user,
        //     areaId,
        //     key: searchKey
        // }).then(res => {
        //     console.log(res);
        //     this.setState({
        //         searchResult: res.data,
        //         hasSearchKey: true,
        //         searchKey,
        //     })
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    }

    /** Process the search result by the search key.
     *  The search key would be:
     *  1. all devices
     *  2. my devices
     *  3. all patients
     *  4. my patients
     *  5. specific object term,
     *  6. coordinate(disable now)
     *  7. multiple selected object(gridbutton)(disable now)
     */
    getResultBySearchKey = searchKey => {
        let searchResult = [];
        let hasSearchKey = true
        let {
            trackingData
        } = this.state

        let proccessedTrackingData = _.cloneDeep(trackingData) 

        if (searchKey == " ") {
            hasSearchKey = false
        } else {
            
            proccessedTrackingData
                .map(item => {   
                     if (
                        item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                        item.asset_control_number.indexOf(searchKey) >= 0 ||
                        item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                        (item.location_description != null && item.location_description.indexOf(searchKey) >= 0)
                    ) {
                        searchResult.push(item)
                    }
                   
                })
        }

        this.setState({
            proccessedTrackingData,
            searchResult,
            hasSearchKey,
            searchKey,
        })
    }


    render(){

        const { 
            hasSearchKey,
            trackingData,
            proccessedTrackingData,
            searchResult,
            searchKey,
            authenticated,
            showMobileMap,
            clearSearchResult,
            showPath,
            display,
            pathMacAddress,
        } = this.state;

        const {
            handleClearButton,
            getSearchKey,
            setMonitor,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            setShowedObjects,
            handleShowResultListForMobile,
            mapButtonHandler,
            highlightSearchPanel
        } = this

        const propsGroup = {
            handleClearButton,
            hasSearchKey,
            getSearchKey,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            authenticated,
            showMobileMap,
            clearSearchResult,
            searchKey,
            searchResult,
            trackingData,
            proccessedTrackingData,
            setShowedObjects,
            handleShowResultListForMobile,
            display,
            pathMacAddress,
            mapButtonHandler,
        }

        return (
            /** "page-wrap" the default id named by react-burget-menu */
            <Fragment>
                <BrowserView>
                    <BrowserMainContainer 
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletMainContainer 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileMainContainer 
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default MainContainer




