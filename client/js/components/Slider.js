import 'rc-tooltip/assets/bootstrap.css'
import React, { useState } from 'react'
import RCSlider, { SliderTooltip } from 'rc-slider'
import PropTypes from 'prop-types'

const { Handle } = RCSlider
const handle = (props) => {
	const { value, dragging, index, ...restProps } = props
	return (
		<SliderTooltip
			prefixCls="rc-slider-tooltip"
			overlay={`${value}`}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</SliderTooltip>
	)
}

const Slider = ({ min = 0, max = 100, defaultValue = 0, onChange }) => {
	const [value, setValue] = useState([defaultValue])
	return (
		<div
			style={{
				marginTop: '10px',
				marginBottom: '10px',
				marginLeft: '5px',
				marginRight: '5px',
			}}
		>
			<div style={{}}>{value}</div>
			<RCSlider
				min={min}
				max={max}
				defaultValue={defaultValue}
				handle={handle}
				onChange={(value) => {
					setValue(value)
					onChange(value)
				}}
			/>
		</div>
	)
}

Slider.propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
	defaultValue: PropTypes.number,
	onChange: PropTypes.func,
}

export default Slider
