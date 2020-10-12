/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        apiHelper.js

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

import monitorApis from '../apiAgent/monitorApis'
import geofenceApis from '../apiAgent/geofenceApis'
import record from '../apiAgent/recordApiAgent'
import objectApiAgent from '../apiAgent/objectAPiAgent'
import transferredLocationApiAgent from '../apiAgent/transferredLocationApiAgent'
import authApiAgent from '../apiAgent/authApiAgent'
import userApiAgent from '../apiAgent/userApiAgent'
import deviceGroupListApis from '../apiAgent/deviceGroupListApiAgent'
import patientGroupListApis from '../apiAgent/patientGroupListApiAgent'
import trackingDataApiAgent from '../apiAgent/trackingDataApiAgent'
import roleApiAgent from '../apiAgent/roleApiAgent'
import areaApiAgent from '../apiAgent/areaApiAgent'
import lbeaconApiAgent from '../apiAgent/lbeaconApiAgent'
import gatewayApiAgent from '../apiAgent/gatewayApiAgent'
import importedObjectApiAgent from '../apiAgent/importedObjectApiAgent'
import fileApiAgent from '../apiAgent/fileApiAgent'
import utilsApiAgent from '../apiAgent/utilsApiAgent'

const apiHelper = {
	monitor: monitorApis,

	geofenceApis,

	record,

	objectApiAgent,

	importedObjectApiAgent,

	transferredLocationApiAgent,

	authApiAgent,

	userApiAgent,

	trackingDataApiAgent,

	roleApiAgent,

	areaApiAgent,

	lbeaconApiAgent,

	gatewayApiAgent,

	deviceGroupListApis,

	patientGroupListApis,

	fileApiAgent,

	utilsApiAgent,
}

export default apiHelper
