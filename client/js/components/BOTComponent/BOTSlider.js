import 'rc-tooltip/assets/bootstrap.css'
import React, { useState } from 'react'
import Slider, { SliderTooltip } from 'rc-slider'
const { Handle } = Slider
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

const BOTSlider = ({ min = 0, max = 100, defaultValue = 0, onChange }) => {
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
			<Slider
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

export default BOTSlider
