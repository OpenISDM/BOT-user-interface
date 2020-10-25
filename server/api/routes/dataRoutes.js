/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        dataRoutes.js

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

import trackingDataRoutes from './dataRoutes/trackingDataRoutes'
import lbeaconRoutes from './dataRoutes/lbeaconRoutes'
import gatewayRoutes from './dataRoutes/gatewayRoutes'
import userRoutes from './dataRoutes/userRoutes'
import objectRoutes from './dataRoutes/objectRoutes'
import importedObjectRoutes from './dataRoutes/importedObjectRoutes'
import locationHistoryRoutes from './dataRoutes/locationHistoryRoutes'
import areaRoutes from './dataRoutes/areaRoutes'
import fileRoutes from './dataRoutes/fileRoutes'
import roleRoutes from './dataRoutes/roleRoutes'
import geofenceRoutes from './dataRoutes/geofenceRoutes'
import monitorRoutes from './dataRoutes/monitorRoutes'
import recordRoutes from './dataRoutes/recordRoutes'
import transferredLocationRoutes from './dataRoutes/transferredLocationRoutes'
import groupListRoutes from './dataRoutes/groupListRoutes'
import utilsRoutes from './dataRoutes/utilsRoutes'
import userAssignments from './dataRoutes/userAssignmentsRoutes'

const dataRoutes = (app) => {
	trackingDataRoutes(app)
	lbeaconRoutes(app)
	gatewayRoutes(app)
	userRoutes(app)
	objectRoutes(app)
	importedObjectRoutes(app)
	locationHistoryRoutes(app)
	areaRoutes(app)
	fileRoutes(app)
	roleRoutes(app)
	geofenceRoutes(app)
	monitorRoutes(app)
	recordRoutes(app)
	transferredLocationRoutes(app)
	groupListRoutes(app)
	utilsRoutes(app)
	userAssignments(app)
}

export default dataRoutes
