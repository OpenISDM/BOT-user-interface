import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import {Dropdown, DropdownButton} from 'react-bootstrap'
// import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
import NestedSelect from '../presentational/NestedSelect'

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
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
  
class ChangeStatusForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.ShouldUpdate = true
        this.state = {
            title: 'title',
            show: false,
            selectedObjectData: null,
            branches: null,
            showAddNotes: ''
        };
        this.newStatus = {
            status : '',
            transferred_location : '',
            notes: ''
        }

        this.API = {
            setTitle: (title) => {
                this.ShouldUpdate = true
                this.setState({
                    title: title
                })

            },
            openForm: (selectedObjectData) => {
                this.ShouldUpdate = true
                this.setState({
                    show: true,
                    selectedObjectData: selectedObjectData,
                })
            },
            closeForm: () => {
                this.ShouldUpdate = true
                this.setState({
                    show: false,
                    showAddNotes: false,
                    selectedObjectData: {}
                })
            },
            updateselectedObjectData: (selectedObjectData) => {
                this.setState({
                    selectedObjectData: selectedObjectData
                })
            },
            setNewStatus: (newStatus) => {
                this.newStatus = {
                    ...this.newStatus,
                    ...newStatus
                }
            }
            
        }
        this.event={
            closeForm: () => {
                this.API.closeForm()
                this.props.onClose()
            },
            openForm: (selectedObjectData) => {
                this.API.openForm(selectedObjectData)
            },
            submitForm: (newStatus) => {
                this.props.onSubmit(newStatus);
            },
            addDevice : () => {
                this.props.onAddDevice()
            }
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddTransferDevices = this.handleAddTransferDevices.bind(this)

        this.formikSubmission = this.formikSubmission.bind(this)
        this.formikOnChoose = this.formikOnChoose.bind(this)
        this.handleAddNotes = this.handleAddNotes.bind(this)
    }
    
    componentDidMount(){
        this.props.getAPI(this.API)
    }
    shouldComponentUpdate(nextProps, nextState){
        if(this.ShouldUpdate){
            this.ShouldUpdate = false
            return true
        }
        return false
    }
    componentDidUpdate(prevProps, prevState) {
    }
    handleClose(e) {
        this.event.closeForm()
    }
  
    handleShow() {
        this.event.openForm()
    }
    handleSubmit() {
        this.event.submitForm(this.newStatus)
    }
    handleAddNotes(){

        this.ShouldUpdate = true
        this.setState({
            showAddNotes: !this.state.showAddNotes
        })
    }
    handleAddTransferDevices(state){   
        this.event.addDevice()
    }

    generateDeviceList(selectedObjectData){
        var htmls =[]
        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }
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

    formikValidation(values){
        let errors = {};
        if (values.status === '') {
            errors.NoSelect = 'You should at least select one status';
        } 
        if(values.status === 'Transferred' && values.location === '' && values.submit){
            errors.NoLocation = 'You have to select a transfered department'
        }

        values.submit = false;

        return errors;
    }
    formikSubmission(values, {setSubmitting}){
        var notes;
        if(this.refs.notes){
            notes = this.refs.notes.value || ''
        }else{
            notes = ''
        }
        if(values.status === 'Transferred'){
            this.newStatus = {
                status: values.status,
                transferred_location: values.location,
                notes: notes
            }
        }else{
            this.newStatus = {
                status: values.status,
                transferred_location: '',
                notes: notes
            }
        }
        this.handleSubmit()
        setSubmitting(false);
    }
    formikOnChoose(e,{values}, {handleChange}){
        handleChange(e);
        var name = e.target.name

        values.status = name;
        this.API.setNewStatus({
            status : name
        })
    }
    formikCheckBoxHtml(name, {values}, {handleChange}){
        let html = 
            <div className="custom-control custom-checkbox" key={name}>
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name={name}
                    onChange={(e) => { this.formikOnChoose(e,{values}, {handleChange}) }}
                    checked = {values.status === name }
                    id={'check' + name}
                />
                 <label className="custom-control-label h4" htmlFor={'check' + name}>{name}</label>
            </div>

        return html
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
                <Modal show={this.state.show} onHide={this.handleClose} size="md" style={customModalStyles.content} enforceFocus={false}>
                    <Modal.Header closeButton className='font-weight-bold'>
                        {this.props.title}
                    </Modal.Header>
                    <Modal.Body>
                        
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList(this.state.selectedObjectData)}
                            </div>
                            <hr/>
                            <Formik
                                initialValues={{status: '', location: '', showDepartment: false, submit: false }}
                                validate={this.formikValidation}
                                onSubmit={this.formikSubmission}
                            >
                            {({ values, errors, handleChange, handleSubmit }) => (
                                <form onSubmit={(e)=>{ values.submit = true; handleSubmit(e)}} className="justify-content-center">

                                    {config.statusOption.map((status) => {
                                        return this.formikCheckBoxHtml(status, {values}, {handleChange})
                                    })}
                                    {values.status === 'Transferred' 
                                        ?
                                            <NestedSelect 
                                                type="select"
                                                title={"Select Transferred Location"}
                                                onClick={
                                                    (location) => {
                                                    values.location = location;
                                                }}
                                            />
                                        :
                                            null
                                    }                                    
                                    {<h5 className="text-danger text-center">{errors.NoLocation}</h5>}
                                    {<h5 className="text-danger text-center">{errors.NoSelect}</h5>}
                                    <Row className="btn-group d-flex justify-content-center mx-3">
                                        <Button name="AddDevices" onClick={this.handleAddTransferDevices}>
                                            Add Devices
                                        </Button>
                                        <Button name="AddNotes" onClick={this.handleAddNotes}>
                                            Add Note
                                        </Button>
                                        <Button variant="outline-secondary" onClick={this.handleClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Submit</Button>                                        
                                    </Row>
                                </form>
                            )}
                            </Formik>

                    </Modal.Body>
                    {this.state.showAddNotes
                        ?
                            <Modal.Footer>
                                <label htmlFor="notes">Notes</label>
                                <textarea className="form-control" id="notes" ref="notes" rows="3"></textarea>
                            </Modal.Footer>
                        :
                            null
                    }
                    
                    
                </Modal>

            </>
        );
    }
}

ChangeStatusForm.contextType = LocaleContext;
  
export default ChangeStatusForm;