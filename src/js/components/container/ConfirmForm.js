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

const objectListProperty = [
    {
        displayName: 'Device Type',
        attributeName: 'type'
    },
    {
        displayName: 'Device Name',
        attributeName: 'name'
    },
    {
        displayName: 'ACN',
        attributeName: 'access_control_number'
    },
]

class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            title: 'title',
            isShowForm: false,
            newStatus: initialFormOption,
            selectedObjectData: {}
        };
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
        this.event = {
            onSubmit: () => {
                this.props.onSubmit()
                this.API.closeForm()
            },
            onClose: () => {
                this.props.onClose()
                this.API.closeForm()
            }
        }
    }
    componentDidMount(){
        this.props.getAPI(this.API)
    }
    generateDeviceList(selectedObjectData){
        var htmls =[]
        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }
        console.log(selectedObjectData)
        var selectedObject = selectedObjectData
        for(var selectedObjectDataIndex in selectedObject){

            if(selectedObject[selectedObjectDataIndex]!== null){
                let selectedObjectData = selectedObject[selectedObjectDataIndex]
                let html = 
                    <Row key={selectedObjectDataIndex} className="px-3 py-1">
                        <Col sm={12}>
                            {objectListProperty.map((property) => {
                                return (
                                    <Row key={property.displayName}>
                                        <Col sm={5}>
                                            {property.displayName}
                                        </Col>
                                        <Col sm={7} className='text-muted pb-1'>
                                            {selectedObjectData[property.attributeName]}
                                        </Col>
                                    </Row>
                                )
                            })}
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

        return (
            <>  
                <Modal show={this.state.isShowForm} onHide={this.event.onClose} size="md" style={customModalStyles.content}>
                    <Modal.Header closeButton className='font-weight-bold'>{this.props.title}</Modal.Header>
                    <Modal.Body className="p-0">
                        <Form >
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList(this.state.selectedObjectData)}
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
                        <Button variant="primary" onClick={this.event.onSubmit}>
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