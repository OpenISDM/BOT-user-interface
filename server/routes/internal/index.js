/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        routes/internal/index.js

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

import trackingData from './tracking-data'
import lbeacon from './lbeacon'
import gateway from './gateway'
import user from './user'
import object from './object'
import locationHistory from './location-history'
import area from './area'
import file from './file'
import role from './role'
import geofence from './geofence'
import monitor from './monitor'
import record from './record'
import transferredLocation from './transferred-location'
import groupList from './group-list'
import utils from './utils'
import userAssignments from './user-assignments'
import namedList from './named-list'
import notification from './notification'

export default (app) => {
	trackingData(app)
	lbeacon(app)
	gateway(app)
	user(app)
	object(app)
	locationHistory(app)
	area(app)
	file(app)
	role(app)
	geofence(app)
	monitor(app)
	record(app)
	transferredLocation(app)
	groupList(app)
	utils(app)
	userAssignments(app)
	namedList(app)
	notification(app)
}
