import React from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';



import axios from 'axios';
import dataSrc from '../../dataSrc';

import Cookies from 'js-cookie'

import SearchResult from '../presentational/SearchResult'

import GetResultData from '../../functions/GetResultData'

class ShiftChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            searchResult: [],
        }

        this.handleClose = this.handleClose.bind(this)
        this.getTrackingData = this.getTrackingData.bind(this)
    }

    componentDidMount() {

        this.getTrackingData(true)


        
    }

    componentDidUpdate(preProps) {
        if (preProps != this.props){
            this.setState({
                show: this.props.show,
            })
        }
    }

    handleClose() {
        this.props.handleShiftChangeRecordClose()
        this.setState({
            show: false
        })
    }

    getMyDevices(){

    }

    getTrackingData(update) {
        var ShouldUpdate = false
        axios.get(dataSrc.trackingData).then(res => {
            var data = res.data
            GetResultData('my devices', data).then(result=>{
                this.setState({
                    searchResult: result
                })
            }) 
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        const { show } = this.state;
        // const { handleSignupFormSubmit } = this.props;
        // console.log(this.state.searchResult)
        return (
            <Modal show={show} size="md" style={{height: '100vh'}} onShow = {this.getTrackingData(true)} onHide={this.handleClose}>
                <Modal.Header > 
                    <h3 className="w-100 justify-content-center d-flex">Checked by {Cookies.get('user')}<br /></h3>
                </Modal.Header>
                <Modal.Body  style ={{padding: '0px 0px 0px 0px', marginBottom: '10px', height: '40vh'}} >                       
                    <SearchResult 
                        searchResult= {this.state.searchResult}
                        closeSearchResult = {this.handleClose}
                        Show = "true"
                        Setting = {{width:'100%', top: '0%', right: '0%', maxHeight: '100%', minHeight: '100%'}}
                    />
                </Modal.Body>
                <Modal.Footer style={{padding: '0px 0px 0px 0px',}}>
                    <button className = "btn btn-primary w-100 m-0 p-0" style={{height: '5vh'}}>Confirm</button>
                </Modal.Footer>
            </Modal>
        )
    }


}

export default ShiftChange