/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        roles.js

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
			'route:bigScreen',
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
	system_admin: {
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
			'route:bigScreen',
			'route:management',
			'route:systemSetting',
			'route:contactTree',
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
			'route:bigScreen',
			'route:monitor',
			'route:report',
			'route:management',
			'route:systemSetting',
			'route:contactTree',
			'route:setting',
			'route:lbeacon',
			'route:gateway',

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
