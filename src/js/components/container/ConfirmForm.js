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
  
class ConfirmForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            showAddDeviceForm: false,
            formOption: {
                name: '',
                type: '',
                status: '', 
                transferredLocation: null,
            },
            showNotesControl: false,
            notesText:'',
            addedDevices: []
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addedDevice = this.addedDevice.bind(this);
        this.handleAddDeviceFormClose = this.handleAddDeviceFormClose.bind(this)
    }
  
    handleClose(e) {
        if(this.props.handleConfirmForm) {
            this.props.handleConfirmForm('close', null);
        }
        this.setState({ 
            show: false ,
            addedDevices: []
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    componentDidMount(){

        this.setState({
                show: this.props.show,
                isShowForm: true,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ShouldUpdate !== this.props.ShouldUpdate) {

            this.setState({
                show: this.props.show,
                isShowForm: true,
                

            })
        }
    }

    handleSubmit(e) {
        this.props.handleConfirmForm('submit',true)
    }

    handleChange(e) {
        const { name }  = e.target
        this.setState({
            [name]: e.target.value
        })
    }

    handleClick(e) {
        const item = e.target.innerText;
        switch(item.toLowerCase()) {
            case 'add device':
                this.setState({
                    showAddDeviceForm: true
                })
                break;
            case 'remove device':

                break;
            case 'add notes':
            case 'hide notes':
                this.setState({
                    showNotesControl: !this.state.showNotesControl
                })
                break;

        }
    }

    addedDevice(selectedDevice) {
        this.setState({
            addedDevices: selectedDevice,
            showAddDeviceForm: false,
        })
    }

    handleAddDeviceFormClose() {
        this.setState({
            showAddDeviceForm: false
        })
    }

    generateDeviceList(){
        var htmls =[]
        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }
        for(var selectedObjectDataIndex in this.props.selectedObjectData){
            if(this.props.selectedObjectData[selectedObjectDataIndex]!== null){
                let selectedObjectData = this.props.selectedObjectData[selectedObjectDataIndex]

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
                        <Col sm={4} className='d-flex align-items-center'>
                            <Image src={tempImg} width={80}/>
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
            notesControl: {
                display: this.state.showNotesControl ? null : 'none', 
            }
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

        const { title } = this.props;

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md" style={customModalStyles.content}>
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList()}
                            </div>
                           
                            {this.state.addedDevices.length !== 0 
                                ? 
                                    this.state.addedDevices.map((item,index) => {
                                        return (
                                            <>
                                                <hr/>
                                                <Row >
                                                    <Col sm={10}>
                                                        <Row>
                                                            <Col sm={5}>
                                                                Device Type
                                                            </Col>
                                                            <Col sm={7} className='text-muted pb-1'>
                                                                {item.type}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm={5}>
                                                                Device Name
                                                            </Col>
                                                            <Col sm={7} className='text-muted pb-1'>
                                                                {item.name}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm={5}>
                                                                ACN
                                                            </Col>
                                                            <Col sm={7} className='text-muted pb-1'>
                                                                {item.access_control_number}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col sm={2} className='d-flex align-items-center'>
                                                        <Image src={tempImg} width={60}/>
                                                    </Col>
                                                </Row>
                                            </>
                                        )
                                    })   
                                : null
                            }
                        </Form>
                        
                        <hr/>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h5>{this.props.formOption.status}
                                    {this.props.formOption.status === 'Transferred' 
                                        ? '  to  ' + this.props.formOption.transferred_location.value 
                                        : null
                                    }
                                </h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <h6>{moment().format('LLLL')}</h6>    
                            </Col>
                        </Row>
                        {this.props.formOption.status === 'Transferred' && 
                            <>
                                <hr/>
                                <Row className='d-flex justify-content-center'>
                                    <ButtonToolbar >
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>Add Device</Button>
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>Remove Device</Button>
                                        <Button variant="outline-secondary" className='mr-2' onClick={this.handleClick}>
                                            {this.state.showNotesControl ? 'Add Notes' : 'Hide Notes'}
                                        </Button>
                                    </ButtonToolbar>
                                </Row>
                            </>
                        }

                        <Form style={style.notesControl}>
                        <hr/>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control 
                                    as="textarea" 
                                    rows="3" 
                                    placeholder='notes...' 
                                    value={this.state.notesText}
                                    name='notesText'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
                <AddDeviceForm
                    show={this.state.showAddDeviceForm}  
                    title='Add device' 
                    searchableObjectData={this.props.searchableObjectData}
                    addedDevice={this.addedDevice}
                    handleAddDeviceFormClose={this.handleAddDeviceFormClose}
                    searchResult={this.props.searchResult}
                    formOption={this.props.formOption}
                />
            </>
        );
    }
}

ConfirmForm.contextType = LocaleContext;
  
export default ConfirmForm;