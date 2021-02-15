import React, { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

const BOTButton = ({
	pressed = false,
	theme = 'primary',
	text = '',
	style,
	enableDebounce = true,
	onClick = () => {
		// do nothing
	},
	...props
}) => {
	const variant = pressed ? theme : `outline-${theme}`
	let debounceClick = onClick
	if (enableDebounce) {
		debounceClick = useCallback(
			debounce((e) => onClick(e), 1000, {
				leading: true,
				trailing: false,
			}),
			[]
		)
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
	enableDebounce: PropTypes.bool,
}

export default BOTButton
