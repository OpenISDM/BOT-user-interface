import React from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';

import LocaleContext from '../../context/LocaleContext';

import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import Cookies from 'js-cookie'
import config from '../../config';

import '../../../css/hideScrollBar.css'
import '../../../css/FrequentSearch.css'

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
        // console.log(e.target)
        const itemName = e.target.name.toLowerCase();
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
                float:'left',

            }
        }

        const locale = this.context;

        return (
            <>
            {}
                <Row className='d-flex justify-content-center FrequentSearch hideScrollBar' style={style.titleText}>
                    <h3 className = "FrequentSearchTitle">{locale.FREQUENT_SEARCH}</h3>
                </Row>
                <div className='FrequentSearchList m-2 row d-flex '  id='frequentSearch'>
                    {Cookies.get('searchHistory') && JSON.parse(Cookies.get('searchHistory')).filter( item => {
                        return item.name !== 'All'
                    }).map( (item, index) => {
                        
                        return (
                            <div key={index} className="col col-6 p-1 ml-0 d-flex justify-content-center" style={{float:'right'}}  >
                                
                                <Row className="w-100 d-flex justify-content-center ">
                                    <Row className="w-100 d-flex justify-content-center ">
                                        <img src={config.objectImage[item.name]} alt="" className="FrequentSearchobjectImage" onClick={this.handleClick} name={item.name}/>
                                    
                                    
                                    </Row>
                                    <Button 
                                        style={{background: '#DDDDDD', color: '#000000'}}
                                        className="FrequentSearchButton w-100 d-flex justify-content-center m-2"
                                        onClick={this.handleClick} 
                                        active={this.state.searchkey === item.name.toLowerCase()} 
                                        key={index}
                                        name={item.name}
                                    >
                                        {item.name}
                                    </Button>
                                </Row>
                                
                            </div>
                        )
                    })}

                        <div className="btn-group btn-group-justified row w-100 d-flex justify-content-center mx-2 mt-4">
                        {Cookies.get('user') && 
                            <Button

                                className="FrequentSearchButton mx-2 btn-success"
                                onClick={this.handleClick} 
                                style={{ color: '#000000', height: '50px', verticalAlign: 'sub'}}
                                active={this.state.searchkey === 'my devices'}
                                name={locale.MY_DEVICE}
                            >
                                {locale.MY_DEVICE}
                            </Button>
                        }
                            <Button 


                                className="FrequentSearchButton mx-2 btn-danger"
                                onClick={this.handleClick} 
                                style={{ color: '#FFFFFF', height: '50px'}}
                                active={this.state.searchkey === 'all devices'}
                                name={locale.ALL_DEVICE}
                            >
                                {locale.ALL_DEVICE}
                            </Button>
                        </div>
                    
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