import React from 'react';


import moment from 'moment';
/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import config from './js/config';
import axios from 'axios';
import dataSrc from './js/dataSrc';
import { retrieveTrackingData } from './js/action/action';
import { connect } from 'react-redux';

import  UuidToLocation from './js/functions/UuidToLocation'
import  GetTimeStampDifference from './js/functions/GetTimeStampDifference'

import Cookies from 'js-cookie'
class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
            shouldTrackingDataUpdate: props.shouldTrackingDataUpdate,
            loginStatus: Cookies.get('user')?Cookies.get('user'):null,
            searchableObjectData: [],
            ShouldUpdateTrackingData: false,
            ShouldUpdate: 0
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
        this.getTrackingData = this.getTrackingData.bind(this);
        this.ShouldUpdateTrackingData = this.ShouldUpdateTrackingData.bind(this)
    }

    loginStatusHandler(){
        this.setState({
            loginStatus: Cookies.get('user')?Cookies.get('user'):null
        })
    }

    handleChangeLocale(changedLocale){
        this.setState({
            locale: locale.changeLocale(changedLocale)
        })
    }

    componentDidMount() {
        this.props.shouldTrackingDataUpdate ? this.getTrackingData() : null;
        this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentDidUpdate(prepProps, prevState) {
        if(prevState.ShouldUpdate !== this.state.ShouldUpdate){
            this.setState({

            })
        }
        if(prevState.ShouldUpdateTrackingData !== this.state.ShouldUpdateTrackingData){
            this.getTrackingData()
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    getTrackingData() {
        axios.get(dataSrc.trackingData).then(res => {
            var data = res.data.rows.map((item) =>{
                item['notFoundTime'] = GetTimeStampDifference(moment().valueOf(), Date.parse(item.last_seen_timestamp))
                item['currentPosition'] = UuidToLocation(item.lbeacon_uuid)

                return item
            })
            this.props.retrieveTrackingData(res.data)
            this.setState({
                searchableObjectData: data,
                ShouldUpdate: (this.state.ShouldUpdate + 1)%10000
            })
            // console.log(this.state.ShouldUpdate)
        })
        .catch(error => {
            console.log(error)
        })
    }

    ShouldUpdateTrackingData(){
        console.log('ShouldUpdateTrackingData')
        this.setState({
            ShouldUpdateTrackingData: (this.state.ShouldUpdateTrackingData + 1)%10000,
        })
    }




    render() { 
        const { locale, loginStatus, searchableObjectData, ShouldUpdate } = this.state;
        for( var i in routes){

            routes[i]['loginStatus'] = loginStatus
            routes[i]['searchableObjectData'] = searchableObjectData
            routes[i]['ShouldUpdate'] = ShouldUpdate


            routes[i]['ShouldUpdateTrackingData'] = this.ShouldUpdateTrackingData
        }
        return (
            <LocaleContext.Provider value={locale}>
                <Router>         
                    <NavbarContainer 
                        changeLocale={this.handleChangeLocale} 
                        locale={locale} 
                        trackingData={this.retrievingTrackingData}
                        searchableObjectData={this.state.searchableObjectData}
                    />
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Router>
            </LocaleContext.Provider>
        );
    }  
};

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

export default connect(mapStateToProps, mapDispatchToProps)(App)



