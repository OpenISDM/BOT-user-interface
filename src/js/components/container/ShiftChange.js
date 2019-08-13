import React, {Fragment} from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';



import axios from 'axios';
import dataSrc from '../../dataSrc';

import Cookies from 'js-cookie'

import SearchResultTable from '../presentational/SearchResultTable'

import GetResultData from '../../functions/GetResultData'

import PdfDownloadForm from '../presentational/PdfDownloadForm'

import moment from 'moment'


class ShiftChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            searchResult: [],
            showPdfDownloadForm: false,
            APIforTableDone: false,
        }
        this.APIforTable = null
        this.handleClose = this.handleClose.bind(this)
        this.getTrackingData = this.getTrackingData.bind(this)
        this.handleClosePdfForm = this.handleClosePdfForm.bind(this)
        this.confirmShift = this.confirmShift.bind(this)

        this.getAPIfromTable = this.getAPIfromTable.bind(this)
        this.onClickTableItem = this.onClickTableItem.bind(this)
    }

    getAPIfromTable(API){
        // console.log('API')
        this.APIforTable = API

        this.APIforTable.setOnClick(this.onClickTableItem)

        this.getTrackingData(true)

        this.APIforTable.updateSearchResult(this.state.searchResult)
    }

    onClickTableItem(e){       

    }

    componentDidMount() {

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


    getTrackingData(update) {
        var ShouldUpdate = false
        axios.get(dataSrc.trackingData).then(res => {
            var data = res.data
            GetResultData('my devices', data).then(result=>{
                var foundResult = []
                var notFoundResult = []
                for(var i in result){
                    if(result[i].found){
                        foundResult.push(result[i])
                    }else{
                        notFoundResult.push(result[i])
                    }
                }
                
                this.setState({
                    searchResult: {
                        foundResult: foundResult,
                        notFoundResult: notFoundResult,
                    }
                })
            }) 
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleClosePdfForm(){
        this.setState({
            showPdfDownloadForm: false
        })
    }

    confirmShift(){
        axios.post(dataSrc.QRCode,
            {
                user: Cookies.get('user'), 
                foundResult: this.state.searchResult.foundResult,
                notFoundResult: this.state.searchResult.notFoundResult,
            }).then(res => {
                console.log(res.data)
                this.setState({
                    fileURL: res.data
                })
                this.refs.download.click()
        })
    }

    render() {
        const { show } = this.state;
        return (
            <Fragment>
                <Modal show={show} size="lg" style={{height: '90vh'}} onShow = {this.getTrackingData(true)} onHide={this.handleClose}>
                    <Modal.Header > 
                        <div className="w-100 text-center">
                            <h3>Checked by {Cookies.get('user')}</h3>
                                <br />
                            <h5>At {moment().format('LLLL')}</h5>
                        </div>
                        
                    </Modal.Header>
                    <Modal.Body  style ={{padding: '0px 0px 0px 0px', marginBottom: '10px', height: '60vh', overflowY: 'hidden'}} >                       
                        <SearchResultTable 
                            getAPI = {this.getAPIfromTable}
                        />
                    </Modal.Body>
                    <Modal.Footer style={{padding: '0px 0px 0px 0px',}}>
                        <button className = "btn btn-primary w-100 m-0 p-0" style={{height: '5vh'}} onClick = {this.confirmShift}>Confirm</button>
                        <a href={this.state.fileURL} ref="download" download style={{display: 'none'}}>hi</a>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }


}

export default ShiftChange