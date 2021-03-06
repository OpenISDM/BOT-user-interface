const rules = {
	guest: {
		permission: ['form:view'],
	},
	care_provider: {
		permission: [
			'form:edit',
			'route:devicesManagement',
			'route:patientManagement',
			'route:objectManagement',
			'route:userProfile',
			'route:trackingHistory',
			'route:report',

			'user:mydevice',
			'user:mypatient',
			'user:shiftChange',
			'user:saveSearchRecord',
			'user:cleanPath',
			'user:toggleShowDevices',
			'user:toggleShowResidents',
			'route:monitorSetting',
			'user:batteryNotice',
		],
	},
	bot_admin: {
		permission: [
			'form:edit',

			'route:systemStatus',
			'route:userProfile',
			'route:objectManagement',
			'route:editObjectManagement',
			'route:userManager',
			'route:shiftChangeRecord',
			'route:rolePermissionManagement',
			'route:transferredLocationManagement',
			'route:trackingHistory',
			'route:monitor',
			'route:report',
			'route:management',
			'route:systemSetting',
			'route:setting',
			'route:BOTAdmin',
			'route:customSettings',
			'route:searchSettings',

			'user:mydevice',
			'user:mypatient',
			'user:shiftChange',
			'user:saveSearchRecord',
			'user:cleanPath',
			'user:toggleShowDevices',
			'user:toggleShowResidents',
			'route:monitorSetting',
			'user:importTable',
			'user:batteryNotice',
		],
	},
	dev: {
		permission: [
			'form:edit',
			'form:develop',
			'route:systemStatus',
			'route:userProfile',
			'route:objectManagement',
			'route:editObjectManagement',
			'route:shiftChangeRecord',
			'route:userManager',
			'route:rolePermissionManagement',
			'route:transferredLocationManagement',
			'route:trackingHistory',
			'route:monitor',
			'route:report',
			'route:management',
			'route:systemSetting',
			'route:setting',
			'route:lbeacon',
			'route:gateway',
			'route:agent',
			'route:traceContainer',
			'route:contactTree',

			'user:mydevice',
			'user:mypatient',
			'user:saveSearchRecord',
			'user:cleanPath',
			'user:toggleShowDevices',
			'user:toggleShowResidents',
			'user:importTable',
			'user:batteryNotice',
			'user:shiftChange',
			'view:lbeaconMarker',
		],
	},
}

export default rules
