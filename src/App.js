import React from 'react';

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

import Cookies from 'js-cookie'
class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
            shouldTrackingDataUpdate: props.shouldTrackingDataUpdate,
            loginStatus: Cookies.get('user')?Cookies.get('user'):null,
            searchableObjectData: []
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
        this.getTrackingData = this.getTrackingData.bind(this);
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

    componentDidUpdate(prepProps) {
        if (prepProps.shouldTrackingDataUpdate !== this.props.shouldTrackingDataUpdate) {
            this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    getTrackingData() {
        axios.get(dataSrc.trackingData).then(res => {
            var data = res.data.rows.map((item) =>{
                item['currentPosition'] = UuidToLocation(item.lbeacon_uuid)
            })
            this.props.retrieveTrackingData(res.data)
            this.setState({
                searchableObjectData: res.data.rows,
            })
        })
        .catch(error => {
            console.log(error)
        })
    }




    render() { 
        const { locale } = this.state;
        for( var i in routes){
            routes[i]['loginStatus'] = this.state.loginStatus
            routes[i]['searchableObjectData'] = this.state.searchableObjectData
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



