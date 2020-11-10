/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        pageModules.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

/* eslint-disable react/display-name */
import React from 'react'
import UserProfile from '../components/container/UserContainer/UserProfile'
import LBeaconTable from '../components/container/LBeaconTable'
import GatewayTable from '../components/container/GatewayTable'
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer'
import config from '../config'
import MyDeviceManager from '../components/container/UserContainer/MyDeviceManager'
import DeviceGroupManager from '../components/container/UserContainer/DeviceGroupManager'
import MyPatientManager from '../components/container/UserContainer/MyPatientManager'
import PatientGroupManager from '../components/container/UserContainer/PatientGroupManager'
import GeoFenceSettingBlock from '../components/container/GeoFenceSettingBlock'
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord'
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord'
import TrackingTable from '../components/container/TrackingTable'
import TraceContainer from '../components/container/menuContainer/TraceContainer'
import routes from '../config/routes/routes'
import Loadable from 'react-loadable'
import Loader from '../components/presentational/Loader'
import GeneralSettings from '../components/container/menuContainer/GeneralSettings'
import GetAssignments from '../components/container/GetAssignments'
import ShiftChangeHistoricalRecord from '../components/container/ShiftChangeHistoricalRecord'
// import RolePermissionManagement from '../components/container/RolePermissionManagement'
// import TransferredLocationManagement from '../components/container/TransferredLocationManagement';
// import MonitorSettingBlock from '../components/container/MonitorSettingBlock'
// import BOTAdmin from '../components/container/menuContainer/BOTAdminContainer'

const TransferredLocationManagement = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "TransferredLocationManagement" */
			'../components/container/TransferredLocationManagement'
		),
	loading: Loader,
})

export const userContainerModule = {
	title: 'user profile',
	defaultActiveKey: 'user profile',
	tabList: [
		{
			name: 'user profile',
			path: 'userProfile',
			href: '#UserProfile',
			component: (props) => <UserProfile {...props} />,
		},
		{
			name: 'devices management',
			path: 'devicesManagement',
			href: '#DevicesManagement',
			component: (props) => <MyDeviceManager {...props} />,
		},
		{
			name: 'patient management',
			path: 'patientManagement',
			href: '#PatientManagement',
			component: (props) => <MyPatientManager {...props} />,
		},
	],
}

export const monitorSettingModule = {
	title: 'monitor setting',
	path: routes.MONITOR_SETTINGS,
	defaultActiveKey: '', // to be assigned
	tabList: [
		// {
		//     name: config.monitorSettingType.MOVEMENT_MONITOR,
		//     component: (props) => <MonitorSettingBlock {...props}/>
		// },
		// {
		//     name: config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
		//     component: (props) => <MonitorSettingBlock {...props}/>
		// },
		// {
		//     name: config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
		//     component: (props) => <MonitorSettingBlock {...props}/>
		// },
		{
			name: config.monitorSettingType.GEOFENCE_MONITOR,
			component: (props) => <GeoFenceSettingBlock {...props} />,
		},
	],
}

export const settingModule = {
	title: 'settings',
	defaultActiveKey: 'user profile',
	path: routes.SETTINGS,
	tabList: [
		{
			name: 'user profile',
			component: (props) => <UserProfile {...props} />,
		},
		{
			name: 'custom settings',
			component: (props) => <GeneralSettings {...props} />,
			permission: 'route:generalSettings',
		},
		{
			name: 'search settings',
			component: () => null,
			permission: 'route:generalSettings',
		},
		{
			name: 'monitor settings',
			alias: 'monitor',
			path: '/page/monitor',
			module: monitorSettingModule,
			permission: 'route:monitor',
			platform: ['browser', 'tablet'],
			component: (props) => <GeoFenceSettingBlock {...props} />,
		},
		{
			name: 'notification settings',
			component: () => null,
			permission: 'route:generalSettings',
		},
		{
			name: 'lbeacon',
			component: (props) => <LBeaconTable {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
			permission: 'route:lbeacon',
		},
		{
			name: 'gateway',
			component: (props) => <GatewayTable {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
			permission: 'route:gateway',
		},
	],
}

export const trackingHistoryContainerModule = {
	title: 'tracking history',
	defaultActiveKey: '', // to be assigned
	path: routes.TRACE,
	tabList: [
		{
			name: 'real time record',
			permission: 'route:trackingHistory',
			component: (props) => <TrackingTable {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'historical record',
			permission: 'route:trackingHistory',
			component: (props) => <TraceContainer {...props} />,
			platform: ['browser', 'tablet'],
		},
	],
}

export const reportContainerModule = {
	title: 'report',
	defaultActiveKey: 'Get Assignments',
	path: routes.RECORDS,
	tabList: [
		{
			name: 'Get Assignments',
			component: (props) => <GetAssignments {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Generate and View Shift Change Record',
			component: (props) => <ShiftChangeRecord {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Report and Change Notes On Patients',
			component: () => null,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Report And Change Device Status',
			component: () => null,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Report Of Historical Device Status Changed Records',
			component: (props) => <ObjectEditedRecord {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Request Object Trace',
			component: () => null,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Request Asset Usage Data',
			component: () => null,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Report Of Historical Notifications',
			component: () => null,
			platform: ['browser', 'tablet', 'mobile'],
		},
		{
			name: 'Shift Change Historical Record',
			component: (props) => <ShiftChangeHistoricalRecord {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
		},
	],
}

export const BOTAdminModule = {
	title: 'BOT admin',
	defaultActiveKey: 'Add Delete User Accounts',
	permission: 'route:BOTAdmin',
	path: routes.BOT_ADMIN,
	tabList: [
		{
			name: 'Add Delete User Accounts',
			permission: 'route:BOTAdmin',
			component: (props) => <AdminManagementContainer {...props} />,
			platform: ['browser', 'tablet'],
		},
		{
			name: 'Edit User Roles And Permissions',
			permission: 'route:BOTAdmin',
			// component: (props) => <RolePermissionManagement {...props} />, // temporary hide
			component: () => null,
			platform: ['browser'],
		},
		{
			name: 'Generate Revise Device Assignments',
			permission: 'route:BOTAdmin',
			path: 'devicesManagement',
			href: '#DevicesManagement',
			component: (props) => <DeviceGroupManager {...props} />,
		},
		{
			name: 'Generate Revise Patient Assignments',
			permission: 'route:BOTAdmin',
			path: 'patientManagement',
			href: '#PatientManagement',
			component: (props) => <PatientGroupManager {...props} />,
		},
		{
			name: 'Add Delete Transfer Locations',
			permission: 'route:BOTAdmin',
			component: (props) => <TransferredLocationManagement {...props} />,
			platform: ['browser'],
		},
	],
}

export const navbarNavList = [
	{
		name: 'home',
		alias: 'home',
		path: routes.HOME,
		hasEvent: true,
	},
	{
		name: 'object management',
		alias: 'objectManagement',
		path: routes.OBJECT_MANAGEMENT,
		permission: 'route:objectManagement',
		hasEvent: true,
	},
	{
		name: 'BOT Admin',
		alias: 'BOTAdmin',
		path: routes.BOT_ADMIN,
		module: BOTAdminModule,
		permission: 'route:BOTAdmin',
		platform: ['browser', 'tablet', 'mobile'],
	},
	{
		name: 'record',
		alias: 'record',
		path: routes.RECORDS,
		module: reportContainerModule,
		permission: 'route:report',
		platform: ['browser', 'tablet', 'mobile'],
	},
	{
		name: 'settings',
		alias: 'settings',
		path: routes.SETTINGS,
		module: settingModule,
		platform: ['browser', 'tablet', 'mobile'],
	},

	// {
	//     name: 'tracking history',
	//     alias: 'trackinghistory',
	//     path: '/page/trace',
	//     module: trackingHistoryContainerModule,
	//     permission: 'route:trackingHistory',
	// },
	// {
	//     name: "monitor setting",
	//     alias: "monitor",
	//     path: "/page/monitor",
	//     module: monitorSettingModule,
	//     permission: "route:monitor",
	//     platform: ['browser', 'tablet']
	// },
	// {
	//     name: 'contact tree',
	//     alias: 'contactTree',
	//     path: '/page/contactTree',
	//     permission: 'route:contactTree',
	//     platform: ['browser']
	// },
]
