import React from 'react'
import { AppContext } from '../../context/AppContext'
import moment from 'moment'
import config from '../../config'

const ToastNotification = ({ data, time, type }) => {
	const { locale } = React.useContext(AppContext)

	return (
		<div>
			<div className="text-capitalize">
				{
					locale.texts[
						config.monitorType[type].toUpperCase().replace(/ /g, '_')
					]
				}
			</div>
			<hr />
			<div>
				{locale.lang == 'en'
					? `${data.name} ${locale.texts.NEAR} ${
							data.location_description
					  } ${moment(time).format(config.geoFenceViolationTimeFormat)}`
					: `${data.name} ${locale.texts.NEAR}${
							data.location_description
					  } ${moment(time).format(config.geoFenceViolationTimeFormat)}`}
			</div>
		</div>
	)
}

export default ToastNotification
