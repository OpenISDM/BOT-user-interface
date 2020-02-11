import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from './DateTimePicker'
import { AppContext } from '../../context/AppContext';
import Switcher from './Switcher'
import styleConfig from '../../styleConfig';
import FormikFormGroup from '../presentational/FormikFormGroup'

class EditGeofenceConfig extends React.Component {

    static contextType = AppContext

    handleClose = () => {
        this.props.handleClose()
    }
    
    render() {
        const { 
            locale,
            auth
        } = this.context

        let { 
            selectedData,
            isEdited,
            areaOptions
        } = this.props;

        return (
            <Modal  
                show={this.props.show} 
                onHide={this.handleClose} 
                size="md" 
                id='EditGeofenceConfig' 
                enforceFocus={false}
            >
                <Modal.Header 
                    closeButton 
                    className='font-weight-bold text-capitalize'
                >
                    {locale.texts[this.props.title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            enable: selectedData ? selectedData.enable : 1,
                            area: selectedData ? selectedData.area : '',
                            start_time: selectedData ? selectedData.start_time : '',
                            end_time: selectedData ? selectedData.end_time : '',
                        }}

                        validationSchema = {
                            Yup.object().shape({
 
                        })}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let monitorConfigPackage = {
                                ...values,
                                id: isEdited ? selectedData.id : '',
                                type: this.props.type,
                                area_id: values.area.id,
                            }
                            this.props.handleSubmit(monitorConfigPackage)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form className="text-capitalize">
                                <Row className="d-flex align-items-center">
                                    <Col>
                                        <Switcher
                                            leftLabel="on"
                                            rightLabel="off"
                                            onChange={e => {
                                                let { value }= e.target
                                                setFieldValue('enable', value)
                                            }}
                                            status={values.enable}
                                            type={this.props.type}
                                        />
                                    </Col>

                                </Row>

                                <hr/>

                                <FormikFormGroup 
                                    label={locale.texts.AREA}
                                    error={errors.area}
                                    touched={touched.area}
                                    placeholder=""
                                    component={() => (
                                        <Select
                                            placeholder={locale.texts.SELECT_AREA}
                                            name='area'
                                            options={areaOptions}
                                            value={values.area}
                                            styles={styleConfig.reactSelect}
                                            isDisabled={isEdited}
                                            onChange={value => setFieldValue('area', value)}
                                            components={{
                                                IndicatorSeparator: () => null,
                                            }}
                                        />
                                    )}
                                />
        
                                <Row noGutters>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_START_TIME}</small>
                                        <DateTimePicker
                                            value={values.start_time}
                                            getValue={value => {
                                                setFieldValue("start_time", value.value)
                                                if (parseInt(values.end_time.split(':')[0]) <= parseInt(value.value.split(':')[0])) {
                                                    let resetTime = [parseInt(value.value.split(':')[0]) + 1, values.end_time.split(':')[1]].join(':')
                                                    setFieldValue("end_time", resetTime)
                                                }
                                            }}
                                            name="start_time"
                                            start="0"
                                            end="23"
                                        />
                                    </Col>
                                    <Col>
                                        <small  className="form-text text-muted">{locale.texts.ENABLE_END_TIME}</small>
                                        <DateTimePicker
                                            value={values.end_time}
                                            getValue={value => setFieldValue("end_time", value.value)}
                                            name="end_time"
                                            start={parseInt(values.start_time.split(':')[0]) + 1}
                                            end="24"
                                        />
                                    </Col>
                                </Row>

                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="text-capitalize" 
                                        onClick={this.handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="text-capitalize" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                    >
                                        {locale.texts.SAVE}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default EditGeofenceConfig;
