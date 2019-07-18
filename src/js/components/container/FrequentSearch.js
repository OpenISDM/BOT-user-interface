import React from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';

import LocaleContext from '../../context/LocaleContext';

import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import Cookies from 'js-cookie'
import config from '../../config';

class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.state = {
            hasGetUserInfo: false,
            searchkey: '',
            cookie: document.cookie,
        }

        this.handleClick = this.handleClick.bind(this);
        this.cookieListener = this.cookieListener.bind(this);
    }


    componentWillUnmount() {
       // use intervalId from the state to clear the interval
       clearInterval(this.state.intervalId);
    }



    componentDidMount(){
        
        var intervalId = setInterval(this.cookieListener, 300);
       // store intervalId in the state so it can be accessed later:
        this.setState({intervalId: intervalId});

    }

    cookieListener(){
        if(this.state.cookie !== document.cookie){

            this.setState({
                cookie : document.cookie
            })
        }
    }
    componentDidUpdate(prepProps) {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchkey: '',
            })
        }
    }


    handleClick(e) {
        const itemName = e.target.innerText.toLowerCase();
        switch(itemName) {
            case 'my devices':
                if (!this.state.hasGetUserInfo && Cookies.get('user')) {
                    axios.post(dataSrc.userInfo, {
                        username: Cookies.get('user')
                    }).then( res => {
                        var mydevice = new Set(res.data.rows[0].mydevice);
                        this.props.getResultData(mydevice)
                        this.setState({
                            hasGetUserInfo: true,
                            mydevice: mydevice,
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                } else if (!Cookies.get('user')) {
                    return
                } else {
                    this.props.getResultData(this.state.mydevice)
                };

                break;
            case 'all devices':
                // this.props.shouldUpdateTrackingData(true)
                this.props.getResultData(itemName)
                break;
            default:
                this.props.getResultData(itemName)
                break;
        }
        this.setState({
            searchkey: itemName
        })
    }

    render() {
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
            button:{
                borderRadius: '20px',
                margin: '10px',
                background: '#EEEEEE',
                float:'left'
            }
        }

        const locale = this.context;

        return (
            <>
            {}
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h3>{locale.FREQUENT_SEARCH}</h3>
                </Row>
                <div className='d-inline-flex flex-column mb-3' id='frequentSearch' >
                    {Cookies.get('searchHistory') && JSON.parse(Cookies.get('searchHistory')).filter( item => {
                        return item.name !== 'All'
                    }).map( (item, index) => {
                        
                        return (
                            <div key={index}>
                                
                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick} 
                                    active={this.state.searchkey === item.name.toLowerCase()} 
                                    key={index}
                                    style = {style.button}
                                    className="shadow col-md-8 col-12"
                                >

                                    {item.name}
                                </Button>
                                <img src={config.objectImage[item.name]} alt="Girl in a jacket" className="objectImage"/>
                            </div>
                        )
                    })}
                    &nbsp;

                    {Cookies.get('user') && 
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            active={this.state.searchkey === 'my devices'}
                            style = {style.button}
                            className="shadow col-md-8 col-12"
                        >
                            {locale.MY_DEVICE}
                        </Button>
                    }
                        <Button 
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            active={this.state.searchkey === 'all devices'}
                            style = {style.button}
                            className="shadow col-md-8 col-12"
                        >
                            {locale.ALL_DEVICE}
                        </Button>
                </div>
            </>
        )
    }
}

FrequentSearch.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(FrequentSearch);