import React, { useContext } from 'react'
import AuthContext from '../../context/AuthenticationContext'
import BOTAdminMonitorSetting from './BOTAdminMonitorSetting'
import SystemAdminMonitorSetting from './SystemAdminMonitorSetting'

const MonitorSetting = () => {
	const { user } = useContext(AuthContext)
	let component = <></>
	if (user.roles.includes('dev')) {
		component = <SystemAdminMonitorSetting />
	} else if (user.roles.includes('care_provider')) {
		component = <BOTAdminMonitorSetting />
	}
	return component
}

export default MonitorSetting
