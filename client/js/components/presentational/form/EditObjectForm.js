/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditObjectForm.js

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

/**
 * EditObjectForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import Creatable, { makeCreatableSelect } from 'react-select/creatable'
import config from '../../../config'
import { Formik, Field, Form } from 'formik'
import { object, string } from 'yup'
import CheckboxGroup from '../../container/CheckboxGroup'
import Checkbox from '../Checkbox'
import RadioButtonGroup from '../../container/RadioButtonGroup'
import RadioButton from '../RadioButton'
import { AppContext } from '../../../context/AppContext'
import styleConfig from '../../../config/styleConfig'
import FormikFormGroup from '../FormikFormGroup'
import {
    DISASSOCIATE,
    NORMAL,
    RETURNED,
    RESERVE,
    BROKEN,
    TRANSFERRED,
    TRACE,
} from '../../../config/wordMap'
import { isEmpty, macaddrValidation } from '../../../helper/validation'
import apiHelper from '../../../helper/apiHelper'

const monitorTypeMap = {}
Object.keys(config.monitorType).forEach((key) => {
    monitorTypeMap[config.monitorType[key]] = key
})

class EditObjectForm extends React.Component {
    static contextType = AppContext

    state = {
        transferredLocationOptions: [],
    }

    componentDidMount = () => {
        this.getTransferredLocation()
    }

    getTransferredLocation = () => {
        apiHelper.transferredLocationApiAgent
            .getAllTransferredLocation()
            .then((res) => {
                const transferredLocationOptions = res.data.map((branch) => {
                    return {
                        label: branch.name,
                        value: branch.name,
                        options: branch.departments
                            ? branch.departments.map((department, index) => {
                                return {
                                    id: department.id,
                                    label: `${branch.name}-${department.value}`,
                                    value: department.value,
                                }
                            })
                            : [],
                    }
                })
                this.setState({
                    transferredLocationOptions,
                })
            })
    }

    render() {
        const { locale } = this.context

        const areaOptions = this.props.areaTable.map((area) => {
            return {
                value: area.name,
                label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')],
                id: area.id,
            }
        })

        const {
            title,
            selectedRowData,
            objectTable,
            show,
            handleClose,
        } = this.props

        const {
            id,
            name,
            type,
            status = '',
            asset_control_number,
            mac_address,
            transferred_location,
            area_name,
            nickname,
        } = selectedRowData

        return (
            <Modal show={show} onHide={handleClose} size="md">
                <Modal.Header closeButton>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                            name: name || '',
                            type: type || '',
                            asset_control_number: asset_control_number || '',
                            mac_address: selectedRowData.isBind
                                ? {
                                    label: mac_address,
                                    value: mac_address,
                                }
                                : null,
                            status:
                                selectedRowData.length != 0
                                    ? status.value
                                    : NORMAL,
                            area: area_name || '',

                            monitorType:
                                selectedRowData.length != 0
                                    ? selectedRowData.monitor_type == 0
                                        ? null
                                        : selectedRowData.monitor_type.split(
                                            '/'
                                        )
                                    : [],
                            transferred_location:
                                status.value == TRANSFERRED
                                    ? transferred_location
                                    : ' ',
                            nickname: nickname || '',
                        }}
                        validationSchema={object().shape({
                            name: string().required(
                                locale.texts.NAME_IS_REQUIRED
                            ),

                            type: string().required(
                                locale.texts.TYPE_IS_REQUIRED
                            ),

                            asset_control_number: string()
                                .required(
                                    locale.texts
                                        .ASSET_CONTROL_NUMBER_IS_REQUIRED
                                )
                                .test(
                                    'asset_control_number',
                                    locale.texts
                                        .THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED,
                                    (value) => {
                                        if (value == undefined) return false
                                        if (!this.props.disableASN) {
                                            if (value != null) {
                                                if (
                                                    this.props.objectTable
                                                        .map((item) =>
                                                            item.asset_control_number.toUpperCase()
                                                        )
                                                        .includes(
                                                            value.toUpperCase()
                                                        )
                                                ) {
                                                    return false
                                                }
                                            }
                                        }
                                        return true
                                    }
                                ),

                            mac_address: object()
                                .nullable()
                                /** check if there are duplicated mac address in object table */
                                .test(
                                    'mac_address',
                                    locale.texts.INCORRECT_MAC_ADDRESS_FORMAT,
                                    (obj) => {
                                        if (obj == undefined) return true
                                        if (obj == null || isEmpty(obj))
                                            return true
                                        if (selectedRowData.length == 0)
                                            return true
                                        return macaddrValidation(obj.label)
                                    }
                                ),
                            // .test(
                            //     'mac_address',
                            //     locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED ,
                            //     obj => {
                            //         if (obj == undefined) return true;
                            //         if (obj == null || isEmpty(obj)) return true;
                            //         if (this.props.idleMacaddrSet.includes(obj.value.match(/.{1,2}/g).join(':'))) return true;
                            //     }
                            // ),

                            status: string().required(
                                locale.texts.STATUS_IS_REQUIRED
                            ),

                            area: string().required(
                                locale.texts.AREA_IS_REQUIRED
                            ),

                            transferred_location: object()
                                .nullable()
                                .when('status', {
                                    is: TRANSFERRED,
                                    then: object().required(
                                        locale.texts.LOCATION_IS_REQUIRED
                                    ),
                                }),
                        })}
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            const monitor_type = values.monitorType
                                ? values.monitorType
                                    .filter((item) => item)
                                    .reduce((sum, item) => {
                                        sum += parseInt(monitorTypeMap[item])
                                        return sum
                                    }, 0)
                                : 0
                            const postOption = {
                                id,
                                ...values,
                                name: values.name.trim(),
                                type: values.type.trim(),
                                nickname: values.nickname.trim(),
                                status: values.status,
                                transferred_location:
                                    values.status == TRANSFERRED
                                        ? values.transferred_location.id
                                        : null,
                                monitor_type,
                                area_id: values.area.id || 0,
                                mac_address:
                                    isEmpty(values.mac_address) ||
                                    values.mac_address == null
                                        ? null
                                        : values.mac_address.label,
                            }

                            this.props.handleSubmit(postOption)
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
                            <Form>
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup
                                            type="text"
                                            name="name"
                                            label={locale.texts.NAME}
                                            error={errors.name}
                                            touched={touched.name}
                                            placeholder=""
                                        />
                                    </Col>

                                    <Col>
                                        <FormikFormGroup
                                            type="text"
                                            name="area"
                                            label={locale.texts.AUTH_AREA}
                                            error={errors.area}
                                            touched={touched.area}
                                            placeholder=""
                                            component={() => (
                                                <Select
                                                    placeholder=""
                                                    name="area"
                                                    value={values.area}
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            'area',
                                                            value
                                                        )
                                                    }
                                                    options={areaOptions}
                                                    styles={
                                                        styleConfig.reactSelect
                                                    }
                                                    components={{
                                                        IndicatorSeparator: () =>
                                                            null,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup
                                            type="text"
                                            name="type"
                                            label={locale.texts.TYPE}
                                            error={errors.type}
                                            touched={touched.type}
                                            placeholder=""
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup
                                            type="text"
                                            name="nickname"
                                            label={locale.texts.NICKNAME}
                                            disabled={true}
                                            error={errors.nickname}
                                            touched={touched.nickname}
                                            placeholder=""
                                        />
                                    </Col>
                                </Row>
                                <Row noGutters>
                                    <Col>
                                        <FormikFormGroup
                                            name="mac_address"
                                            label={locale.texts.MAC_ADDRESS}
                                            error={errors.mac_address}
                                            touched={touched.mac_address}
                                            component={() => (
                                                <Creatable
                                                    name="mac_address"
                                                    value={values.mac_address}
                                                    className="my-1"
                                                    onChange={(obj) => {
                                                        obj.label = obj.value
                                                            .match(/.{1,2}/g)
                                                            .join(':')
                                                        setFieldValue(
                                                            'mac_address',
                                                            obj
                                                        )
                                                    }}
                                                    options={
                                                        this.props.macOptions
                                                    }
                                                    isSearchable={true}
                                                    isDisabled={
                                                        selectedRowData.isBind
                                                    }
                                                    styles={
                                                        styleConfig.reactSelect
                                                    }
                                                    placeholder=""
                                                    components={{
                                                        IndicatorSeparator: () =>
                                                            null,
                                                    }}
                                                />
                                            )}
                                        />
                                    </Col>
                                    <Col>
                                        <FormikFormGroup
                                            type="text"
                                            name="asset_control_number"
                                            label={locale.texts.ACN}
                                            error={errors.asset_control_number}
                                            touched={
                                                touched.asset_control_number
                                            }
                                        />
                                    </Col>
                                </Row>

                                <hr />
                                <FormikFormGroup
                                    name="status"
                                    label={locale.texts.STATUS}
                                    error={errors.status}
                                    touched={touched.status}
                                    placeholder=""
                                    component={() => (
                                        <RadioButtonGroup
                                            value={values.status}
                                            error={errors.status}
                                            touched={touched.status}
                                        >
                                            <div className="d-flex justify-content-between form-group my-1">
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={BROKEN}
                                                    label={locale.texts.BROKEN}
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={TRANSFERRED}
                                                    label={
                                                        locale.texts.TRANSFERRED
                                                    }
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={RETURNED}
                                                    label={
                                                        locale.texts.RETURNED
                                                    }
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={RESERVE}
                                                    label={locale.texts.RESERVE}
                                                />
                                                <Field
                                                    component={RadioButton}
                                                    name="status"
                                                    id={TRACE}
                                                    label={locale.texts.TRACE}
                                                />
                                            </div>
                                        </RadioButtonGroup>
                                    )}
                                />
                                <FormikFormGroup
                                    name="transferred_location"
                                    label={locale.texts.AREA}
                                    error={errors.transferred_location}
                                    touched={touched.transferred_location}
                                    placeholder=""
                                    display={values.status == TRANSFERRED}
                                    component={() => (
                                        <Select
                                            name="transferred_location"
                                            value={values.transferred_location}
                                            className="my-1"
                                            onChange={(value) =>
                                                setFieldValue(
                                                    'transferred_location',
                                                    value
                                                )
                                            }
                                            options={
                                                this.state
                                                    .transferredLocationOptions
                                            }
                                            isSearchable={false}
                                            isDisabled={
                                                values.status != TRANSFERRED
                                            }
                                            styles={styleConfig.reactSelect}
                                            placeholder={
                                                locale.texts.SELECT_LOCATION
                                            }
                                            components={{
                                                IndicatorSeparator: () => null,
                                            }}
                                        />
                                    )}
                                />
                                <hr />
                                <FormikFormGroup
                                    name="asset_control_number"
                                    label={locale.texts.MONITOR_TYPE}
                                    error={errors.monitorType}
                                    touched={touched.monitorType}
                                    placeholder=""
                                    component={() => (
                                        <CheckboxGroup
                                            id="monitorType"
                                            label={locale.texts.MONITOR_TYPE}
                                            value={values.monitorType || ''}
                                            error={errors.monitorType}
                                            touched={touched.monitorType}
                                            onChange={setFieldValue}
                                        >
                                            {Object.keys(config.monitorType)
                                                .filter((key) =>
                                                    config.monitorTypeMap.object.includes(
                                                        parseInt(key)
                                                    )
                                                )
                                                .map((key, index) => {
                                                    return (
                                                        <Field
                                                            key={index}
                                                            component={Checkbox}
                                                            name="monitorType"
                                                            id={
                                                                config
                                                                    .monitorType[
                                                                        key
                                                                    ]
                                                            }
                                                            label={
                                                                config
                                                                    .monitorType[
                                                                        key
                                                                    ]
                                                            }
                                                        />
                                                    )
                                                })}
                                        </CheckboxGroup>
                                    )}
                                />
                                <Modal.Footer>
                                    <div className="mr-auto">
                                        <Button
                                            onClick={this.props.handleClick}
                                            variant="link"
                                            name={DISASSOCIATE}
                                            disabled={!selectedRowData.isBind}
                                        >
                                            {locale.texts.UNBIND}
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleClose}
                                        >
                                            {locale.texts.CANCEL}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            disabled={isSubmitting}
                                            onClick={submitForm}
                                        >
                                            {locale.texts.SAVE}
                                        </Button>
                                    </div>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}

export default EditObjectForm
