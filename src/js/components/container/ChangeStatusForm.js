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

        this.departmentHTML = null


        this.onClose = null
        this.onSubmit = null
        this.addDevice = null

        this.API = {
            setTitle: (title) => {
                this.setState({
                    title: title
                })
            },
            openForm: (selectedObjectData) => {
                this.setState({
                    show: true,
                    selectedObjectData: selectedObjectData,
                })
            },
            closeForm: () => {
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
                this.setState({
                    show: false,
                    selectedObjectData: {}
                })
                this.onClose()
            },
            openForm: (selectedObjectData) => {
                this.setState({
                    show: true,
                    selectedObjectData: selectedObjectData,
                })
            },
            submitForm: (status, transferred_location) => {
                console.log(status)
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
    }
    
    componentDidMount(){
        this.props.getAPI(this.API)
        this.getBranches()
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
    

    mouserOverTransferredLocation(e){
        var name = e.target.name
        console.log(name)
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
                                initialValues={{department: 'Unchoose', branch: 'Unchoose', status: '', submit: false }}
                                validate={values => {
                                    let errors = {};
                                    if (values.status === '') {
                                        errors.NoSelect = 'You should at least select one status';
                                    } 
                                    if(values.status === 'Transferred' && values.branch === 'Unchoose' && values.submit){
                                        errors.NoLocation = 'You have to select a transfered branch'
                                    }
                                    console.log(values.department)
                                    if(values.status === 'Transferred' && values.branch !== 'Unchoose' && values.department === 'Unchoose' && values.submit){
                                        errors.NoLocation = 'You have to select a transfered department'
                                    }
                                    values.submit = false;

                                    return errors;
                                }}
                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        console.log('submitting')
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
                                    }, 400);
                                }}
                            >
                            {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            /* and other goodies */
                            }) => (
                                <form onSubmit={(e)=>{ values.submit = true;
                                    handleSubmit(e)}} className="justify-content-center">

                                    

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Normal"
                                            onChange={(e)=>{handleChange(e);
                                                values.status = 'Normal';
                                                this.API.setNewStatus({
                                                    status : 'Normal'
                                                })
                                            }}
                                            checked = {values.status === 'Normal' }
                                            id="checkNormal"
                                        />
                                         <label className="custom-control-label" htmlFor="checkNormal">Normal</label>
                                    </div>

                                    

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Broken"
                                            onChange={(e)=>{handleChange(e);
                                                values.status = 'Broken';
                                                this.API.setNewStatus({
                                                    status : 'Broken'
                                                })
                                            }}
                                            checked = {values.status === 'Broken' }
                                            id="checkBroken"
                                        />
                                        <label className="custom-control-label" htmlFor="checkBroken">Broken</label>
                                    </div>

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Reserve"
                                            onChange={(e)=>{handleChange(e)
                                                values.status = 'Reserve'
                                                this.API.setNewStatus({
                                                    status : 'Reserve'
                                                })
                                            }}
                                            checked = {values.status === 'Reserve' }
                                            id="checkReserve"
                                        />
                                        <label className="custom-control-label" htmlFor="checkReserve">Reserve</label>
                                    </div>

                                    <div className="custom-control custom-checkbox d-flex" style={{width: '180%', height: '10vh'}}>
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Transferred"
                                            onChange={(e)=>{handleChange(e)
                                                values.status = 'Transferred'

                                                this.API.setNewStatus({
                                                    status : 'Transferred'
                                                })
                                            }}
                                            checked = {values.status === 'Transferred' }
                                            id="checkTransferred"
                                        />

                                        <label className="custom-control-label" htmlFor="checkTransferred">Transferred</label>
                                        <div className = "m-1 p-1" style={{width: '100%'}}>
                                            <Col xl={5} className="px-0" style={{top: '-50%', left: '15%', position: 'absolute'}}>
                                                <select 
                                                    className="custom-select my-2 w-100 float-left" 
                                                    disabled={values.status !== 'Transferred'}
                                                    name="select" 
                                                    onChange={(e)=> {
                                                        var location = e.target.value
                                                        console.log(location)
                                                        values.branch = location;
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
                                                <Col xl={4} className="px-0" style={{top: '-50%', left: '58%', position: 'absolute'}}>
                                                    {(values.branch !== 'Unchoose' && values.status === 'Transferred')
                                                        ?
                                                            <ListGroup className = "my-2 w-100 float-left shadow border border-dark" disabled={values.branch === 'Unchoose' || values.status!== 'Transferred'}
                                                                
                                                            >
                                                                {
                                                                    (() => {
                                                                        console.log(values.branch)
                                                                        var Html = []
                                                                        if(this.state.branches[values.branch]){
                                                                            Html = this.state.branches[values.branch].map((department)=>{
                                                                                console.log(values.branches)
                                                                                let html = 
                                                                                    <ListGroup.Item type="button" key = {department} name={department} className="border border-light" style={{borderRadius: '5px'}} action
                                                                                        onClick={(e)=>{

                                                                                            var department = e.target.name
                                                                                            values.department = department

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
                                    {<h5 className="text-danger">{errors.NoLocation}</h5>}
                                    {<h5 className="text-danger">{errors.NoSelect}</h5>}
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