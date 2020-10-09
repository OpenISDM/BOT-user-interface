/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditImportTable.js

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

import React, { Component } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import config from '../../config'
import LocaleContext from '../../context/LocaleContext'
import axios from 'axios'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { cleanImportData, deleteImportData } from '../../dataSrc'
import messageGenerator from '../../helper/messageGenerator'
import { isEqual } from '../../helper/utilities'

class EditImportTable extends React.Component {
    state = {
        show: this.props.show,
        inputValue: '',
        scanValue: '',
    }

    componentDidUpdate = (prevProps) => {
        if (!isEqual(prevProps, this.props)) {
            this.setState({
                show: this.props.show,
            })
        }
    }

    handleClose = () => {
        this.setState({
            inputValue: '',
            scanValue: '',
        })
        this.props.handleCloseForm()
    }

    handleSubmit = (postOption) => {
        if (
            this.state.scanValue ==
            this.props.selectedObjectData.asset_control_number
        ) {
            axios
                .post(deleteImportData, {
                    idPackage: this.props.selectedObjectData.id,
                })
                .then((res) => {
                    toast.success('Edit Import Table Success', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: true,
                    })
                    setTimeout(this.props.handleSubmitForm(), 500)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            alert('ＴＡＧ與產品編號不符')
            this.setState({
                scanValue: '',
            })
        }

        this.props.handleCloseForm()
    }

    updateInput = (event) => {
        this.setState({ scanValue: event.target.value })
    }

    render() {
        const locale = this.context

        const { title, selectedObjectData } = this.props
        const {
            name,
            type,
            asset_control_number,
            mac_address,
        } = selectedObjectData

        return (
            <Modal show={this.state.show} onHide={this.handleClose} size="md">
                <Modal.Header
                    closeButton
                    className="font-weight-bold text-capitalize"
                >
                    {locale.texts.BINDING_SETTING}
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{}}
                        validationSchema={null}
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.handleSubmit()
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
                                    <Field
                                        type="text"
                                        name="ASN"
                                        placeholder="Asset control number"
                                        className={
                                            'form-control' +
                                            (errors.ASN && touched.ASN
                                                ? ' is-invalid'
                                                : '')
                                        }
                                        value={
                                            selectedObjectData.asset_control_number
                                        }
                                    />
                                    <ErrorMessage
                                        name="ASN"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group">
                                    <Field
                                        type="text"
                                        name="MAC_Address"
                                        placeholder="MAC_Address"
                                        className={
                                            'form-control' +
                                            (errors.MAC_Address &&
                                            touched.MAC_Address
                                                ? ' is-invalid'
                                                : '')
                                        }
                                        value={
                                            selectedObjectData.mac_address || ''
                                        }
                                        disabled={true}
                                    />
                                    <ErrorMessage
                                        name="MAC_Address"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <hr />

                                {/* <div className="form-group">
                                   <Field
                                    type="text"
                                    name="MAC_Address_Check"
                                    placeholder={locale.texts.SCAN_TAG}
                                    className={'form-control' + (errors.MAC_Address_Check && touched.MAC_Address_Check ? ' is-invalid' : '')}
                                    value = {this.state.scanValue}
                                    onChange={this.updateInput}
                                    />
                                      <ErrorMessage name="MAC_Address_Check" component="div" className="invalid-feedback" />
                        </div> */}

                                <Modal.Footer>
                                    <Button
                                        variant="outline-secondary"
                                        className="text-capitalize"
                                        onClick={this.handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="text-capitalize"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        onClick={this.handleSubmit}
                                    >
                                        {locale.texts.BINDING_DELETE}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}

EditImportTable.contextType = LocaleContext

export default EditImportTable
