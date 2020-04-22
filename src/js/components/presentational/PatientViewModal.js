import React from 'react';
import { 
    Modal, 
    Button, 
    ListGroup
} from 'react-bootstrap'
import { 
    Formik, 
    Field, 
    Form, 
} from 'formik';
import * as Yup from 'yup';
import moment from 'moment'
import { AppContext } from '../../context/AppContext';
import ScrollArea from 'react-scrollbar'
import {
    EditedTime,
    Primary,
    Paragraph 
} from '../BOTComponent/styleComponent'

const style = {
    index: {
        minWidth: 10,
    },
    item: {
        minWidth: 30,
    },
    scrollArea: {
        maxHeight: 500
    },
    blockOne: {
        minWidth: 'initial'
    },

}

class PatientViewModal extends React.Component {
   
    static contextType = AppContext

    state = {
        display: true,
    }

    handleClose = () => {
        this.props.handleClose(() => {
            this.setState({
                display: true
            })
        })
    }

    render() {

        let {
            show, 
            handleClose,
            handleSubmit,
            data,
            title
        } = this.props

        let {
            locale,
            auth
        } = this.context

        let recordBlock = {
            display: this.state.display ? '' : 'none',
        }

        return (
            <Modal  
                show={show}
                onHide={this.handleClose} 
                size="lg" 
                className='text-capitalize'
                enforceFocus={false}
                style={style.modal}
            >
                <Modal.Header>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header >
                <Modal.Body>
                    <Formik
                        initialValues = {{
                            record: ""
                        }}
    
                        validationSchema = {
                            Yup.object().shape({
    
                        })}
    
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            handleSubmit(values)
                        }}
    
                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <div
                                    className='d-flex flex-column'
                                >                       
                                    <div>
                                        {locale.texts.NAME}: {data.name} 
                                    </div>
                                    <div>
                                        {locale.texts.PATIENT_NUMBER}: {data.asset_control_number} 
                                    </div>
                                </div>
                                <hr/>
                                <div 
                                    className="mb-2 text-capitalize"
                                >
                                    <small 
                                        className="form-text text-muted"
                                    >
                                        {locale.texts.ADD_NEW_RECORD}
                                    </small>
                                    <Field 
                                        component="textarea"
                                        value={values.record}
                                        name="record"
                                        className={'form-control' + (errors.record && touched.record ? ' is-invalid' : '')} 
                                        placeholder={locale.texts.TYPING}
                                        rows={4}
                                    />
                                </div>
                                <div
                                    className="mb-2 cursor-pointer"
                                    onClick={() => {
                                        this.setState({
                                            display: !this.state.display
                                        })
                                    }}                                    
                                >
                                    {locale.texts.PATIENT_HISTORICAL_RECORD} 
                                    &nbsp;
                                    <i 
                                        className={`fas ${this.state.display ? 'fa-angle-up' : 'fa-angle-down'}`}
                                    />
                                </div>
                                
                                
                                <div
                                    style={recordBlock}
                                >
                                    {data.record && data.record.length != 0 && <hr style={{margin: 0}}></hr>}

                                    <ScrollArea
                                        // smoothScrolling={true}
                                        horizontal={false}
                                        style={style.scrollArea}
                                    >
                                        <ListGroup
                                            className='text-none px-0'
                                        >
                                            {data.records && data.records.length != 0 
                                                &&   (
                                                    <div>
                                                        {data.records.map((item, index) => {
                                                            return (
                                                                recordBlockTypeTwo(item, index, locale)
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            }
                                        </ListGroup>
                                    </ScrollArea>
                                </div>
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

const recordBlockTypeOne = (item, index, locale) => {

    return (
        <ListGroup.Item
            key={index}
            className="d-flex justify-content-start"
            style={style.blockOne}
        >
            <div 
                style={style.index}
            >
                &bull;
            </div>
            &nbsp;
            <div 
                key={index} 
                className="pb-1"
                style={style.row}
            >
                {moment(item.create_timestamp).locale(locale.abbr).format('YYYY/MM/DD hh:mm')},
                &nbsp;
                {item.notes}
            </div>
        </ListGroup.Item>
    )
}


const recordBlockTypeTwo = (item, index, locale) => {

    return (
        <ListGroup.Item
            key={index}
            style={style.blockOne}
            className="pl-0 mb-3"
        >
            <div
                className="d-flex justify-content-start"
            >
                <div
                    className="font-color-black d-flex justify-content-start"
                >
                    <Primary>
                        {item.recorded_user}
                    </Primary>
                    &nbsp;
                    <EditedTime>
                        {moment(item.created_timestamp).locale(locale.abbr).format('lll')}
                    </EditedTime>
                </div>
            </div>
            <Paragraph>
                {item.record}
            </Paragraph>

        </ListGroup.Item>
    )
}
  
export default PatientViewModal;