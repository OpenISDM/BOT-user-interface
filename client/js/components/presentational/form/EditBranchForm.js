/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditBranchForm.js

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
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import FormikFormGroup from '../FormikFormGroup'
import Creatable, { makeCreatableSelect } from 'react-select/creatable'

import { FormFieldName } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import styleConfig from '../../../config/styleConfig'
import LocaleContext from '../../../context/LocaleContext'

const EditBranchForm = ({
    show,
    handleClose,
    handleSubmit,
    title,
    branchOptions,
}) => {
    const locale = React.useContext(LocaleContext)

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="text-capitalize">
                {title}
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: '',
                        department: '',
                    }}
                    onSubmit={(values) => {
                        handleSubmit(values)
                    }}
                    render={({
                        values,
                        errors,
                        status,
                        touched,
                        isSubmitting,
                        setFieldValue,
                    }) => (
                        <Form>
                            <FormikFormGroup
                                type="text"
                                name="name"
                                label={locale.texts.TRANSFERRED_LOCATION}
                                error={errors.name}
                                touched={touched.name}
                                placeholder=""
                                component={() => (
                                    <Creatable
                                        placeholder=""
                                        name="name"
                                        value={values.area}
                                        onChange={(value) =>
                                            setFieldValue('name', value)
                                        }
                                        options={branchOptions}
                                        styles={styleConfig.reactSelect}
                                        components={{
                                            IndicatorSeparator: () => null,
                                        }}
                                    />
                                )}
                            />
                            <FormikFormGroup
                                type="text"
                                name="department"
                                label={locale.texts.DEPARTMENT}
                                placeholder=""
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

export default EditBranchForm
