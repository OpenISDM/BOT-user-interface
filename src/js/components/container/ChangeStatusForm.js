import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
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
        this.ShouldUpdate = true
        this.state = {
            title: 'title',
            show: false,
            selectedObjectData: null,
            branches: null,
        };
        this.newStatus = {
            status : '',
            transferred_location : '',
        }



        this.onClose = null
        this.onSubmit = null
        this.addDevice = null

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
                    selectedObjectData: {}
                })
            },
            updateselectedObjectData: (selectedObjectData) => {
                this.setState({
                    selectedObjectData: selectedObjectData
                })
            },
            setOnSubmit: (func) => {
                this.onSubmit = func
            },
            setOnClose: (func) => {
                this.onClose = func
            },
            setAddDevice: (func) => {
                this.addDevice = func
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
                this.onClose()
            },
            openForm: (selectedObjectData) => {
                this.API.openForm(selectedObjectData)
            },
            submitForm: (status, transferred_location) => {
                this.onSubmit(status, transferred_location);
            },
            addDevice : () => {
                this.addDevice()
            }
        }

        this.getBranches = () => {
            axios.get(dataSrc.branches).then((res)=>{
                this.state.branches = res.data
            })
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddTransferDevices = this.handleAddTransferDevices.bind(this)

        this.formikSubmission = this.formikSubmission.bind(this)
        this.formikOnChoose = this.formikOnChoose.bind(this)
    }
    
    componentDidMount(){
        this.props.getAPI(this.API)
        this.getBranches()
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
        var {status, transferred_location} = this.newStatus
        this.event.submitForm(status, transferred_location)
    }

    handleAddTransferDevices(state){   
        this.event.addDevice()
    }

    generateDeviceList(){
        var htmls =[]
        const rwdProp = { 
            sm: 5,
            md: 5,
            lg: 5,
        }
        var {selectedObjectData} = this.state


        for(var selectedObjectDataIndex in selectedObjectData){
            if(selectedObjectData[selectedObjectDataIndex]!== null){

                let object = selectedObjectData[selectedObjectDataIndex]

                let html = 
                    <Row key={selectedObjectDataIndex}>
                        <Col sm={12}>
                        
                            <Row>
                                <Col {...rwdProp}>
                                    Device Type
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {object.type}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={5}>
                                    Device Name
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {object.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={5}>
                                    ACN
                                </Col>
                                <Col sm={7} className='text-muted pb-1'>
                                    {object.access_control_number}
                                </Col>
                            </Row>
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
        if(values.status === 'Transferred' && values.branch === 'Unchoose' && values.submit){
            errors.NoLocation = 'You have to select a transfered branch'
        }

        if(values.status === 'Transferred' && values.branch !== 'Unchoose' && values.department === 'Unchoose' && values.submit){
            errors.NoLocation = 'You have to select a transfered department'
        }
        values.submit = false;

        return errors;
    }
    formikSubmission(values, {setSubmitting}){
        if(values.status === 'Transferred'){
            this.newStatus = {
                status: values.status,
                transferred_location: `${values.department}, ${values.branch}`,
            }
        }else{
            this.newStatus = {
                status: values.status,
                transferred_location: '',
            }
        }
        this.handleSubmit()
        setSubmitting(false);
    }
    formikOnChoose(e,{values}, handleChange){
        handleChange(e);
        var name = e.target.name

        values.status = name;
        this.API.setNewStatus({
            status : name
        })
    }
    formikCheckBoxHtml(name, {values}, handleChange){
        let html = 
            <div className="custom-control custom-checkbox" key={name}>
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name={name}
                    onChange={(e) => { this.formikOnChoose(e,{values}, handleChange) }}
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

        

        let { title } = this.state;




        return (
            <>
                <Modal show={this.state.show} onHide={this.handleClose} size="md" style={customModalStyles.content} enforceFocus={false}>
                    <Modal.Header closeButton className='font-weight-bold'>
                        {title}
                    </Modal.Header>
                    <Modal.Body>
                        
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList()}
                            </div>
                            <hr/>
                            <Formik
                                initialValues={{department: 'Unchoose', branch: 'Unchoose', status: '', showDepartment: false, submit: false }}
                                validate={this.formikValidation}
                                onSubmit={this.formikSubmission}
                            >
                            {({ values, errors, handleChange, handleSubmit }) => (
                                <form onSubmit={(e)=>{ values.submit = true; handleSubmit(e)}} className="justify-content-center">

                                    {config.statusOption.map((status) => {
                                        return this.formikCheckBoxHtml(status, {values}, handleChange)
                                    })}
                                    

                                    <div className="custom-control custom-checkbox d-inline-flex" style={{width: '150%', height: '1vh'}}>
                                        <div className = "m-1 p-1" style={{width: '100%'}}>
                                            <Col sm={5} className="px-0" style={{top: '-150%', left: '25%', position: 'absolute'}}>
                                                <select 
                                                    className="custom-select my-2 w-100 float-left" 
                                                    disabled={values.status !== 'Transferred'}
                                                    name="select" 
                                                    onChange={(e)=> {
                                                        var location = e.target.value
                                                        values.branch = location;
                                                        values.showDepartment = true
                                                        e.target.value = 'Unchoose'
                                                        handleChange(e)
                                                        
                                                    }} 
                                                >
                                                    <option value="Unchoose">Select transferred branch</option>
                                                    {
                                                        (() => {
                                                            var Html = []
                                                            for(var location of Object.keys(this.state.branches)){
                                                                let html = 
                                                                    <option value={location} key={location} name={location} >
                                                                        {location}
                                                                    </option>
                                                                Html.push(html)
                                                            }
                                                            return Html
                                                        })()


                                                    }
                                                </select>
                                                </Col>
                                                <Col sm={4} className="px-0" style={{top: '-150%', left: '68%', position: 'absolute'}}>
                                                    {(values.showDepartment)
                                                        ?
                                                            <ListGroup className = "my-2 w-100 float-left shadow border border-dark" disabled={values.branch === 'Unchoose' || values.status!== 'Transferred'}
                                                                
                                                            >
                                                                {
                                                                    (() => {
                                                                        var Html = []
                                                                        if(this.state.branches[values.branch]){
                                                                            Html = this.state.branches[values.branch].map((department)=>{

                                                                                let html = 
                                                                                    <ListGroup.Item type="button" key = {department} name={department} className="border border-light" style={{borderRadius: '5px'}} action
                                                                                        onClick={(e)=>{

                                                                                            var department = e.target.name
                                                                                            values.department = department
                                                                                            values.showDepartment = false
                                                                                            handleChange(e)
                                                                                        }}
                                                                                    >
                                                                                        {department}
                                                                                    </ListGroup.Item>
                                                                                return html
                                                                            })
                                                                        }
                                                                        
                                                                        return Html
                                                                    })()}
                                                            </ListGroup>
                                                        :
                                                            null
                                                    }
                                                    
                                                </Col>

                                        </div>
                                        
                                    
                                    </div>
                                    {values.status === 'Transferred'
                                        ? 
                                            <h4 className="text-center mb-3">Transferred to {[values.department, values.branch].join(', ')}</h4>
                                        :
                                            null
                                    }
                                    {<h5 className="text-danger text-center">{errors.NoLocation}</h5>}
                                    {<h5 className="text-danger text-center">{errors.NoSelect}</h5>}
                                    <Row className="btn-group d-flex justify-content-center mx-3">
                                        <Button name="AddDevices" onClick={this.handleAddTransferDevices}>
                                            Add Devices
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
                    
                </Modal>
            </>
        );
    }
}

ChangeStatusForm.contextType = LocaleContext;
  
export default ChangeStatusForm;