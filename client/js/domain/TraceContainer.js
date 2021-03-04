import React, { Fragment } from 'react'
import {
	TabletView,
	MobileOnlyView,
	isBrowser,
	CustomView,
	isMobile,
	isTablet,
} from 'react-device-detect'
import BrowserTraceContainerView from './platform/browser/BrowserTraceContainerView'
import MobileTraceContainerView from './platform/mobile/MobileTraceContainerView'
import TabletTraceContainerView from './platform/tablet/TabletTraceContainerView'
import { AppContext } from '../context/AppContext'
import pdfPackageGenerator from '../helper/pdfPackageGenerator'
import config from '../config'
import moment from 'moment'
import {
	locationHistoryByNameColumns,
	locationHistoryByAreaColumns,
	locationHistoryByNameGroupBYUUIDColumns,
} from '../config/tables'
import API from '../api'
import { pdfUrl } from '../api/File'
import { JSONClone } from '../helper/utilities'
import { keyBy } from 'lodash'
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
			// const targetElement = document.querySelector('body')
			// enableBodyScroll(targetElement)
		}

		this.getObjectList()
		this.getLbeaconTable()
		this.getAreaTable()
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		const { areaMap } = this.state
		if (this.context.locale.abbr !== prevState.locale) {
			const columns = JSONClone(this.columns).map((field) => {
				field.name = field.Header
				return field
			})
			this.state.data.forEach((item) => {
				item.area = areaMap[item.area_id].readable_name //locale.texts[item.area_original]
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

	getObjectList = async () => {
		const { auth } = this.context
		const res = await API.Object.getObjectList({
			areaIds: auth.user.area_ids,
			objectTypes: [config.OBJECT_TYPE.PERSON],
		})

		if (res) {
			const name = res.data.map((item) => {
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
		const res = await API.Lbeacon.getLbeaconTable({
			locale: locale.abbr,
		})
		if (res) {
			const uuid = res.data.map((lbeacon) => {
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
		const res = await API.Area.getAreaTable()
		if (res) {
			const area = res.data.map((area) => {
				return {
					value: area.id,
					label: area.readable_name,
					description: area.readable_name,
				}
			})
			const areaMap = keyBy(res.data, 'id')
			this.setState({
				options: {
					...this.state.options,
					area,
				},
				areaMap,
			})
		}
	}

	getLocationHistory = async (fields, breadIndex) => {
		const { locale } = this.context
		const { areaMap } = this.state
		const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

		/** Set formik status as 0. Would render loading page */
		this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.LOADING)

		const key = fields.key.value

		this.columns = this.navList[fields.mode].columns
		const columns = JSONClone(this.columns).map((field) => {
			field.name = field.Header
			return field
		})
		const res = await API.Trace.getLocationHistory({
			key,
			startTime: moment(fields.startTime).format(),
			endTime: moment(fields.endTime).format(),
			mode: fields.mode,
			locale
		})
		let ajaxStatus
		let data = []
		let histories = this.state.histories
		console.log(res.data)
		if (res) {
			if (res.data.rowCount === 0) {
				ajaxStatus = config.AJAX_STATUS_MAP.NO_RESULT
				breadIndex--
			} else {
				switch (fields.mode) {
					case 'nameGroupByArea':
					case 'nameGroupByUUID':
						data = res.data.rows.map((item) => {
							// item.residenceTime = moment
							// 	.duration(item.duration)
							// 	.locale(locale.abbr)
							// 	.humanize()
							item.startTime = moment(item.start_time).format(
								timeValidatedFormat
							)
							item.endTime = moment(item.end_time).format(timeValidatedFormat)
							item.description = areaMap[item.area_id].readable_name
							item.mode = fields.mode
							item.area_original = item.area_name
							item.area_name = areaMap[item.area_id].readable_name
							return item
						})
						break
					case 'uuid':
						data = res.data.rows.map((item, index) => {
							item.id = index + 1
							item.mode = fields.mode
							item.area_original = item.area
							item.area_name = areaMap[item.area_id].readable_name
							item.description = item.name
							return item
						})
						break
					case 'area':
						data = res.data.rows.map((item, index) => {
							item.id = index + 1
							item.mode = fields.mode
							item.area_original = item.area
							item.area_name = areaMap[item.area_id].readable_name
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
	}

	getInitialValues = () => {
		return {
			mode: this.defaultActiveKey,
			key: null,
			description: null,
		}
	}

	onRowClick = (rowInfo) => {
		const { setFieldValue } = this.formikRef.current
		const { areaMap } = this.state
		const values = this.formikRef.current.state.values
		let startTime
		let endTime
		let key
		let mode
		const breadIndex = Number(this.state.breadIndex)

		startTime = moment(rowInfo.startTime).toDate()
		endTime = moment(rowInfo.endTime).toDate()
		switch (rowInfo.mode) {
			case 'nameGroupByArea':
				key = {
					value: rowInfo.area_id,
					label: areaMap[rowInfo.area_id].readable_name,
					description: rowInfo.description,
				}
				mode = 'area'
				break
			case 'nameGroupByUUID':
				key = {
					value: rowInfo.area_id,
					label: areaMap[rowInfo.area_id].readable_name,
					description: rowInfo.description,
				}
				mode = 'area'
				break

			case 'uuid':
			case 'area':
				key = {
					value: rowInfo.name,
					label: rowInfo.name,
					description: rowInfo.description,
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
				...rowInfo,
				key,
				mode,
				description: rowInfo.description,
			},
			breadIndex + 1
		)
	}

	exportCSV = async () => {
		const { locale } = this.context
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

		await API.File.postCSV({
			data: this.state.data,
			fields,
			filePackage,
		})

		const link = document.createElement('a')
		link.href = `${pdfUrl}${filePackage.path}`
		link.download = ''
		link.click()
	}

	exportPdf = async (values) => {
		const { auth, locale } = this.context
		const pdfPackage = pdfPackageGenerator.getPdfPackage({
			option: 'trackingRecord',
			user: auth.user,
			data: {
				columns: this.state.columns.filter(
					(column) => column.accessor !== 'uuid'
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

		const res = await API.File.getPDF({
			userInfo: auth.user,
			pdfPackage,
		})
		if (res) {
			API.File.getFile({ path: pdfPackage.path })
		}
	}

	handleClick = async (e, data) => {
		const name = e.target.name || e.target.getAttribute('name')
		const mode = e.target.getAttribute('data-rb-event-key')
		const values = this.formikRef.current.state.values

		const {
			setFieldValue,
			setErrors,
			setTouched,
			setStatus,
		} = this.formikRef.current

		switch (name) {
			case 'exportCSV':
				this.exportCSV()
				break

			case 'exportPDF':
				this.exportPdf(values)
				break

			case 'nav':
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
			case 'bread': {
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
				<CustomView condition={!isTablet && !isMobile}>
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
