import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import VerticalTable from '../presentational/VerticalTable';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import { Image } from 'react-bootstrap'
import tempImg from '../../../img/doppler.jpg'

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class ChangeStatusForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            formOption: {
                name: '',
                type: '',
                status: '', 
                transferredLocation: null,
            }
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
  
    handleClose(e) {
        console.log('Submit')
        if(this.props.handleChangeObjectStatusFormClose) {
            this.props.handleChangeObjectStatusFormClose();
        }
        this.setState({ 
            show: false 
        });
    }
  
    handleShow() {

        this.setState({ 
            show: true 
        });
    }


    componentDidUpdate(prevProps, prevState) {
        const { selectedObjectData } = this.props



        if (prevProps != this.props  &&  selectedObjectData) {
            let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData : []
            this.setState({
                show: this.props.show,
                isShowForm: true,
                formOption: {
                    name: selectedObjectData.name,
                    type: selectedObjectData.type,
                    status: selectedObjectData.status,
                    transferredLocation: selectedObjectData.status === 'Transferred' && selectedObjectData.transferred_location ? {
                        'value' : selectedObjectData.transferred_location,
                        'label' : selectedObjectData.transferred_location
                    } : null,
                }
            })
        }
    }

    handleSubmit(e) {
        console.log('Submit')
        const button = e.target;
        let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData : []
        const { mac_address, name, type, access_control_number } = selectedObjectData;
        const { status, transferredLocation } = this.state.formOption;
        const postOption = {
            name: name,
            type: type,
            access_control_number: access_control_number,
            status: status,
            transferredLocation: status !== 'Transferred' ? '' : transferredLocation,
            mac_address: mac_address,
        }
        if(this.props.handleChangeObjectStatusFormSubmit) {
            this.props.handleChangeObjectStatusFormSubmit(postOption);
        }
    }

    handleCheck(e) {
        console.log('Submit')
        this.setState({
            formOption: {
                ...this.state.formOption,
                status: e.target.value,
            }
        })
    }

    handleSelect(selectedOption) {
        console.log('Submit')
        this.setState({
            formOption: {
                ...this.state.formOption,
                transferredLocation: selectedOption,
            }
        })
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

        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }

        let { title } = this.props;
        let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData : []

        const { name, type, status, transferredLocation } = this.state.formOption;

        return (
            <>  
                <Modal show={this.state.show} onHide={this.handleClose} size="md">
                    <Modal.Header closeButton className='font-weight-bold'>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <Row>
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

                            <hr/>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column sm={2} className='pt-0'>
                                        Status
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Normal"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            value="Normal"
                                            checked={status === 'Normal'}
                                            onChange={this.handleCheck}                                     
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Broken"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                            value="Broken"
                                            checked={status === 'Broken'}

                                            onChange={this.handleCheck}   
                                        />
                                        <Form.Row>
                                            <Form.Group as={Col} sm={4}>
                                                <Form.Check
                                                    custom
                                                    type="radio"
                                                    label="Transferred"
                                                    name="formHorizontalRadios"
                                                    id="formHorizontalRadios3"
                                                    value="Transferred"
                                                    checked={status === 'Transferred'}
                                                    onChange={this.handleCheck}   
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} sm={8} >
                                                    <Select
                                                        placeholder = "Select Location"
                                                        value = {transferredLocation}
                                                        onChange={this.handleSelect}
                                                        options={options}
                                                        isDisabled = {status === 'Transferred' ? false : true}
                                                    />
                                            </Form.Group>
                                            
                                        </Form.Row>
                                    </Col>
                                </Form.Group>
                             </fieldset>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

ChangeStatusForm.contextType = LocaleContext;
  
export default ChangeStatusForm;