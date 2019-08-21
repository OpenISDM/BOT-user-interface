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
import AxiosFunction from '../../functions/AxiosFunction'

import GetResultData from '../../functions/GetResultData'


class FrequentSearch extends React.Component {

    constructor(){
        super()
        this.staticState = {
            cookie: document.cookie,
            searchHistory: [],
        }
        this.searchHistory = []
        this.intervalId = null
        this.handleClick = this.handleClick.bind(this);
        this.cookieListener = this.cookieListener.bind(this);
        // this.getSearchHistory = this.getSearchHistory.bind(this)
        this.getSearchHistory = this.getSearchHistory.bind(this)
    }


    componentWillUnmount() {
       clearInterval(this.intervalId);
    }
    getSearchHistory(){
        AxiosFunction.getSearchHistory(
        {
            username: Cookies.get('user')
        }, 

        (err, res) => {
            if(err){
                console.error(err)
            }else{
                
                var searchHistory = res.sort((a, b) => {
                    return b.value - a.value
                })
                searchHistory =  searchHistory.slice(0, config.frequentSearch.maxfrequentSearchLength)
                this.staticState.searchHistory = searchHistory
            }
            this.setState({})
        }, 

        {
            default: []
        }) 
    }

    componentDidMount(){
        this.intervalId = setInterval(this.cookieListener, 300);
        this.getSearchHistory()
    }
    cookieListener(){
        if(this.staticState.cookie !== document.cookie){
            this.staticState.cookie = document.cookie
            this.getSearchHistory()
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

            },
            FrequentSearch:{
                height: '60vh',

                zIndex: 1,

                background:'#FFFFFF',
                
                float: 'left', 

                position:'absolute',

                left: '3%'
            }, 
        }

        const locale = this.context;
        console.log('render')
        return (

            <Col id='FrequentSearch' sm={10} xs={10} className=' mx-1 px-0 float-left' style = {style.FrequentSearch} >
                <Row className='d-flex justify-content-center'>
                    <h3>{locale.FREQUENT_SEARCH}</h3>
                </Row>
                <Row className='m-2 '  id='frequentSearch' >
                    

                        {this.staticState.searchHistory.map( (item, index) => {

                        return (
                            <div key={index} className="col col-12 p-0 d-flex m-2" style={{float:'right', cursor: 'grab', verticalAlign: 'middle'}}  >
                                
                                <Row className="w-100 m-0 p-0">
                                {config.frequentSearch.showImage 
                                    ?
                                        <Row className="w-100 d-flex justify-content-center ">
                                            <img src={config.objectImage[item.name]} alt="" className="FrequentSearchobjectImage" onClick={this.handleClick} name={item.name}/>
                                        </Row>
                                    :
                                        null
                                }
                                    
                                    <a
                                        className="FrequentSearchButton w-100 h2 "
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
                                style={{cursor: 'grab'}}
                                className="FrequentSearchButton w-100 m-3 h2 "
                                onClick={this.handleClick} 
                                name={locale.MY_DEVICE}
                            >
                                {locale.MY_DEVICE}
                            </a>
                            
                        }
                            <a
                                style={{cursor: 'grab'}}
                                className="FrequentSearchButton w-100 m-3 h2 "
                                onClick={this.handleClick} 
                                name={locale.ALL_DEVICE}
                            >
                                {locale.ALL_DEVICE}
                            </a>
                        </div>
                    
                </Row>
            </Col>
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
