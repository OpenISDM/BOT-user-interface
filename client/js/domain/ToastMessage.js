import React from 'react'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const ToastMessage = ({ msg, hint = '' }) => {
	const { locale } = React.useContext(AppContext)
	return (
		<div className="text-capitalize">
			{locale.texts[msg.toUpperCase().replace(/ /g, '_')] + hint}
		</div>
	)
}

ToastMessage.propTypes = {
	msg: PropTypes.string,
	hint: PropTypes.string,
}

export default ToastMessage
