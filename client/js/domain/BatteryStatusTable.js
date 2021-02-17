import React from 'react'
import { AppContext } from '../context/AppContext'
import { trackingTableColumn } from '../config/tables'
import { toast } from 'react-toastify'
import { setSuccessMessage, setErrorMessage } from '../helper/messageGenerator'
import API from '../api'
import BOTTable from '../components/BOTTable'

class BatteryStatusTable extends React.Component {
	static contextType = AppContext

	state = {
		trackingData: [],
		tabIndex: 0,
		locale: this.context.locale.abbr,
	}

	toastId = null

	componentDidUpdate = (prevProps, prevState) => {
		const { locale } = this.context
		if (locale.abbr !== prevState.locale) {
			this.getTrackingData()
		}
	}

	componentDidMount = () => {
		this.getTrackingData()
	}

	componentWillUnmount = () => {
		toast.dismiss(this.toastId)
	}

	getTrackingData = async () => {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const res = await API.Tracking.getTrackingData({
			areaIds: [area.id],
			locale: locale.abbr,
		})

		if (res) {
			this.setMessage('clear')
			const trackingData = res.data.map((item, index) => {
				item.status = locale.texts[item.status.toUpperCase()]
				item.transferred_location = ''
				item._id = index + 1
				return item
			})

			this.setState({
				trackingData,
				locale: locale.abbr,
			})
		} else {
			this.setMessage('error', 'connect to database failed', true)
		}
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
		return (
			<BOTTable
				style={{ maxHeight: '85vh' }}
				data={this.state.trackingData}
				columns={trackingTableColumn}
			/>
		)
	}
}

export default BatteryStatusTable
