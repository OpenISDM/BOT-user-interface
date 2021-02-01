import React from 'react'
import Select from 'react-select'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'

class LBeaconPicker extends React.Component {
	static contextType = AppContext

	state = {
		beacons: [],
	}
	componentDidMount = () => {
		this.getBeacon()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.area != this.props.area) {
			this.getBeacon()
		}
	}

	getBeacon = async () => {
		if (this.props.area) {
			const { locale } = this.context

			const res = await apiHelper.lbeaconApiAgent.getLbeaconTable({
				locale: locale.abbr,
			})
			if (res) {
				const beacons = res.data.rows.filter((beacon) => {
					return (
						parseInt(beacon.uuid.slice(0, 4).length) ===
						parseInt(this.props.area)
					)
				})
				this.setState({
					beacons,
				})
			}
		}
	}

	onChange = (option) => {
		this.props.getValue(option.value, this.props.id, this.props.beacon_id)
	}

	render() {
		const options = this.state.beacons.map((item) => {
			return {
				value: item,
				label: item.uuid,
			}
		})
		const defaultValue = {
			value: this.props.value,
			label: this.props.value,
		}

		const { locale } = this.context
		return (
			<Select
				name="beaconPicker"
				value={defaultValue}
				onChange={(value) => this.onChange(value)}
				options={options || []}
				isSearchable={false}
				components={{
					IndicatorSeparator: () => null,
				}}
			/>
		)
	}
}

export default LBeaconPicker
