import React from 'react'
import dataSrc from '../../dataSrc'
import axios from 'axios'
import 'react-table/react-table.css'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { Button, Row, Col, Nav } from 'react-bootstrap'
import styleConfig from '../../config/styleConfig'
import 'react-tabs/style/react-tabs.css'
import { AppContext } from '../../context/AppContext'
import ReactTable from 'react-table'
import {
	locationHistoryByMacColumns,
	locationHistoryByUUIDColumns,
} from '../../config/tables'
import moment from 'moment'
import FormikFormGroup from '../presentational/FormikFormGroup'
import {
	BOTNavLink,
	BOTNav,
	NoDataFoundDiv,
} from '../BOTComponent/styleComponent'
import Loader from '../presentational/Loader'
import { JSONClone } from '../../helper/utilities'

class TrackingHistory extends React.Component {
	static contextType = AppContext

	state = {
		columns: [],
		data: [],
		additionalData: null,
		errorTitle: 'Waiting for search...',
	}

	defaultActiveKey = 'mac'

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr != prevState.locale) {
			this.setState({
				locale: this.context.locale.abbr,
			})
		}
	}

	getLocationHistory = (fields, setSubmitting, setStatus) => {
		const { locale } = this.context

		let key = null
		let columns = null
		const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'
		switch (fields.mode) {
			case 'mac':
				key = fields.key
					.toLowerCase()
					.replace(/[: ]/g, '')
					.match(/.{1,2}/g)
					.join(':')
				columns = JSONClone(locationHistoryByMacColumns)
				break
			case 'uuid':
				key = fields.key
				columns = JSONClone(locationHistoryByUUIDColumns)
				break
		}

		axios
			.post(dataSrc.getLocationHistory, {
				key,
				startTime: moment(fields.startTime).format(),
				endTime: moment(fields.endTime).format(),
				mode: fields.mode,
			})
			.then((res) => {
				if (res.data.rowCount == 0) {
					setStatus(locale.texts.NO_DATA_FOUND)
					setSubmitting(false)
					return
				}
				let prevUUID = ''
				let data = []
				let additionalData = null
				switch (fields.mode) {
					case 'mac':
						res.data.rows.map((pt) => {
							if (pt.uuid != prevUUID) {
								data.push({
									uuid: pt.uuid,
									startTime: moment(pt.record_timestamp)
										.locale(locale.abbr)
										.format(timeValidatedFormat),
									description: pt.description,
									area: locale.texts[pt.area],
								})
								prevUUID = pt.uuid
							}

							data[data.length - 1].endTime = moment(pt.record_timestamp)
								.locale(locale.abbr)
								.format(timeValidatedFormat)
						})
						if (res.data.rowCount != 0) {
							additionalData = {
								name: res.data.rows[0].name,
								area: res.data.rows[0].area,
							}
						}
						break
					case 'uuid':
						data = res.data.rows.map((item, index) => {
							item.id = index + 1
							return item
						})
						if (res.data.rowCount != 0) {
							additionalData = {
								description: res.data.rows[0].description,
								area: res.data.rows[0].area,
							}
						}
						break
				}

				this.setState(
					{
						data,
						columns,
						additionalData,
					},
					setSubmitting(false)
				)
			})
			.catch((err) => {
				console.log(`get location history failed ${err}`)
			})
	}

	render() {
		const { locale } = this.context

		const { additionalData } = this.state

		const timeTypeExample = 'ex: YYYY/MM/DD HH:MM:SS'
		const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

		return (
			<Formik
				initialValues={{
					mode: 'mac',
					mac: '',
					key: '',
					startTime: '',
					endTime: '',
				}}
				initialStatus={locale.texts.WAIT_FOR_SEARCH}
				validationSchema={object().shape({
					key: string()
						.required(locale.texts.MAC_ADDRESS_IS_REQUIRED)
						.when('mode', {
							is: 'mac',
							then: string().test(
								'mode',
								locale.texts.MAC_ADDRESS_FORMAT_IS_NOT_CORRECT,
								(value) => {
									if (value == undefined) return false
									const pattern = new RegExp(
										'^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$'
									)
									return value.match(pattern)
								}
							),
						})
						.when('mode', {
							is: 'uuid',
							then: string().test(
								'uuid',
								locale.texts.LBEACON_FORMAT_IS_NOT_CORRECT,
								(value) => {
									if (value == undefined) return false
									const pattern = new RegExp(
										'^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$'
									)
									return value.match(pattern)
								}
							),
						}),
					startTime: string()
						.required(locale.texts.START_TIME_IS_REQUIRED)
						.test(
							'startTime',
							locale.texts.TIME_FORMAT_IS_NOT_CORRECT,
							(value) => {
								return moment(value, timeValidatedFormat, true).isValid()
							}
						),
					endTime: string()
						.required(locale.texts.END_TIME_IS_REQUIRED)
						.test(
							'endTime',
							locale.texts.TIME_FORMAT_IS_NOT_CORRECT,
							(value) => {
								return moment(value, timeValidatedFormat, true).isValid()
							}
						),
				})}
				onSubmit={(values, { setSubmitting, setStatus }) => {
					this.getLocationHistory(values, setSubmitting, setStatus)
				}}
				render={({
					values,
					errors,
					status,
					touched,
					isSubmitting,
					setFieldValue,
					submitForm,
					setErrors,
					setTouched,
					setSubmitting,
				}) => (
					<div>
						<BOTNav defaultActiveKey={this.defaultActiveKey}>
							<Nav.Item>
								<BOTNavLink
									className=""
									eventKey="mac"
									onClick={(e) => {
										setFieldValue('key', '')
										setFieldValue('mode', 'mac')
										setFieldValue('startTime', '')
										setFieldValue('endTime', '')
										setErrors({})
										setTouched({})
										this.setState({
											data: [],
											columns: [],
											additionalData: null,
										})
									}}
									active={values.mode == 'mac'}
								>
									{locale.texts.MAC_ADDRESS}
								</BOTNavLink>
							</Nav.Item>
							<Nav.Item>
								<BOTNavLink
									eventKey="uuid"
									onClick={() => {
										setFieldValue('key', '')
										setFieldValue('mode', 'uuid')
										setFieldValue('startTime', '')
										setFieldValue('endTime', '')
										setErrors({})
										setTouched({})
										this.setState({
											data: [],
											columns: [],
											additionalData: null,
										})
									}}
									active={values.mode == 'uuid'}
								>
									{locale.texts.LBEACON}
								</BOTNavLink>
							</Nav.Item>
						</BOTNav>
						<div className="my-2">
							<Row>
								<Col lg={4}>
									{values.mode == 'mac' && (
										<FormikFormGroup
											type="text"
											name="key"
											error={errors.key}
											touched={touched.key}
											placeholder={
												locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS
											}
											label="mac address"
										/>
									)}
									{values.mode == 'uuid' && (
										<FormikFormGroup
											type="text"
											name="key"
											error={errors.key}
											touched={touched.key}
											placeholder={'ex: 00010015-0000-0005-4605-000000018086'}
											label="UUID"
										/>
									)}
								</Col>
								<Col>
									<FormikFormGroup
										type="text"
										name="startTime"
										error={errors.startTime}
										touched={touched.startTime}
										// placeholder={locale.texts.START_TIME}
										placeholder={timeTypeExample}
										// example={timeTypeExample}
										label={locale.texts.START_TIME}
									/>
								</Col>
								<Col>
									<FormikFormGroup
										type="text"
										name="endTime"
										error={errors.endTime}
										touched={touched.endTime}
										// placeholder={locale.texts.END_TIME}
										placeholder={timeTypeExample}
										// example={timeTypeExample}
										label={locale.texts.END_TIME}
									/>
								</Col>
								<Col className="d-flex align-items-center">
									<Button
										type="button"
										variant="primary"
										disabled={this.state.done}
										onClick={submitForm}
									>
										{locale.texts.SEARCH}
									</Button>
								</Col>
							</Row>
							{additionalData && (
								<Row>
									<Col xl={3}>
										<FormikFormGroup
											type="text"
											value={
												values.mode == 'mac'
													? additionalData.name
													: locale.texts[additionalData.area]
											}
											label={
												values.mode == 'mac'
													? locale.texts.NAME
													: locale.texts.AREA
											}
											disabled={true}
										/>
									</Col>
									{additionalData.description && (
										<Col xl={3}>
											<FormikFormGroup
												type="text"
												value={additionalData.description}
												label={locale.texts.DESCRIPTION}
												disabled={true}
											/>
										</Col>
									)}
								</Row>
							)}
							<hr />
							{isSubmitting && <Loader />}
							{this.state.data.length != 0 ? (
								<ReactTable
									keyField="id"
									data={this.state.data}
									columns={this.state.columns}
									className="-highlight mt-4"
									style={{
										maxHeight: '65vh',
										minHeight: '30vh',
									}}
									pageSize={this.state.data.length}
									{...styleConfig.reactTable}
									getTrProps={(state, rowInfo, column, instance) => {
										return {
											onClick: (e) => {
												switch (values.mode) {
													case 'mac':
														setFieldValue('key', rowInfo.original.uuid)
														setFieldValue('mode', 'uuid')
														setFieldValue(
															'startTime',
															rowInfo.original.startTime
														)
														setFieldValue('endTime', rowInfo.original.endTime)
														setSubmitting(true)
														this.getLocationHistory(
															{
																...values,
																...rowInfo.original,
																key: rowInfo.original.uuid,
																mode: 'uuid',
															},
															setSubmitting
														)
														break
													case 'uuid':
														setFieldValue('key', rowInfo.original.mac_address)
														setFieldValue('mode', 'mac')
														setFieldValue('startTime', values.startTime)
														setFieldValue('endTime', values.endTime)
														setSubmitting(true)
														this.getLocationHistory(
															{
																...values,
																...rowInfo.original,
																key: rowInfo.original.mac_address,
																mode: 'mac',
															},
															setSubmitting
														)
														break
												}
											},
										}
									}}
								/>
							) : (
								<NoDataFoundDiv>{status}</NoDataFoundDiv>
							)}
						</div>
					</div>
				)}
			/>
		)
	}
}

export default TrackingHistory
