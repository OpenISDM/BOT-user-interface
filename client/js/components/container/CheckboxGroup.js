import React from 'react'
import PropTypes from 'prop-types'

class CheckboxGroup extends React.Component {
	handleChange = (event) => {
		const target = event.currentTarget
		const valueArray = [...this.props.value] || []

		if (target.checked) {
			valueArray.push(target.id)
		} else {
			valueArray.splice(valueArray.indexOf(target.id), 1)
		}
		this.props.onChange(this.props.id, valueArray)
	}

	handleBlur = () => {
		this.props.onBlur(this.props.id, true)
	}

	render() {
		// const { value, error, touched, label, className, children } = this.props
		const { value, children } = this.props
		return (
			<div className="d-flex flex-column">
				{React.Children.map(children, (child) => {
					return React.cloneElement(child, {
						value: value.includes(child.props.id),
						onChange: this.handleChange,
					})
				})}
			</div>
		)
	}
}

CheckboxGroup.propTypes = {
	id: PropTypes.string,
	value: PropTypes.object,
	error: PropTypes.object,
	touched: PropTypes.object,
	label: PropTypes.string,
	className: PropTypes.string,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	children: PropTypes.object,
}

export default CheckboxGroup
