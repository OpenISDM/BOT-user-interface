import React from 'react'
import { Row } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { batteryTableColumn } from '../config/tables'
import { toast } from 'react-toastify'
import { setSuccessMessage, setErrorMessage } from '../helper/messageGenerator'
import API from '../api'
import Table from '../components/Table'
import ObjectFilterBar from '../components/ObjectFilterBar'
import { SET_TABLE_SELECTION } from '../reducer/action'

class BatteryStatusTable extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		tabIndex: 0,
		locale: this.context.locale.abbr,
		objectFilter: [],
		filteredData: [],
		filterSelection: [],
		areaTable: [],
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		if (locale.abbr !== prevState.locale) {
			this.getTrackingData()
		}
	}

	componentDidMount = () => {
		this.getTrackingData()
	}


	getTrackingData = async (callback) => {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer

		const BatteryDataPromise = API.Tracking.getTrackingData({
			areaIds: [area.id],
			locale: locale.addr,
		})
		const areaTablePromise = API.Area.getAreaTable()

		const [BatteryDataRes, areaTableRes] = await Promise.all([
			BatteryDataPromise,
			areaTablePromise,
		])

		if (BatteryDataRes && areaTableRes) {
			this.setMessage('clear')
			const data = BatteryDataRes.data.map((item) => {
				item.mac_address = item.mac_address
					? item.mac_address
					: locale.texts.NON_BINDING
				item.area_name = {
					value:item.lbeacon_area.value,
					label:
						item.lbeacon_area.value,
					id: item.area_id,
				}
				return item
			})

			const areaSelection = areaTableRes.data.map((area) => {
				return {
					value: area.name,
					label: area.readable_name,
				}
			})
			this.setState(
				{
					data,
					filteredData: data,
					areaTable: areaTableRes.data,
					areaSelection,
					locale: locale.abbr,
				},
				callback
			)
			this.clearSelection()
		} else {
			this.setMessage('error', 'connect to database failed', true)
		}
	}
	clearSelection = () => {
		const [, dispatch] = this.context.stateReducer
		dispatch({
			type: SET_TABLE_SELECTION,
			value: [],
		})
	}
	setMessage = (type, msg, isSetting) => {
		switch (type) {
			case 'success':
				this.toastId = setSuccessMessage(msg)
				break
			case 'error':
				if (isSetting && !this.toastId) {
					this.toastId = setErrorMessage(msg)
				}
				break
			case 'clear':
				this.toastId = null
				toast.dismiss(this.toastId)
				break
		}
	}

	render() {
		const { locale } = this.context
		const filteredAttribute = [
			'name',
			'type',
			'area',
			'macAddress',
			'acn',
		]
		return (
			<>
				<Row>
					<ObjectFilterBar
						onFilterUpdated={({ objectFilter, filteredData }) => {
							this.setState({
								objectFilter,
								filteredData,
							})
							this.clearSelection()
						}}
						oldObjectFilter={this.state.objectFilter}
						objectList={this.state.data}
						selectionList={[
							{
								label: locale.texts.SEARCH,
								attribute: filteredAttribute,
								source: 'search bar',
							},
							{
								label: locale.texts.AREA,
								attribute: ['area'],
								options: this.state.areaSelection,
								source: 'area select',
							},
						]}
					/>
				</Row>
				<Table
					style={{ maxHeight: '85vh' }}
					data={this.state.filteredData}
					columns={batteryTableColumn}
				/>
			</>
		)
	}
}

export default BatteryStatusTable
