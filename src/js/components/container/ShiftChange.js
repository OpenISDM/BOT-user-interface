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
        // console.log(this.props)
        this.handleClose = this.handleClose.bind(this)
        this.getObjectData = this.getObjectData.bind(this)
        this.closeObjectTable = this.closeObjectTable.bind(this);
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
        this.setState({
            show: false
        })
    }

    closeObjectTable(){
        this.setState({
            show: false
        })
    }


    render() {

        const style = {
            input: {
                padding: 10
            }
        }

        const { show } = this.state;
        // const { handleSignupFormSubmit } = this.props;

        return (
            <Modal show={show} size="md" onShow = {this.getObjectData} onHide={this.handleClose}>
                <Modal.Header>
                    <Row className="w-100 d-flex justify-content-center" style ={{textAlign:'center', fontSize:'30px',}}>
                        Checked by {Cookies.get('user')}<br />



                    </Row>
                </Modal.Header>
                <Modal.Body>
                        <div style ={{display:'flex'}} className="d-flex justify-content-center col-md-12 offset-md-1 px-0 mx-0">
                            <SearchResult 
                                searchResult= {this.state.searchResult}
                                closeSearchResult = {this.closeObjectTable}
                            />
                        </div>
                        
                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-primary btn-lg w-100">Confirm</button>
                </Modal.Footer>
            </Modal>
        )
    }


}

export default ShiftChange