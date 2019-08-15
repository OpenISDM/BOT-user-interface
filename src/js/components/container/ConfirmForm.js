import React from 'react';
import { Modal, Button, Form, Row, Col, Image, ButtonToolbar} from 'react-bootstrap'
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import moment from 'moment';
import tempImg from '../../../img/doppler.jpg'
import ChangeStatusForm from './ChangeStatusForm';
import AddDeviceForm from './AddDeviceForm'

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  

const initialFormOption = {
    name: '',
    type: '',
    status: '', 
    transferredLocation: null,
}

class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            title: 'title',
            isShowForm: false,
            newStatus: initialFormOption,
            selectedObjectData: {}
        };
        this.onSubmit = null
        this.API = {
            setTitle: (title) => {
                this.setState({
                    title: title
                })
            },
            closeForm: () => {
                this.setState({
                    isShowForm: false,
                    newStatus: initialFormOption,
                    selectedObjectData: {}
                })
            },
            openForm: (selectedObjectData, newStatus) => {

                this.setState({
                    isShowForm: true,
                    selectedObjectData: selectedObjectData,
                    newStatus: newStatus
                })
            },
            setOnSubmit: (func) => {
                this.onSubmit = func
            },
            setDeviceList: (itemList) => {
                this.setState({
                    selectedObjectData: itemList
                })
            },
            addDevice: (item) => {
                var {selectedObjectData} = this.state
                selectedObjectData[item.mac_address] = item
                this.setState()
            },
            removeDevice: (item) => {
                var {selectedObjectData} = this.state
                delete selectedObjectData[item.mac_address]
                this.setState()
            },
            switchDevice: (item) => {
                var {selectedObjectData} = this.state
                selectedObjectData = {}
                selectedObjectData[item.mac_address] = item
                this.setState()
            },
            clearDevice: () => {
                var {selectedObjectData} = this.state
                selectedObjectData = {}

                this.setState()
            },
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  

    componentDidMount(){
        this.props.getAPI(this.API)
    }

    handleSubmit(e) {
        this.onSubmit()
        this.API.closeForm()
    }

    generateDeviceList(){
        var htmls =[]
        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }
        for(var selectedObjectDataIndex in this.state.selectedObjectData){
            if(this.state.selectedObjectData[selectedObjectDataIndex]!== null){
                let selectedObjectData = this.state.selectedObjectData[selectedObjectDataIndex]

                let html = 
                    <Row key={selectedObjectDataIndex}>
                        <Col sm={8}>
                        
                            <Row>
                                <Col {...rwdProp}>
                                    Device Type
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {selectedObjectData.type}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={5}>
                                    Device Name
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {selectedObjectData.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={5}>
                                    ACN
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {selectedObjectData.access_control_number}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                htmls.push(html)
            }
        }
            
        return htmls
    }
  
    render() {

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
        }

        const customModalStyles = {
            content : {
                zIndex                : 1050,  
                top                   : '10%',
                left                  : '-30%',
                right                 : 'auto',
                bottom                : 'auto',
            }
        };

        const { title } = this.state;

        return (
            <>  
                <Modal show={this.state.isShowForm} onHide={this.API.closeForm} size="md" style={customModalStyles.content}>
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList()}
                            </div>
                           
                            
                        </Form>
                        
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h5>{this.state.newStatus.status}
                                    {this.state.newStatus.status === 'Transferred' 
                                        ? '  to  ' + this.state.newStatus.transferred_location
                                        :null
                                    }
                                </h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().format('LLLL')}</h6>    
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.API.closeForm}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;