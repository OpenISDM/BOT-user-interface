import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

const BOTButton = ({
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
		<Button
			style={{ margin: '1px', ...style }}
			variant={variant}
			onClick={(e) => {
				debounceClick(e)
			}}
			{...props}
		>
			{text}
		</Button>
	)
}

BOTButton.propTypes = {
	pressed: PropTypes.bool,
	theme: PropTypes.string,
	text: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
	disableDebounce: PropTypes.bool,
}

export default BOTButton
