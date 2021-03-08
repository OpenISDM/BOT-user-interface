import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import QueryBuilder from '../components/QueryBuilder'
import API from '../api'
import {
	delay,
	findExpectedBitValue,
	caculateAlertTypes,
} from '../helper/utilities'
import NotificationTypeConfig from './NotificationTypeConfig'
import { setSuccessMessage } from '../helper/messageGenerator'
import { SAVE_SUCCESS } from '../config/wordMap'
import config from '../config'

const VITAL_SIGN_FIELDS = (locale) => {
	return {
		fields: {
			temperature: {
				label: locale.texts.TEMPERATURE,
				type: 'number',
				valueSources: ['value'],
				fieldSettings: {
					min: 0,
					max: 45,
				},
				preferWidgets: ['slider', 'rangeslider'],
			},
			heart_rate: {
				label: locale.texts.HEART_RATE,
				type: 'number',
				valueSources: ['value'],
				fieldSettings: {
					min: 0,
					max: 240,
				},
				preferWidgets: ['slider', 'rangeslider'],
			},
			systolic_blood_pressure: {
				label: locale.texts.SYSTOLIC_BLOOD_PRESSURE,
				type: 'number',
				valueSources: ['value'],
				fieldSettings: {
					min: 0,
					max: 250,
				},
				preferWidgets: ['slider', 'rangeslider'],
			},
			diastolic_blood_pressure: {
				label: locale.texts.DIASTOLIC_BLOOD_PRESSURE,
				type: 'number',
				valueSources: ['value'],
				fieldSettings: {
					min: 0,
					max: 250,
				},
				preferWidgets: ['slider', 'rangeslider'],
			},
			blood_oxygen: {
				label: locale.texts.BLOOD_OXYGEN,
				type: 'number',
				valueSources: ['value'],
				fieldSettings: {
					min: 0,
					max: 100,
				},
				preferWidgets: ['slider', 'rangeslider'],
			},
		},
	}
}

const VITAL_SIGN_NAME = 'VITAL_SIGN'

class BOTAdminVitalSignSetting extends React.Component {
	static contextType = AppContext

	state = {
		jsonLogic: null,
		statement: null,
		notificationConfig: null,
	}

	componentDidMount = () => {
		this.getData()
	}

	getData = async () => {
		const [{ area }] = this.context.stateReducer

		const res = await API.VitalSign.getConfig({
			areaId: area.id,
		})

		if (res) {
			this.setState({
				jsonLogic: res.data.jsonLogic,
				statement: res.data.statement,
				notificationConfig: res.data.notificationConfig,
			})
		}
	}

	handleSubmit = async (submitValue, actions) => {
		const [{ area }] = this.context.stateReducer
		const { jsonLogic, statement } = this.state

		await API.VitalSign.setConfig({
			jsonLogic,
			statement,
			areaId: area.id,
			config: submitValue,
		})

		await setSuccessMessage(SAVE_SUCCESS)
		await this.getData()
		delay({
			callback: () => {
				actions.setSubmitting(false)
			},
		})
	}

	render() {
		const { locale } = this.context
		const { jsonLogic, notificationConfig } = this.state

		let initialValues = {}
		if (notificationConfig) {
			initialValues = {
				start_time: notificationConfig.start_time,
				end_time: notificationConfig.end_time,
				enable: notificationConfig.enable,
				alert_last_sec: notificationConfig.alert_last_sec,
				flash_lights: findExpectedBitValue({
					targetDecimal: parseInt(notificationConfig.active_alert_types),
					expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.LIGHT),
				}),
				alert_bells: findExpectedBitValue({
					targetDecimal: parseInt(notificationConfig.active_alert_types),
					expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.BELL),
				}),
				msg_on_gui: findExpectedBitValue({
					targetDecimal: parseInt(notificationConfig.active_alert_types),
					expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.GUI),
				}),
				send_sms: findExpectedBitValue({
					targetDecimal: parseInt(notificationConfig.active_alert_types),
					expectedDecimal: parseInt(config.NOTIFICATION_ALERT_TYPES_ENUM.SMS),
				}),
			}
		} else {
			initialValues = {
				start_time: '00:00:00',
				end_time: '23:59:59',
				enable: 0,
				alert_last_sec: 0,
				flash_lights: false,
				alert_bells: false,
				msg_on_gui: false,
				send_sms: false,
			}
		}

		return (
			<Col style={{ padding: '0px' }}>
				<Formik
					enableReinitialize
					validateOnChange={false}
					validateOnBlur={false}
					initialValues={initialValues}
					onSubmit={(values, actions) => {
						this.handleSubmit(
							{
								...values,
								name: VITAL_SIGN_NAME,
								active_alert_types: caculateAlertTypes({
									bell: values.alert_bells,
									light: values.flash_lights,
									gui: values.msg_on_gui,
									sms: values.send_sms,
								}),
							},
							actions
						)
					}}
					render={({
						errors,
						touched,
						values,
						isSubmitting,
						setFieldValue,
					}) => {
						return (
							<Form>
								<Row style={{ justifyContent: 'flex-end' }}>
									<Button
										pressed={true}
										text={locale.texts.SAVE}
										type="submit"
										variant="primary"
										disabled={isSubmitting}
									/>
								</Row>
								<Row>
									<Col md={8} lg={8} xl={8} style={{ padding: '0px' }}>
										<QueryBuilder
											key={`${jsonLogic}`.length} // Must have a key to force update component
											fields={VITAL_SIGN_FIELDS(locale)}
											jsonLogic={jsonLogic}
											onChangeCallback={({ jsonLogic, statement }) => {
												this.setState({ jsonLogic, statement })
											}}
										/>
									</Col>
									<Col md={4} lg={4} xl={4} style={{ padding: '0px' }}>
										<NotificationTypeConfig
											values={values}
											errors={errors}
											touched={touched}
											setFieldValue={setFieldValue}
										/>
									</Col>
								</Row>
							</Form>
						)
					}}
				/>
			</Col>
		)
	}
}

BOTAdminVitalSignSetting.propTypes = {}

export default BOTAdminVitalSignSetting
