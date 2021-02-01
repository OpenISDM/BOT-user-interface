import React from 'react'
import PropTypes from 'prop-types'
import styleConfig from '../../config/styleConfig'
import BOTOverlayTrigger from './BOTOverlayTrigger'

const CheckboxOverlayTrigger = ({
	popoverTitle,
	popoverBody,
	name,
	onChange,
	id,
	disabled,
	placement,
	trigger,
	checked,
}) => {
	return (
		<BOTOverlayTrigger
			trigger={trigger}
			key={id}
			placement={placement}
			popoverBody={popoverBody}
			popoverTitle={popoverTitle}
			innerElement={
				<div className="pretty p-default p-round" style={styleConfig.checkbox}>
					<input
						name={name}
						id={id}
						type="checkbox"
						checked={checked}
						onChange={onChange}
						disabled={disabled}
					/>
					<div className="state p-primary" style={{ marginLeft: '20px' }}>
						<label>{name}</label>
					</div>
				</div>
			}
		/>
	)
}

CheckboxOverlayTrigger.propTypes = {
	popoverTitle: PropTypes.string.isRequired,
	popoverBody: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	id: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	checked: PropTypes.bool,
	placement: PropTypes.string.isRequired,
}

export default CheckboxOverlayTrigger
