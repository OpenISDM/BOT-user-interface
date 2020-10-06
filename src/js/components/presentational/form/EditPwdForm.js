/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditPwdForm.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import LocaleContext from '../../../context/LocaleContext'

const EditPwdForm = ({ show, handleClose, handleSubmit }) => {
    let locale = React.useContext(LocaleContext)

    let new_password_store = ''

    return (
        <Modal show={show} onHide={handleClose} size="md">
            <Modal.Header closeButton className="text-capitalize">
                {locale.texts.EDIT_PASSWORD}
            </Modal.Header>
            <Modal.Body className="mb-2">
                <Formik
                    initialValues={{
                        new_password: '',
                        check_password: '',
                    }}
                    validationSchema={Yup.object().shape({
                        new_password: Yup.string()
                            .required(locale.texts.ENTER_THE_PASSWORD)
                            .test('new_password', '', (value) => {
                                new_password_store = value
                                return true
                            })
                            .max(20, locale.texts.LIMIT_IN_TWENTY_CHARACTER),

                        check_password: Yup.string()
                            .required(locale.texts.ENTER_THE_PASSWORD)
                            .test(
                                'check_password',
                                locale.texts.PASSWORD_NOT_FIT,
                                (value) => {
                                    if (value == new_password_store) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }
                            ),
                    })}
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit(values)
                    }}
                    render={({
                        values,
                        errors,
                        status,
                        touched,
                        isSubmitting,
                        setFieldValue,
                        submitForm,
                    }) => (
                        <Form className="text-capitalize">
                            <div className="form-group">
                                <small
                                    id="TextIDsmall"
                                    className="form-text text-muted "
                                >
                                    {locale.texts.NEW_PASSWORD}
                                </small>
                                <Field
                                    type="password"
                                    name="new_password"
                                    // placeholder={locale.texts.ENTER_THE_PASSWORD}
                                    className={
                                        'form-control' +
                                        (errors.new_password &&
                                        touched.new_password
                                            ? ' is-invalid'
                                            : '')
                                    }
                                />
                                <ErrorMessage
                                    name="new_password"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="form-group">
                                <small
                                    id="TextIDsmall"
                                    className="form-text text-muted"
                                >
                                    {locale.texts.CHECK_PASSWORD}
                                </small>
                                <Field
                                    type="password"
                                    name="check_password"
                                    // placeholder={locale.texts.ENTER_THE_PASSWORD}
                                    className={
                                        'form-control' +
                                        (errors.check_password &&
                                        touched.check_password
                                            ? ' is-invalid'
                                            : '')
                                    }
                                />
                                <ErrorMessage
                                    name="check_password"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <Modal.Footer>
                                <Button
                                    variant="outline-secondary"
                                    className="text-capitalize"
                                    onClick={handleClose}
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
    )
}

export default EditPwdForm
