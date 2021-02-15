import React from 'react'
import { AppContext } from '../../context/AppContext'

const ToastMessage = ({ msg, hint = '' }) => {
	const { locale } = React.useContext(AppContext)
	return (
		<div className="text-capitalize">
			{locale.texts[msg.toUpperCase().replace(/ /g, '_')] + hint}
		</div>
	)
}

export default ToastMessage
