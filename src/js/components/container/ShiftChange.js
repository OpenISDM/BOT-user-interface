import React from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';



import axios from 'axios';
import dataSrc from '../../dataSrc';

import Cookies from 'js-cookie'

import SearchResult from '../presentational/SearchResult'

class ShiftChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            searchResult: [],
        }

        this.handleClose = this.handleClose.bind(this)
        this.getObjectData = this.getObjectData.bind(this)
    }

    componentDidMount() {

        
        this.getObjectData()

        
    }

    componentDidUpdate(preProps) {

        if (preProps != this.props){
                this.setState({
                show: this.props.show,
            })
        }
        this.getObjectData()

        
    }

    getObjectData(){
        var data;

        axios.get(dataSrc.objectTable).then(res => {
            this.state.searchResult = res.data.rows;
        }).catch(function (error) {
            console.log(error);
        })
        
    }

    handleClose() {
        this.props.handleShiftChangeRecordClose()
        this.setState({
            show: false
        })
    }


    render() {
        const { show } = this.state;
        // const { handleSignupFormSubmit } = this.props;

        return (
            <Modal show={show} size="md" style={{height: '100vh'}} onShow = {this.getObjectData} onHide={this.handleClose}>
                <Modal.Header > 
                    <h3 className="w-100 justify-content-center d-flex">Checked by {Cookies.get('user')}<br /></h3>
                </Modal.Header>
                <Modal.Body  style ={{padding: '0px 0px 0px 0px', marginBottom: '10px'}} >                       
                    <SearchResult 
                        searchResult= {this.state.searchResult}
                        closeSearchResult = {this.handleClose}
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