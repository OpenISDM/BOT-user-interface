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


import GetResultData from '../../functions/GetResultData'


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


    componentWillReceiveProps(nextProps){

        if(!nextProps.ShouldUpdate){
            
            this.setState({})
        }
        if(nextProps.ShouldUpdate !== this.props.ShouldUpdate){

        }
    }


    componentDidMount(){
        console.log('hi')
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


    handleClick(e) {
        const itemName = e.target.name.toLowerCase();
        this.props.getResultData(itemName)
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
        console.log(!this.props.ShouldUpdate)
        return (
            <>
                <Row className='d-flex justify-content-center'>
                    <h3>{locale.FREQUENT_SEARCH}</h3>
                </Row>
                <Row className='m-2 '  id='frequentSearch'>
                    {Cookies.get('searchHistory') && JSON.parse(Cookies.get('searchHistory')).filter( item => {
                        return item.name !== 'All'
                    }).map( (item, index) => {
                        
                        return (
                            <div key={index} className="col col-6 " style={{float:'right'}}  >
                                
                                <Row className="w-100">
                                {config.frequentSearch.showImage 
                                    ?
                                        <Row className="w-100 d-flex justify-content-center ">
                                            <img src={config.objectImage[item.name]} alt="" className="FrequentSearchobjectImage" onClick={this.handleClick} name={item.name}/>
                                        </Row>
                                    :
                                        null
                                }
                                    
                                    <a
                                        className="FrequentSearchButton w-100 m-3 h2 "
                                        onClick={this.handleClick} 

                                        key={index}
                                        name={item.name}
                                    >
                                        {item.name}
                                    </a>
                                </Row>
                            </div>
                        )
                    })}
                        <div className="btn-group btn-group-justified row w-100 d-flex justify-content-center mx-2 mt-4">
                        {Cookies.get('user') && 
                            <a
                                className="FrequentSearchButton w-100 m-3 h2 "
                                onClick={this.handleClick} 
                                name={locale.MY_DEVICE}
                            >
                                {locale.MY_DEVICE}
                            </a>
                            
                        }
                            <a
                                className="FrequentSearchButton w-100 m-3 h2 "
                                onClick={this.handleClick} 
                                name={locale.ALL_DEVICE}
                            >
                                {locale.ALL_DEVICE}
                            </a>
                        </div>
                    
                </Row>
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

// <Button

//     className="FrequentSearchButton mx-2 btn-dark"
//     onClick={this.handleClick} 
//     style={{height: '50px', fontSize: '0.75rem'}}
//     active={this.state.searchkey === 'my devices'}
//     name={locale.MY_DEVICE}
// >
//     {locale.MY_DEVICE}
// </Button>