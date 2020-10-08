/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PatientViewModal.js

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
import { Modal, Button, ListGroup } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import { object } from 'yup'
import moment from 'moment'
import { AppContext } from '../../context/AppContext'
import ScrollArea from 'react-scrollbar'
import {
    EditedTime,
    Primary,
    Paragraph,
    FormFieldName,
} from '../BOTComponent/styleComponent'
import FormikFormGroup from '../presentational/FormikFormGroup'

const style = {
    index: {
        minWidth: 10,
    },
    item: {
        minWidth: 30,
    },

    blockOne: {
        minWidth: 'initial',
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
                display: true,
            })
        })
    }

    render() {
        const { show, handleClose, handleSubmit, data, title } = this.props

        const { locale, auth } = this.context

        const recordBlock = {
            display: this.state.display ? '' : 'none',
        }

        return (
            <Modal
                show={show}
                onHide={this.handleClose}
                size="md"
                enforceFocus={false}
                style={style.modal}
            >
                <Modal.Header>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            record: '',
                        }}
                        validationSchema={object().shape({})}
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
                        }) => (
                            <Form>
                                <FormikFormGroup
                                    type="text"
                                    name="name"
                                    label={locale.texts.NAME}
                                    value={data.name}
                                    error={errors.name}
                                    touched={touched.name}
                                    placeholder=""
                                    disabled
                                />
                                <FormikFormGroup
                                    type="text"
                                    name="name"
                                    label={locale.texts.PATIENT_NUMBER}
                                    value={data.asset_control_number}
                                    error={errors.name}
                                    touched={touched.name}
                                    placeholder=""
                                    disabled
                                />
                                <hr />
                                <div className="mb-2 text-capitalize">
                                    <FormFieldName>
                                        {locale.texts.ADD_NEW_RECORD}
                                    </FormFieldName>
                                    <Field
                                        component="textarea"
                                        value={values.record}
                                        name="record"
                                        className={
                                            'form-control' +
                                            (errors.record && touched.record
                                                ? ' is-invalid'
                                                : '')
                                        }
                                        rows={3}
                                    />
                                </div>
                                <FormFieldName
                                    className="mb-2 cursor-pointer"
                                    onClick={() => {
                                        this.setState({
                                            display: !this.state.display,
                                        })
                                    }}
                                >
                                    {locale.texts.PATIENT_HISTORICAL_RECORD}
                                    &nbsp;
                                    <i
                                        className={`fas ${
                                            this.state.display
                                                ? 'fa-angle-up'
                                                : 'fa-angle-down'
                                        }`}
                                    />
                                </FormFieldName>

                                <div style={recordBlock}>
                                    {data.record && data.record.length != 0 && (
                                        <hr style={{ margin: 0 }}></hr>
                                    )}

                                    <ListGroup className="text-none px-0 max-height-30 custom-scrollbar">
                                        {data.records &&
                                            data.records.length != 0 && (
                                                <div>
                                                    {data.records.map(
                                                        (item, index) => {
                                                            return recordBlockTypeTwo(
                                                                item,
                                                                index,
                                                                locale
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            )}
                                    </ListGroup>
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
        )
    }
}

const recordBlockTypeOne = (item, index, locale) => {
    return (
        <ListGroup.Item
            key={index}
            className="d-flex justify-content-start"
            style={style.blockOne}
        >
            <div style={style.index}>&bull;</div>
            &nbsp;
            <div key={index} className="pb-1" style={style.row}>
                {moment(item.create_timestamp)
                    .locale(locale.abbr)
                    .format('YYYY/MM/DD hh:mm')}
                , &nbsp;
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
            <div className="d-flex justify-content-start">
                <div className="color-black d-flex justify-content-start">
                    <Primary>{item.recorded_user}</Primary>
                    &nbsp;
                    <EditedTime>
                        {moment(item.created_timestamp)
                            .locale(locale.abbr)
                            .format('lll')}
                    </EditedTime>
                </div>
            </div>
            <Paragraph>{item.record}</Paragraph>
        </ListGroup.Item>
    )
}

export default PatientViewModal
