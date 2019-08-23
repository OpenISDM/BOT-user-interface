import React from 'react';

import Surveillance from '../presentational/Surveillance';
import ToggleSwitch from './ToggleSwitch';
import { Nav, Row, ButtonToolbar, Button, ToggleButton}  from 'react-bootstrap';

// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// import html2canvas from 'html2canvas';

// import printJS from 'print-js'



import ChangeStatusForm from './ChangeStatusForm';
import PdfDownloadForm from '../presentational/PdfDownloadForm'

import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import ConfirmForm from './ConfirmForm'
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { connect } from 'react-redux'
import { 
    shouldUpdateTrackingData,

} from '../../action/action'
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import GridButton from '../container/GridButton';


import '../../../css/SurveillanceContainer.css'

var QRCode = require('qrcode.react');




class SurveillanceContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rssi: 1,
            showEditObjectForm: false,
            showConfirmForm: false,
            showPdfDownloadForm: false,
            selectedObjectData: [],
            formOption: [],
            showDevice: false,
            searchableObjectData: [],
            searchResult:[],
            isSaving: false,
        }

        this.adjustRssi = this.adjustRssi.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        // this.handleChangeObjectStatusFormClose = this.handleChangeObjectStatusFormClose.bind(this);
        // this.handleChangeObjectStatusFormSubmit = this.handleChangeObjectStatusFormSubmit.bind(this);
        // this.handleConfirmFormSubmit = this.handleConfirmFormSubmit.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this)
        this.transferSearchableObjectData = this.transferSearchableObjectData.bind(this)

        this.pdfDownload = this.pdfDownload.bind(this)
        this.handleClosePdfForm = this.handleClosePdfForm.bind(this)
    }

    componentDidUpdate(){
        // console.log(this.state.searchableObjectData)
        if(this.state.searchableObjectData.length !== this.props.searchableObjectData.length){
            this.setState({
                searchableObjectData: this.props.searchableObjectData,
            })
        }
        if(this.state.searchResult.length !== this.props.searchResult.length){
            this.setState({
                searchResult: this.props.searchResult,
            })
        }
        
    }
    adjustRssi(accuracyValue) {
        this.props.changeLocationAccuracy(accuracyValue)
        this.setState({
            rssi: accuracyValue,
        })
    }


    handleMarkerClick(objectList) {
        console.log(objectList)
        this.setState({
            showEditObjectForm: true,
            selectedObjectData: objectList,
        })
        this.props.shouldUpdateTrackingData(false)
    }

    

   

    handleClickButton(e) {
        const button = e.target;
        const buttonName = button.innerText
        switch(buttonName.toLowerCase()) {
            case 'show devices':
            case 'hide devices':
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case 'clear':
                this.props.handleClearButton();
        }

    }


    transferSearchableObjectData(processData) {
        this.props.transferSearchableObjectData(processData)
        this.setState({
            searchableObjectData: processData,
        })
    }

    capitalFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.substring(1)
    }
    

    pdfDownload(){
        this.setState({
            showPdfDownloadForm: true,
        })
        


    }
    handleClosePdfForm(){
        this.setState({
            showPdfDownloadForm: false,
        })
    }
    render(){
        const { rssi, 
                showEditObjectForm, 
                showConfirmForm, 
                selectedObjectData, 
                formOption, 
                showPdfDownloadForm,
                isSaving
            } = this.state;
        const { hasSearchKey, 
                searchResult,
                searchType, 
                transferSearchableObjectData
            } = this.props;
        const locale = this.context;

        const style = {
            title: {
                color: 'grey',
                fontSize: '1rem',
                width: '5rem'
            },
            // surveillanceContainer: {
            //     height: '100vh'
            // },
            navBlock: {
                height: '40%'
            }, 
            mapBlock: {
                height: '60%',
                border: 'solid 2px rgba(227, 222, 222, 0.619)',
                padding: '5px',
            },
            gridButton: {
                display: this.state.showDevice ? null : 'none'
            }
        }

        return(
            <div id="surveillanceContainer" style={style.surveillanceContainer} className='overflow-hidden'>

                <div style={style.mapBlock}>
                    <Surveillance 
                        rssi={rssi} 
                        transferSearchResult={this.props.transferSearchResult}
                        hasSearchKey={hasSearchKey}
                        searchResult={searchResult}
                        searchType={searchType}
                        transferSearchableObjectData={this.transferSearchableObjectData}
                        handleMarkerClick={this.handleMarkerClick}
                        style={style.searchMap}
                        colorPanel={this.props.colorPanel}
                        handleSearch={this.props.handleSearch}
                    />
                </div>
                <div style={style.navBlock}>

                    <Nav className='d-flex align-items-start'>
                        <Nav.Item className='d-flex align-self-center'>
                            <div style={style.title} className='text-wrap'>{locale.LOCATION_ACCURACY}</div>
                        </Nav.Item>
                        <Nav.Item className='pt-2 mr-2'>
                            <ToggleSwitch 
                                adjustRssi={this.adjustRssi} 
                                leftLabel={this.capitalFirstLetter(locale.LOW)} 
                                defaultLabel={this.capitalFirstLetter(locale.MED)} 
                                rightLabel={this.capitalFirstLetter(locale.HIGH)} 
                            />
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button variant="outline-primary" className='mr-1 ml-2' onClick={this.handleClickButton}>{locale.CLEAR}</Button>
                        </Nav.Item>
                        <Nav.Item className='mt-2'>
                            <Button variant="outline-primary" className='mr-1 mr-4' onClick={this.pdfDownload} disabled = {this.state.isSaving}>{locale.SAVE}</Button>

                        </Nav.Item>
                        
                    </Nav>

                </div>

                
                {console.log(searchResult)}
                <PdfDownloadForm 
                    show={showPdfDownloadForm}
                    data={searchResult}
                    handleClose = {this.handleClosePdfForm}
                />
                

            </div>
        )
    }
}
SurveillanceContainer.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value)),

    }
}

export default connect(null, mapDispatchToProps)(SurveillanceContainer)

// <ChangeStatusForm 
//                     show={showEditObjectForm} 
//                     title='Report device status' 
//                     selectedObjectData={selectedObjectData} 
//                     searchKey={null}
//                     handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose}
//                     handleChangeObjectStatusFormSubmit={this.handleChangeObjectStatusFormSubmit}
//                 />
//                 <ConfirmForm 
//                     show={showConfirmForm}  
//                     title='Thank you for reporting' 
//                     selectedObjectData={formOption} 
//                     // handleChangeObjectStatusFormClose={this.handleChangeObjectStatusFormClose} 
//                     handleConfirmFormSubmit={this.handleConfirmFormSubmit}
//                     searchableObjectData={this.state.searchableObjectData}
//                 />