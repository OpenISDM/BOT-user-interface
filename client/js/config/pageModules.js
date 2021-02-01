/* eslint-disable react/display-name */
import React from 'react'
import UserProfile from '../components/container/UserContainer/UserProfile'
import LBeaconTable from '../components/container/LBeaconTable'
import GatewayTable from '../components/container/GatewayTable'
import AgentTable from '../components/container/AgentTable'
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer'
import DeviceGroupManager from '../components/container/UserContainer/DeviceGroupManager'
import PatientGroupManager from '../components/container/UserContainer/PatientGroupManager'
import MonitorSetting from '../components/container/MonitorSetting'
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord'
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord'
import DeviceTable from '../components/presentational/DeviceTable'
import PatientTable from '../components/presentational/PatientTable'
import TrackingTable from '../components/container/TrackingTable'
import BatteryStatusTable from '../components/container/BatteryStatusTable'
import TraceContainer from '../components/container/menuContainer/TraceContainer'
import routes from '../config/routes/routes'
import Loadable from 'react-loadable'
import Loader from '../components/presentational/Loader'
import CustomSettings from '../components/container/menuContainer/CustomSettings'
import SearchSettings from '../components/container/menuContainer/SearchSettings'
import GetAssignments from '../components/container/GetAssignments'
import ShiftChangeHistoricalRecord from '../components/container/ShiftChangeHistoricalRecord'
// import RolePermissionManagement from '../components/container/RolePermissionManagement'
// import TransferredLocationManagement from '../components/container/TransferredLocationManagement';

const TransferredLocationManagement = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "TransferredLocationManagement" */
			'../components/container/TransferredLocationManagement'
		),
	loading: Loader,
})

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
			component: (props) => <CustomSettings {...props} />,
			permission: 'route:customSettings',
		},
		{
			name: 'search settings',
			component: (props) => <SearchSettings {...props} />,
			permission: 'route:searchSettings',
		},
		{
			name: 'monitor settings',
			alias: 'monitor',
			path: '/page/monitor',
			permission: 'route:monitor',
			platform: ['browser', 'tablet'],
			component: (props) => <MonitorSetting {...props} />,
		},
		{
			name: 'notification settings',
			component: () => null,
			permission: 'route:customSettings',
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
		{
			name: 'agent',
			component: (props) => <AgentTable {...props} />,
			platform: ['browser', 'tablet', 'mobile'],
			permission: 'route:agent',
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

export const ObjectManagementModule = {
	title: 'Object Management',
	defaultActiveKey: 'Device Table',
	permission: 'route:objectManagement',
	path: routes.OBJECT_MANAGEMENT,
	tabList: [
		{
			name: 'Device Table',
			permission: 'route:objectManagement',
			component: (props) => <DeviceTable {...props} />,
			platform: ['browser'],
		},
		{
			name: 'Patient Table',
			permission: 'route:objectManagement',
			component: (props) => <PatientTable {...props} />,
			platform: ['browser'],
		},
		{
			name: 'Staff Table',
			permission: 'route:objectManagement',
			component: () => null,
			platform: ['browser'],
		},
		{
			name: 'Vistor Table',
			permission: 'route:objectManagement',
			component: () => null,
			platform: ['browser'],
		},
		{
			name: 'Battery Table',
			permission: 'route:objectManagement',
			component: (props) => <BatteryStatusTable {...props} />,
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
		module: ObjectManagementModule,
		permission: 'route:objectManagement',
		platform: ['browser', 'tablet', 'mobile'],
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
	// {
	//     name: 'contact tree',
	//     alias: 'contactTree',
	//     path: '/page/contactTree',
	//     permission: 'route:contactTree',
	//     platform: ['browser']
	// },
]
