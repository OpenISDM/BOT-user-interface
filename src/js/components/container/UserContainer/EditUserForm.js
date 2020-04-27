import React from 'react';
import { 
    Modal, 
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Field, 
    Form, 
} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import config from '../../../config';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../../presentational/Checkbox';
import FormikFormGroup from '../../presentational/FormikFormGroup';
import styleConfig from '../../../config/styleConfig';
import LocaleContext from '../../../context/LocaleContext';
import messageGenerator from '../../../service/messageGenerator';


const EditUserForm = ({
    show,
    title,
    selectedUser,
    handleSubmit,
    handleClose,
    roleName,
    data,
    areaTable
}) => {

    let locale = React.useContext(LocaleContext)

    const areaOptions = areaTable.map(area => {
        return {
            value: area.name,
            label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')],
            id: area.id
        };
    })

    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
        >
            <Modal.Header 
                closeButton 
                className='text-capitalize'
            >
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header >
           
            <Modal.Body>
                <Formik                    
                    initialValues = {{
                        name: selectedUser ? selectedUser.name : '',
                        password: '',
                        roles: selectedUser ? selectedUser.role_type : config.defaultRole,
                        area: selectedUser ? selectedUser.main_area : '',
                    }}

                    validationSchema = {
                        Yup.object().shape({
                            name: Yup.string()
                                .required(locale.texts.USERNAME_IS_REQUIRED)
                                .test({
                                    name: 'name', 
                                    message: locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
                                    test: value => {
                                        let reapeatFlag = true
                                        data.map(item => {
                                            item.name == value ? reapeatFlag = false : null
                                        })
                                         if (selectedUser) { selectedUser.name == value ? reapeatFlag = true : null }
                                      return reapeatFlag
                                    },
                                })
                                .max(100),
                            area: selectedUser ? null : Yup.object().required(locale.texts.AREA_IS_REQUIRED),
                            password: selectedUser ? '' : Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED),
                            roles: Yup.string().required(locale.texts.ROLE_IS_REQUIRED)
                        })
                    }

                    onSubmit={values => {
                        handleSubmit(values)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form className="text-capitalize">
                            <FormikFormGroup 
                                type="text"
                                name="name"
                                label={locale.texts.NAME}
                                error={errors.name}
                                touched={touched.name}
                                placeholder={locale.texts.USERNAME}
                                
                            />
                            <FormikFormGroup 
                                type="text"
                                name="password"
                                label={locale.texts.PASSWORD}
                                error={errors.password}
                                touched={touched.password}
                                placeholder={locale.texts.PASSWORD}
                                display={!selectedUser}
                            />
                            <hr/>
                            <FormikFormGroup 
                                name="roles"
                                label={locale.texts.ROLES}
                                error={errors.roles}
                                touched={touched.roles}
                                component={() => (
                                    <CheckboxGroup
                                        id="roles"
                                        value={values.roles}
                                        onChange={setFieldValue}                                            
                                    >
                                        {roleName
                                            .filter(roleName => roleName.name !== 'guest')
                                            .map((roleName, index) => {
                                                return (
                                                    <Field
                                                        component={Checkbox}
                                                        key={index}
                                                        name="roles"
                                                        id={roleName.name}
                                                        label={locale.texts[roleName.name.toUpperCase()]}
                                                    />
                                                )
                                        })}
                                    </CheckboxGroup>
                                )}
                            />
                            <hr/>
                            <FormikFormGroup 
                                type="text"
                                name="areaName"
                                label={locale.texts.MAIN_AREA}
                                error={errors.area}
                                touched={touched.area}
                                component={() => (
                                    <Select
                                        placeholder = {locale.texts.SELECT_AREA}
                                        name="area"
                                        value={values.area}
                                        onChange={value => setFieldValue("area", value)}
                                        options={areaOptions}
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
                                    {locale.texts.SAVE}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default EditUserForm