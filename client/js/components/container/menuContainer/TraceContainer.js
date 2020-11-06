/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TraceContainer.js

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
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import {
	BrowserView,
	TabletView,
	MobileOnlyView,
	isBrowser,
	CustomView,
	isMobile,
	isTablet,
} from 'react-device-detect'
import BrowserTraceContainerView from '../../platform/browser/BrowserTraceContainerView'
import MobileTraceContainerView from '../../platform/mobile/MobileTraceContainerView'
import TabletTraceContainerView from '../../platform/tablet/TabletTraceContainerView'
import { AppContext } from '../../../context/AppContext'
import pdfPackageGenerator from '../../../helper/pdfPackageGenerator'
import config from '../../../config'
import moment from 'moment'
import {
	locationHistoryByNameColumns,
	locationHistoryByUUIDColumns,
	locationHistoryByAreaColumns,
	locationHistoryByNameGroupBYUUIDColumns,
} from '../../../config/tables'
import axios from 'axios'
import dataSrc from '../../../dataSrc'
import apiHelper from '../../../helper/apiHelper'
import { JSONClone } from '../../../helper/utilities'

class TraceContainer extends React.Component {
	static contextType = AppContext

	formikRef = React.createRef()

	state = {
		columns: [],
		data: [],
		options: {
			name: [],
			uuid: [],
		},
		locale: this.context.locale.abbr,
		histories: [],
		breadIndex: -1,
	}
	columns = []

	defaultActiveKey = 'nameGroupByArea'

	title = 'trace'

	navList = {
		nameGroupByArea: {
			name: 'nameGroupByArea',
			columns: locationHistoryByNameColumns,
		},
		nameGroupByUUID: {
			name: 'nameGroupByUUID',
			columns: locationHistoryByNameGroupBYUUIDColumns,
		},
		// uuid: {
		//     columns: locationHistoryByUUIDColumns,
		// },
		area: {
			name: 'area',
			columns: locationHistoryByAreaColumns,
		},
	}

	componentDidMount = () => {
		/** disable the scrollability in body*/
		if (!isBrowser) {
			const targetElement = document.querySelector('body')
			enableBodyScroll(targetElement)
		}

		this.getObjectTable()
		this.getLbeaconTable()
		this.getAreaTable()
		// if (this.props.location.state) {
		//     let { state } = this.props.location
		//     let endTime = moment();
		//     let startTime = moment().startOf('day');
		//     let field = {
		//         mode: state.mode,
		//         key: state.key,
		//         startTime,
		//         endTime,
		//         description: state.key.label
		//     }
		//     this.getLocationHistory(field, 0)
		// }
	}

	componentWillUnmount = () => {
		const targetElement = document.querySelector('body')
		disableBodyScroll(targetElement)
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		if (this.context.locale.abbr != prevState.locale) {
			const columns = JSONClone(this.columns).map((field) => {
				field.name = field.Header
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
				return field
			})
			this.state.data.map((item) => {
				item.area = locale.texts[item.area_original]
				item.residenceTime = moment(item.startTime)
					.locale(locale.abbr)
					.from(moment(item.endTime), true)
			})
			this.setState({
				locale: locale.abbr,
				columns,
			})
		}
	}

	getObjectTable = async () => {
		const { locale, auth } = this.context
		const res = await apiHelper.objectApiAgent.getObjectTable({
			locale: locale.abbr,
			areas_id: auth.user.areas_id,
			objectType: [1, 2],
		})

		if (res) {
			const name = res.data.rows.map((item) => {
				return {
					value: item.name,
					label: item.name,
					description: item.name,
				}
			})
			this.setState({
				options: {
					...this.state.options,
					nameGroupByArea: name,
					nameGroupByUUID: name,
				},
			})
		}
	}

	getLbeaconTable = async () => {
		const { locale } = this.context
		const res = await apiHelper.lbeaconApiAgent.getLbeaconTable({
			locale: locale.abbr,
		})
		if (res) {
			const uuid = res.data.rows.map((lbeacon) => {
				return {
					value: lbeacon.uuid,
					label: `${lbeacon.description}[${lbeacon.uuid}]`,
					description: lbeacon.description,
				}
			})

			this.setState({
				options: {
					...this.state.options,
					uuid,
				},
			})
		}
	}

	getAreaTable = async () => {
		const { locale } = this.context

		const res = await apiHelper.areaApiAgent.getAreaTable()
		if (res) {
			const area = res.data.rows.map((area) => {
				return {
					value: area.id,
					label: locale.texts[area.name],
					description: locale.texts[area.name],
				}
			})
			this.setState({
				options: {
					...this.state.options,
					area,
				},
			})
		}
	}

	getLocationHistory = (fields, breadIndex) => {
		const { locale } = this.context

		const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

		/** Set formik status as 0. Would render loading page */
		this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.LOADING)

		const key = fields.key.value

		this.columns = this.navList[fields.mode].columns

		const columns = JSONClone(this.columns).map((field) => {
			field.name = field.Header
			field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			return field
		})

		axios
			.post(dataSrc.trace.locationHistory, {
				key,
				startTime: moment(fields.startTime).format(),
				endTime: moment(fields.endTime).format(),
				mode: fields.mode,
			})
			.then((res) => {
				let data = []
				let ajaxStatus
				let histories = this.state.histories

				/** Condition handler when no result */
				if (res.data.rowCount == 0) {
					ajaxStatus = config.AJAX_STATUS_MAP.NO_RESULT
					breadIndex--
				} else {
					switch (fields.mode) {
						case 'nameGroupByArea':
						case 'nameGroupByUUID':
							data = res.data.rows.map((item, index) => {
								item.residenceTime = moment
									.duration(item.duration)
									.locale(locale.abbr)
									.humanize()
								item.startTime = moment(item.start_time).format(
									timeValidatedFormat
								)
								item.endTime = moment(item.end_time).format(timeValidatedFormat)
								item.description = locale.texts[item.area_name]
								item.mode = fields.mode
								item.area_original = item.area_name
								item.area = locale.texts[item.area_name]
								return item
							})
							break
						case 'uuid':
							data = res.data.rows.map((item, index) => {
								item.id = index + 1
								item.mode = fields.mode
								item.area_original = item.area
								item.area = locale.texts[item.area]
								item.description = item.name
								return item
							})
							break
						case 'area':
							data = res.data.rows.map((item, index) => {
								item.id = index + 1
								item.mode = fields.mode
								item.area_original = item.area
								item.area = locale.texts[item.area]
								item.description = item.name
								return item
							})
							break
					}

					ajaxStatus = config.AJAX_STATUS_MAP.SUCCESS

					if (breadIndex < this.state.histories.length) {
						histories = histories.slice(0, breadIndex)
					}
					histories.push({
						key: fields.key,
						startTime: moment(fields.startTime).format(),
						endTime: moment(fields.endTime).format(),
						mode: fields.mode,
						data,
						columns,
						description: fields.description,
					})
				}

				this.setState(
					{
						data,
						columns,
						histories,
						breadIndex,
					},
					this.formikRef.current.setStatus(ajaxStatus)
				)
			})
			.catch((err) => {
				console.log(`get location history failed ${err}`)
			})
	}

	getInitialValues = () => {
		// if (this.props.location.state) {
		//     let { state } = this.props.location;
		//     let endTime = moment().toDate();
		//     let startTime = moment().startOf('day').toDate();
		//     return {
		//         mode: state.mode,
		//         key: state.key,
		//         startTime,
		//         endTime,
		//     }
		// }
		return {
			mode: this.defaultActiveKey,
			key: null,
			description: null,
		}
	}

	onRowClick = (state, rowInfo, column, instance) => {
		const { setFieldValue } = this.formikRef.current
		const { locale } = this.context
		const values = this.formikRef.current.state.values
		let startTime
		let endTime
		let key
		let mode
		const breadIndex = Number(this.state.breadIndex)
		return {
			onClick: (e) => {
				startTime = moment(rowInfo.original.startTime).toDate()
				endTime = moment(rowInfo.original.endTime).toDate()

				switch (rowInfo.original.mode) {
					case 'nameGroupByArea':
						key = {
							value: rowInfo.original.area_id,
							label: locale.texts[rowInfo.original.area_original],
							description: rowInfo.original.description,
						}
						mode = 'area'
						break
					case 'nameGroupByUUID':
						key = {
							value: rowInfo.original.area_id,
							label: locale.texts[rowInfo.original.area_original],
							description: rowInfo.original.description,
						}
						mode = 'area'
						break

					case 'uuid':
					case 'area':
						key = {
							value: rowInfo.original.name,
							label: rowInfo.original.name,
							description: rowInfo.original.description,
						}
						startTime = moment(values.startTime).toDate()
						endTime = moment(values.endTime).toDate()
						mode = 'nameGroupByArea'
						break
				}
				setFieldValue('key', key)
				setFieldValue('mode', mode)
				setFieldValue('startTime', startTime)
				setFieldValue('endTime', endTime)
				this.getLocationHistory(
					{
						...values,
						...rowInfo.original,
						key,
						mode,
						description: rowInfo.original.description,
					},
					breadIndex + 1
				)
			},
		}
	}

	handleClick = async (e, data) => {
		const name = e.target.name || e.target.getAttribute('name')

		const { auth, locale } = this.context

		const values = this.formikRef.current.state.values

		const {
			setFieldValue,
			setErrors,
			setTouched,
			setStatus,
		} = this.formikRef.current

		switch (name) {
			case 'exportCSV':
				const filePackage = pdfPackageGenerator.pdfFormat.getPath(
					'trackingRecord',
					{
						extension: 'csv',
					}
				)
				const fields = this.state.columns.map((column) => {
					return {
						label: locale.texts[column.name.replace(/ /g, '_').toUpperCase()],
						value: column.accessor,
					}
				})

				axios
					.post(dataSrc.file.export.csv, {
						data: this.state.data,
						fields,
						filePackage,
					})
					.then((res) => {
						const link = document.createElement('a')
						link.href = dataSrc.pdfUrl(filePackage.path)
						link.download = ''
						link.click()
					})
					.catch((err) => {
						console.log(`export CSV failed ${err}`)
					})
				break

			case 'exportPDF':
				const pdfPackage = pdfPackageGenerator.getPdfPackage({
					option: 'trackingRecord',
					user: auth.user,
					data: {
						columns: this.state.columns.filter(
							(column) => column.accessor != 'uuid'
						),
						data: this.state.data,
					},
					locale,
					signature: null,
					additional: {
						extension: 'pdf',
						key: values.key.label,
						startTime: moment(values.startTime).format('lll'),
						endTime: moment(values.endTime).format('lll'),
						type: values.mode,
					},
				})

				const res = await apiHelper.fileApiAgent.getPDF({
					userInfo: auth.user,
					pdfPackage,
				})
				if (res) {
					apiHelper.fileApiAgent.getFile({ path: pdfPackage.path })
				}

				break

			case 'nav':
				const mode = e.target.getAttribute('data-rb-event-key')
				setFieldValue('key', null)
				setFieldValue('mode', mode)
				setFieldValue('startTime', null)
				setFieldValue('endTime', null)
				setErrors({})
				setTouched({})
				setStatus(config.AJAX_STATUS_MAP.WAIT_FOR_SEARCH)
				this.setState({
					data: [],
					columns: [],
				})
				break
			case 'bread':
				const { history, index } = JSON.parse(data)
				setFieldValue('mode', history.mode)
				setFieldValue('key', history.key)
				setFieldValue('startTime', moment(history.startTime).toDate())
				setFieldValue('endTime', moment(history.endTime).toDate())
				this.setState({
					data: history.data,
					columns: history.columns,
					breadIndex: parseInt(index),
				})
		}
	}

	render() {
		const { data, histories, columns, options, breadIndex } = this.state

		const {
			getInitialValues,
			setState,
			navList,
			handleClick,
			getLocationHistory,
			onRowClick,
			title,
		} = this

		const propsGroup = {
			/** attributes from this.state */
			data,
			histories,
			columns,
			options,
			breadIndex,

			/** attributes from this */
			getInitialValues,
			setState,
			navList: Object.values(navList),
			handleClick,
			getLocationHistory,
			onRowClick,
			title,
		}

		return (
			<Fragment>
				<CustomView condition={isTablet != true && isMobile != true}>
					<BrowserTraceContainerView {...propsGroup} ref={this.formikRef} />
				</CustomView>
				<TabletView>
					<TabletTraceContainerView {...propsGroup} ref={this.formikRef} />
				</TabletView>
				<MobileOnlyView>
					<MobileTraceContainerView {...propsGroup} ref={this.formikRef} />
				</MobileOnlyView>
			</Fragment>
		)
	}
}

export default TraceContainer
