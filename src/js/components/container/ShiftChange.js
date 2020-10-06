/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChange.js

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

import React, { Fragment } from 'react'
import { Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import GeneralConfirmForm from '../presentational/form/GeneralConfirmForm'
import DownloadPdfRequestForm from '../presentational/form/DownloadPdfRequestForm'
import Select from 'react-select'
import messageGenerator from '../../helper/messageGenerator'
import { Formik, Field, Form } from 'formik'
import { getDescription } from '../../helper/descriptionGenerator'
import pdfPackageGenerator from '../../helper/pdfPackageGenerator'
import apiHelper from '../../helper/apiHelper'
import { Title } from '../BOTComponent/styleComponent'
import { SAVE_SUCCESS } from '../../config/wordMap'

const style = {
    modalBody: {
        height: '60vh',
    },
    row: {
        wordBreak: 'break-all',
    },
    item: {
        minWidth: 30,
    },
    select: {
        control: (provided) => ({
            ...provided,
            width: 200,
        }),
    },
}

class ShiftChange extends React.Component {
    static contextType = AppContext

    formikRef = React.createRef()

    state = {
        searchResult: {
            foundResult: [],
            notFoundResult: [],
        },
        patients: {
            foundPatients: [],
            notFoundPatients: [],
        },
        fileUrl: '',
        showPdfDownloadForm: false,
        showConfirmForm: false,
        showDownloadPdfRequest: false,
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.show && !prevProps.show) {
            this.getTrackingData()
        }
    }

    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{ areaId }] = stateReducer

        apiHelper.trackingDataApiAgent
            .getTrackingData({
                locale: locale.abbr,
                user: auth.user,
                areaId,
            })
            .then((res) => {
                let foundResult = []
                let notFoundResult = []
                let foundPatients = []
                let notFoundPatients = []

                res.data
                    .filter((item) => {
                        return item.list_id == parseInt(auth.user.list_id)
                    })
                    .map((item) => {
                        switch (item.object_type) {
                            case '0':
                                if (item.found) foundResult.push(item)
                                else notFoundResult.push(item)
                                break
                            case '1':
                            case '2':
                                if (item.found) foundPatients.push(item)
                                else notFoundPatients.push(item)
                                break
                        }
                    })
                this.setState({
                    searchResult: {
                        foundResult,
                        notFoundResult,
                    },
                    patients: {
                        foundPatients,
                        notFoundPatients,
                    },
                })
            })
            .catch((err) => {
                console.log(`get tracking data failed ${err}`)
            })
    }

    confirmShift = (values) => {
        this.setState({
            showConfirmForm: true,
        })
    }

    handleConfirmFormSubmit = (authentication = '') => {
        let { values } = this.formikRef.current.state

        let { locale, auth } = this.context

        let { listName } = this.props.listName

        authentication = auth.user.name

        let shiftChangeObjectPackage = {
            searchResult: this.state.searchResult,
            patients: this.state.patients,
        }

        let pdfPackage = pdfPackageGenerator.getPdfPackage({
            option: 'shiftChange',
            user: auth.user,
            data: shiftChangeObjectPackage,
            locale,
            signature: authentication,
            additional: {
                shift: values.shift,
                area:
                    locale.texts[
                        config.mapConfig.areaOptions[auth.user.areas_id[0]]
                    ],
                name: auth.user.name,
                listName,
            },
        })

        this.state.patients.foundPatients.reduce((pkg, object) => {
            let temp = pdfPackageGenerator.getPdfPackage({
                option: 'patientRecord',
                user: auth.user,
                data: object,
                locale,
                signature: authentication,
            })

            if (pkg.pdf) {
                pkg.pdf += `
                    <div style="page-break-before:always"></div>
                `
                pkg.pdf += temp.pdf
            } else {
                pkg = temp
            }
            return pkg
        }, pdfPackage)
        apiHelper.record
            .addShiftChangeRecord({
                userInfo: auth.user,
                pdfPackage,
                shift: values.shift,
                list_id: auth.user.list_id,
            })
            .then((res) => {
                let callback = () => {
                    this.props.handleClose(() => {
                        messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                    })
                }

                this.setState(
                    {
                        fileUrl: pdfPackage.path,
                        showConfirmForm: false,
                        showDownloadPdfRequest: true,
                    },
                    callback
                )
            })
            .catch((err) => {
                console.log(`add shift change record failed ${err}`)
            })
    }

    handleClose = () => {
        this.setState({
            showConfirmForm: false,
            showDownloadPdfRequest: false,
        })
    }

    render() {
        const { locale, auth } = this.context

        const { show, handleClose, listName } = this.props

        const { foundResult, notFoundResult } = this.state.searchResult

        const { foundPatients, notFoundPatients } = this.state.patients

        const nowTime = moment()
            .locale(locale.abbr)
            .format(config.TIMESTAMP_FORMAT)
        const hasFoundResult = foundResult.length !== 0
        const hasNotFoundResult = notFoundResult.length !== 0
        const hasFoundPatients = foundPatients.length !== 0
        const hasNotFoundPatients = notFoundPatients.length !== 0

        const shiftOptions = Object.values(config.SHIFT_OPTIONS).map(
            (shift) => {
                return {
                    value: shift,
                    label: locale.texts[shift.toUpperCase().replace(/ /g, '_')],
                }
            }
        )

        const defaultShiftOption = {
            value: config.getShift(),
            label:
                locale.texts[
                    config.getShift().toUpperCase().replace(/ /g, '_')
                ],
        }

        return (
            <Fragment>
                <Modal show={show} size="lg" onHide={handleClose}>
                    <Formik
                        initialValues={{
                            shift: defaultShiftOption,
                        }}
                        ref={this.formikRef}
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.confirmShift(values)
                            // this.handleConfirmFormSubmit("", values)
                        }}
                        render={({ values, setFieldValue, submitForm }) => (
                            <Fragment>
                                <Modal.Header className="d-flex flex-column text-capitalize">
                                    <Title>
                                        {locale.texts.SHIFT_CHANGE_RECORD}
                                    </Title>
                                    <div>
                                        {locale.texts.DATE_TIME}: {nowTime}
                                    </div>
                                    <div>
                                        {
                                            locale.texts
                                                .DEVICE_LOCATION_STATUS_CHECKED_BY
                                        }
                                        : {auth.user.name}
                                    </div>
                                    <div>
                                        {locale.texts.LIST_NAME}: {listName}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {locale.texts.SHIFT}: &nbsp;
                                        <Select
                                            name="shift"
                                            options={shiftOptions}
                                            value={values.shift}
                                            onChange={(value) =>
                                                setFieldValue('shift', value)
                                            }
                                            styles={style.select}
                                        />
                                    </div>
                                </Modal.Header>
                                <Modal.Body
                                    className="overflow-hidden-scroll custom-scrollbar"
                                    style={style.modalBody}
                                >
                                    <Form className="text-capitalize">
                                        {!hasFoundResult && !hasNotFoundResult && (
                                            <div className="d-flex justify-content-center">
                                                <p className="font-italic ">
                                                    {
                                                        locale.texts
                                                            .NOT_ASSIGNED_TO_ANY_DEVICES
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <TypeBlock
                                            title={locale.texts.DEVICES_FOUND}
                                            hasType={hasFoundResult}
                                            typeArray={foundResult}
                                        />
                                        <TypeBlock
                                            title={
                                                locale.texts.DEVICES_NOT_FOUND
                                            }
                                            hasType={hasNotFoundResult}
                                            typeArray={notFoundResult}
                                        />
                                        <TypeBlock
                                            title={locale.texts.PATIENTS_FOUND}
                                            hasType={hasFoundPatients}
                                            typeArray={foundPatients}
                                        />
                                        <TypeBlock
                                            title={
                                                locale.texts.PATIENTS_NOT_FOUND
                                            }
                                            hasType={hasNotFoundPatients}
                                            typeArray={notFoundPatients}
                                        />
                                    </Form>
                                </Modal.Body>
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
                                        onClick={submitForm}
                                        disabled={
                                            !hasFoundResult &&
                                            !hasNotFoundResult
                                        }
                                    >
                                        {locale.texts.CONFIRM}
                                    </Button>
                                </Modal.Footer>
                            </Fragment>
                        )}
                    />
                </Modal>
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    title={locale.texts.PLEASE_ENTER_PASSWORD}
                    handleSubmit={this.handleConfirmFormSubmit}
                    handleClose={this.handleClose}
                    authenticatedRoles={null}
                />
                <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest}
                    pdfPath={this.state.fileUrl}
                    handleClose={this.handleClose}
                />
            </Fragment>
        )
    }
}

export default ShiftChange

const TypeBlock = ({ title, hasType, typeArray }) => {
    let appContext = React.useContext(AppContext)

    let { locale, auth, stateReducer } = appContext

    return (
        <Fragment>
            {hasType && <Title sub>{title}</Title>}
            {hasType &&
                typeArray.map((item, index) => {
                    return (
                        <div
                            className="d-flex justify-content-start"
                            key={index}
                        >
                            <div
                                style={style.item}
                                className="d-flex justify-content-center"
                            >
                                {index + 1}.
                            </div>
                            <div key={index} className="pb-1" style={style.row}>
                                {getDescription(item, locale, config)}
                            </div>
                        </div>
                    )
                })}
        </Fragment>
    )
}
