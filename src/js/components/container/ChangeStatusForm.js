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
            show: this.props.show,
            isShowForm: false,
            status : '',
            transferred_location : '',
            ShouldUpdate: false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddTransferDevices = this.handleAddTransferDevices.bind(this)
    }
    

    componentDidUpdate(prevProps, prevState) {
        
        const { selectedObjectData } = this.props
        

        if(prevProps.ShouldUpdate !== this.props.ShouldUpdate){

            let selectedObjectData = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData : []

            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }



        
    }

    handleClose(e) {

        if(this.props.handleChangeObjectStatusForm) {
            this.props.handleChangeObjectStatusForm('close', null);
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


    

    handleSubmit(e) {
        var option = []
        option.status = this.state.status
        option.transferred_location = this.state.transferred_location 
   
        if(this.props.handleChangeObjectStatusForm) {
            this.props.handleChangeObjectStatusForm('submit', option);
        }
    }

    handleAddTransferDevices(state){
        if(state !== false){
            this.props.handleChangeObjectStatusForm('AddTransferDevices', true)
        }
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

        

        let { title } = this.props;
        let a = this.props.selectedObjectData.length !== 0 ? this.props.selectedObjectData : []


        return (
            <>
                <Modal show={this.state.show} onHide={this.handleClose} size="md" style={customModalStyles.content} backdrop="static">
                    <Modal.Header closeButton className='font-weight-bold'>
                        {title}
                    </Modal.Header>
                    <Modal.Body>
                        
                            <div style={{maxHeight: '25vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                                {this.generateDeviceList()}
                            </div>
                            <hr/>
                            <Formik
                                initialValues={{ Normal:false, Broken: false, Reserve: false, Transferred: false, status: '' }}
                                validate={values => {
                                    let errors = {};

                                    if (!values.Normal && !values.Broken &&!values.Reserve&&!values.Transferred) {
                                        errors.NoSelect = 'You should at least select one status';
                                    } 
                                    return errors;
                                }}
                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        this.setState({
                                            status: values.status
                                        })
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
                                <form onSubmit={handleSubmit} className="justify-content-center">

                                    {errors.email && touched.email && errors.email}

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Normal"
                                            onChange={(e)=>{handleChange(e);
                                                values.status = 'Normal';
                                                this.setState({
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
                                                this.setState({
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
                                            onChange={(e)=>{handleChange(e);
                                                values.status = 'Reserve';
                                                this.setState({
                                                    status : 'Reserve'
                                                })
                                            }}
                                            checked = {values.status === 'Reserve' }
                                            id="checkReserve"
                                        />
                                        <label className="custom-control-label" htmlFor="checkReserve">Reserve</label>
                                    </div>

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="Transferred"
                                            onChange={(e)=>{handleChange(e);
                                                values.status = 'Transferred';

                                                this.setState({
                                                    status : 'Transferred'
                                                })
                                            }}
                                            checked = {values.status === 'Transferred' }
                                            id="checkTransferred"
                                        />

                                        <label className="custom-control-label" htmlFor="checkTransferred">Transferred</label>

                                        <select className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                            <option value>Choose...</option>
                                            {
                                                config.transferredLocation.map((location, index)=>{
                                                    var html =  <option value={index} key={index}>
                                                                    {location}
                                                                </option>
                                                    return html
                                                })
                                            }
                                        </select>

                                     

                                            


                                    
                                    </div>

                                    <Button name="AddDevices" onClick={this.handleAddTransferDevices}>
                                        Add Devices
                                    </Button>
                                    
                                   
                                   
                                    
                                    
                                </form>
                            )}
                            </Formik>

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