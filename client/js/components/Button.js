import React, { useCallback } from 'react'
import { Button as RTBSButton } from 'react-bootstrap'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

const Button = ({
	pressed = false,
	theme = 'primary',
	text = '',
	style,
	disableDebounce = false,
	onClick = () => {
		// do nothing
	},
	...props
}) => {
	const variant = pressed ? theme : `outline-${theme}`

	let debounceClick = useCallback(
		debounce((e) => onClick(e), 1000, {
			leading: true,
			trailing: false,
		}),
		[]
	)
	if (disableDebounce) {
		debounceClick = onClick
	}

	return (
		<RTBSButton
			style={{ margin: '1px', ...style }}
			variant={variant}
			onClick={(e) => {
				debounceClick(e)
			}}
			{...props}
		>
			{text}
		</RTBSButton>
	)
}

Button.propTypes = {
	pressed: PropTypes.bool,
	theme: PropTypes.string,
	text: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
	disableDebounce: PropTypes.bool,
}

export default Button
