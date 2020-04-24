import React from 'react';
import { 
    Modal, 
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Form, 
} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import axios from 'axios';
import dataSrc from '../../../dataSrc';
import FormikFormGroup from '../../presentational/FormikFormGroup'
import styleConfig from '../../../config/styleConfig';
import LocaleContext from '../../../context/LocaleContext';
import messageGenerator from '../../../service/messageGenerator'
const DeleteUserForm = ({
    show,
    title,
    data,
    handleClose,
    handleSubmit
}) => {
    let locale = React.useContext(LocaleContext)

    const userOptions = data.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    })

    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {title}
            </Modal.Header >

            <Modal.Body>
                <Formik                    
                    initialValues = {{
                        name: ''
                    }}

                    validationSchema = {
                        Yup.object().shape({
                            name: Yup.string().required(locale.texts.NAME_IS_REQUIRED)
                        })
                    }

                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit(values)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                      
                        <Form className="text-capitalize">
                            <FormikFormGroup 
                                type="text"
                                name="nameName"
                                label={locale.texts.DELETE}
                                error={errors.nameName}
                                touched={touched.nameName}
                                placeholder={locale.texts.USERNAME}
                                component={() => (
                                    <Select
                                        placeholder = {locale.texts.SELECT_USER}
                                        name="name"
                                        value = {values.name}
                                        onChange={value => setFieldValue("name", value)}
                                        options={userOptions}
                                        styles={styleConfig.reactSelect}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                )}
                            />

                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClose}
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.DELETE}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default DeleteUserForm