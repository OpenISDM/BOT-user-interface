import React from 'react'
import Select from 'react-select'
import { AppContext } from '../../context/AppContext'
import styleConfig from '../../config/styleConfig'

class NumberPicker extends React.Component {
	static contextType = AppContext

	state = {
		value: this.props.value
			? {
					value: this.props.value,
					label: this.props.value,
			  }
			: null,
	}

	onChange = (value) => {
		this.props.onChange(parseInt(value.value))
		this.setState({
			value,
		})
	}

	render() {
		const options = Array.from(Array(this.props.length).keys()).map((index) => {
			return {
				value: `${index + 1}`,
				label: `${index + 1}`,
			}
		})
		const { placeholder } = this.props
		return (
			<Select
				value={this.state.value}
				className="text-capitalize w-25"
				onChange={(value) => this.onChange(value)}
				options={options || []}
				isSearchable={false}
				styles={{
					control: (provided) => ({
						...provided,
						fontSize: '1rem',
						minHeight: '3rem',
						position: 'none',
						width: '160px',
						borderRadius: 0,
					}),
				}}
				components={{
					IndicatorSeparator: () => null,
				}}
				placeholder={placeholder}
			/>
		)
	}
}

export default NumberPicker
