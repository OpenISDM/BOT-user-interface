import React from 'react'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'

const style = {
	error: {
		color: '#dc3545',
	},
}

class DateTimePicker extends React.Component {
	static contextType = AppContext

	state = {
		length: 24,
	}

	onChange = (value) => {
		const id = this.props.id
		this.props.getValue(value, this.props.name, id)
	}

	render() {
		const { locale } = this.context

		const { value, error, error_tip } = this.props

		const options = Array.from(Array(this.state.length + 1).keys())
			.filter((index) => {
				return (
					index >= parseInt(this.props.start) &&
					index <= parseInt(this.props.end)
				)
			})
			.map((index) => {
				return {
					value: `${index}:00`,
					label: `${index}:00`,
				}
			})
		const defaultValue = value
			? {
					value,
					label: value,
			  }
			: ''

		return (
			<div>
				<Select
					name="timepicker"
					placeholder={locale.texts.SELECT_TIME}
					value={defaultValue}
					onChange={(value) => this.onChange(value)}
					options={options || []}
					isSearchable={false}
					styles={styleConfig.reactSelect}
					controlHeigh={20}
					components={{
						IndicatorSeparator: () => null,
					}}
				/>
				{error && (
					<small className="form-text text-capitaliz" style={style.error}>
						{error_tip}
					</small>
				)}
			</div>
		)
	}
}

export default DateTimePicker
