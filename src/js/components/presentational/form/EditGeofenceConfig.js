/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditGeofenceConfig.js

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
import Select from 'react-select'
import { Formik, Field, Form } from 'formik'
import { object, string, array } from 'yup'
import DateTimePicker from '../../container/DateTimePicker'
import { AppContext } from '../../../context/AppContext'
import Switcher from '../../container/Switcher'
import styleConfig from '../../../config/styleConfig'
import LocaleContext from '../../../context/LocaleContext'
import FormikFormGroup from '../FormikFormGroup'
import RadioButtonGroup from '../../container/RadioButtonGroup'
import RadioButton from '../RadioButton'

const style = {
    icon: {
        minus: {
            color: 'red',
            cursor: 'pointer',
        },
        add: {
            color: 'rgb(0, 123, 255, 0.6)',
            cursor: 'pointer',
        },
    },
    error: {
        color: '#dc3545',
    },
}
const lbeacon_error = {
    f: '',
    p: '',
}

const EditGeofenceConfig = ({
    selectedData,
    isEdited,
    show,
    handleClose,
    areaOptions,
    title,
    handleSubmit,
    type,
    lbeaconsTable,
}) => {
    const appContext = React.useContext(AppContext)

    const { auth, locale } = appContext

    areaOptions = auth.user.areas_id
        .filter((item) => {
            return areaOptions[item]
        })
        .map((item) => {
            return {
                value: areaOptions[item],
                label: locale.texts[areaOptions[item]],
                id: item,
            }
        })

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="md"
            id="EditGeofenceConfig"
            enforceFocus={false}
            className="text-capitalize"
        >
            <Modal.Header closeButton>
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header>

            <Modal.Body>
                <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{
                        enable: selectedData ? selectedData.enable : 1,
                        geofenceName: selectedData ? selectedData.name : '',
                        area: selectedData ? selectedData.area : '',
                        start_time: selectedData ? selectedData.start_time : '',
                        end_time: selectedData ? selectedData.end_time : '',
                        p_lbeacon: selectedData
                            ? selectedData.parsePerimeters.lbeacons
                            : [],
                        f_lbeacon: selectedData
                            ? selectedData.parseFences.lbeacons
                            : [],
                        p_rssi: selectedData
                            ? selectedData.parsePerimeters.rssi
                            : '',
                        f_rssi: selectedData
                            ? selectedData.parseFences.rssi
                            : '',
                        selected_p_lbeacon: null,
                        selected_f_lbeacon: null,
                        isGlobal: selectedData
                            ? selectedData.is_global_fence
                            : 1,
                    }}
                    validationSchema={object().shape({
                        geofenceName: string().required(
                            locale.texts.NAME_IS_REQUIRED
                        ),
                        p_rssi: string()
                            .required(locale.texts.ENTER_THE_RSSI)
                            .test(
                                'p_rssi',
                                locale.texts.MUST_BE_NEGATIVE_NUMBER,
                                (value) => {
                                    if (value < 0) return true
                                }
                            ),
                        f_rssi: string()
                            .required(locale.texts.ENTER_THE_RSSI)
                            .test(
                                'f_rssi',
                                locale.texts.MUST_BE_NEGATIVE_NUMBER,
                                (value) => {
                                    if (value < 0) return true
                                }
                            ),
                        start_time: string().required(
                            locale.texts.NAME_IS_REQUIRED
                        ),
                        end_time: string().required(
                            locale.texts.NAME_IS_REQUIRED
                        ),
                        area: string().required(locale.texts.AREA_IS_REQUIRED),
                        p_lbeacon: array().required(
                            locale.texts.ALEAST_CHOOSE_ONE_UUID
                        ),
                        f_lbeacon: array().required(
                            locale.texts.ALEAST_CHOOSE_ONE_UUID
                        ),
                    })}
                    onSubmit={(values, { setStatus, setSubmitting }, error) => {
                        const monitorConfigPackage = {
                            ...values,
                            id: isEdited ? selectedData.id : '',
                            type,
                            perimeters: transferTypeToString(
                                values.p_lbeacon,
                                values.p_rssi
                            ),
                            fences: transferTypeToString(
                                values.f_lbeacon,
                                values.f_rssi
                            ),
                            area_id: values.area.id,
                            action: isEdited ? 'set' : 'add',
                            is_global_fence: values.isGlobal,
                        }
                        handleSubmit(monitorConfigPackage)
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
                            {(lbeacon_error.f = errors.f_lbeacon) && ''}
                            {(lbeacon_error.p = errors.p_lbeacon) && ''}
                            <Row className="d-flex align-items-center">
                                <Col>
                                    <Switcher
                                        leftLabel="on"
                                        rightLabel="off"
                                        onChange={(e) => {
                                            const { value } = e.target
                                            setFieldValue('enable', value)
                                        }}
                                        status={values.enable}
                                        type={type}
                                    />
                                </Col>
                                <Col>
                                    <FormikFormGroup
                                        name="isGlobal"
                                        label={locale.texts.IS_GLOBAL_FENCE}
                                        errors={errors.isGlobal}
                                        touched={touched.isGlobal}
                                        placeholder=""
                                        component={() => (
                                            <RadioButtonGroup
                                                value={parseInt(
                                                    values.isGlobal
                                                )}
                                            >
                                                <div className="d-flex justify-content-start form-group my-1">
                                                    <Field
                                                        component={RadioButton}
                                                        name="isGlobal"
                                                        id={1}
                                                        label={locale.texts.YES}
                                                    />
                                                    <Field
                                                        component={RadioButton}
                                                        name="isGlobal"
                                                        id={0}
                                                        label={locale.texts.NO}
                                                    />
                                                </div>
                                            </RadioButtonGroup>
                                        )}
                                    />
                                </Col>
                            </Row>

                            <hr />
                            <Row noGutters>
                                <Col>
                                    <FormikFormGroup
                                        type="text"
                                        name="geofenceName"
                                        label={locale.texts.NAME}
                                        error={errors.name}
                                        touched={touched.name}
                                        placeholder=""
                                    />
                                </Col>
                                <Col>
                                    <FormikFormGroup
                                        label={locale.texts.AREA}
                                        error={errors.area}
                                        touched={touched.area}
                                        placeholder=""
                                        component={() => (
                                            <Select
                                                placeholder={
                                                    locale.texts.SELECT_AREA
                                                }
                                                name="area"
                                                options={areaOptions}
                                                value={values.area}
                                                styles={styleConfig.reactSelect}
                                                isDisabled={isEdited}
                                                onChange={(value) =>
                                                    setFieldValue('area', value)
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
                                    <small className="form-text text-muted">
                                        {locale.texts.ENABLE_START_TIME}
                                    </small>
                                    <DateTimePicker
                                        value={values.start_time}
                                        getValue={(value) => {
                                            setFieldValue(
                                                'start_time',
                                                value.value
                                            )
                                        }}
                                        name="start_time"
                                        start="0"
                                        end="23"
                                        error={errors.start_time}
                                        error_tip={
                                            locale.texts.START_TIME_IS_REQUIRED
                                        }
                                    />
                                </Col>
                                <Col>
                                    <small className="form-text text-muted">
                                        {locale.texts.ENABLE_END_TIME}
                                    </small>
                                    <DateTimePicker
                                        value={values.end_time}
                                        getValue={(value) => {
                                            setFieldValue(
                                                'end_time',
                                                value.value
                                            )
                                        }}
                                        name="end_time"
                                        start="0"
                                        end="24"
                                        error={errors.end_time}
                                        error_tip={
                                            locale.texts.END_TIME_IS_REQUIRED
                                        }
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <TypeGroup
                                type="perimeters"
                                abbr="p"
                                title={locale.texts.PERIMETERS_GROUP}
                                repository={values.p_lbeacon}
                                values={values}
                                error={errors}
                                setFieldValue={setFieldValue}
                                parseLbeaconsGroup={parseLbeaconsGroup}
                                lbeaconsTable={lbeaconsTable}
                            />

                            <hr />
                            <TypeGroup
                                type="fences"
                                abbr="f"
                                title={locale.texts.FENCES_GROUP}
                                repository={values.f_lbeacon}
                                values={values}
                                error={errors}
                                setFieldValue={setFieldValue}
                                parseLbeaconsGroup={parseLbeaconsGroup}
                                lbeaconsTable={lbeaconsTable}
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

export default EditGeofenceConfig

const parseLbeaconsGroup = (type, index) => {
    return [...type.slice(0, index), ...type.slice(index + 1)]
}

const transferTypeToString = (typeGroup, rssi) => {
    return [typeGroup.length, ...typeGroup, rssi].join(',') + ','
}

const TypeGroup = ({
    type,
    abbr,
    title,
    repository,
    values,
    error,
    setFieldValue,
    parseLbeaconsGroup,
    lbeaconsTable,
}) => {
    const locale = React.useContext(LocaleContext)

    const lbeaconOptions_p = lbeaconsTable
        .filter((item) => {
            const uuid = item.uuid.replace(/-/g, '')
            return !values.p_lbeacon.includes(uuid)
        })
        .reduce((options, item, index) => {
            const uuid = item.uuid.replace(/-/g, '')
            options.push({
                id: item.id,
                value: uuid,
                label: `${item.description}[${uuid}]`,
            })
            return options
        }, [])

    const lbeaconOptions_f = lbeaconsTable
        .filter((item) => {
            const uuid = item.uuid.replace(/-/g, '')
            return !values.f_lbeacon.includes(uuid)
        })
        .reduce((options, item, index) => {
            const uuid = item.uuid.replace(/-/g, '')
            options.push({
                id: item.id,
                value: uuid,
                label: `${item.description}[${uuid}]`,
            })
            return options
        }, [])

    const typeRssi = `${abbr}_rssi`
    return (
        <div className="form-group">
            <small className="form-text">{title}</small>
            <FormikFormGroup
                type="text"
                name={typeRssi}
                label={locale.texts.RSSI}
                error={error[typeRssi]}
                touched={error[typeRssi]}
                placeholder=""
            />

            <small className="form-text text-muted">UUID</small>
            {repository.map((item, index) => {
                return item === 'undefined,' ? null : (
                    <Row noGutters className="py-1" key={index}>
                        <Col
                            lg={1}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <i
                                className="fas fa-minus-circle"
                                style={style.icon.minus}
                                type={type}
                                name="remove"
                                value={index}
                                onClick={() => {
                                    const typeGroup = `${abbr}_lbeacon`
                                    const value = parseLbeaconsGroup(
                                        values[typeGroup],
                                        index
                                    )
                                    setFieldValue(typeGroup, value)
                                }}
                            ></i>
                        </Col>
                        <Col lg={11} className="pr-1">
                            <Field
                                name={`p-${index + 1}-uuid`}
                                type="text"
                                className={
                                    'form-control' +
                                    (error.name ? ' is-invalid' : '')
                                }
                                placeholder={item}
                                value={item}
                                disabled
                            />
                        </Col>
                    </Row>
                )
            })}
            <Row noGutters className="py-1">
                <Col
                    lg={1}
                    className="d-flex align-items-center justify-content-center"
                >
                    {/* <i
                        className='fa fa-plus'
                        name='add'
                        style={style.icon.add}
                        type={type}
                        disabled={true}
                        onClick={(e) => {
                            let typeGroup = `${abbr}_lbeacon`
                            if (!values[`selected_${typeGroup}`]) return
                            let group = values[typeGroup]
                            group.push(values[`selected_${typeGroup}`].value)
                            setFieldValue(typeGroup, group)
                            setFieldValue(`selected_${abbr}_lbeacon`, null)
                        }}
                    >
                    </i> */}
                </Col>

                <Col lg={11} className="pr-1">
                    <Select
                        placeholder={locale.texts.SELECT_LBEACON}
                        name={`${abbr}_lbeacon`}
                        options={
                            abbr === 'f' ? lbeaconOptions_f : lbeaconOptions_p
                        }
                        value={values[`selected_${abbr}_lbeacon`]}
                        styles={styleConfig.reactSelect}
                        onChange={(value) => {
                            setFieldValue(`selected_${abbr}_lbeacon`, value)

                            const typeGroup = `${abbr}_lbeacon`
                            //  if (!values[`selected_${typeGroup}`]) return
                            const group = values[typeGroup]
                            group.push(value.value)
                            // let group = values[typeGroup]
                            // group.push(values[`selected_${typeGroup}`].value)
                            // console.log(group)
                            setFieldValue(typeGroup, group)
                            setFieldValue(`selected_${abbr}_lbeacon`, null)
                        }}
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                    />
                    {`lbeacon_error.${abbr}` && (
                        <small
                            className="form-text text-capitaliz"
                            style={style.error}
                        >
                            {abbr === 'f' ? lbeacon_error.f : lbeacon_error.p}
                        </small>
                    )}
                </Col>
            </Row>
        </div>
    )
}
