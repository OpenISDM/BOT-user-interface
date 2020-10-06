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

const trackingDataRoutes = require('./dataRoutes/trackingDataRoutes')
const lbeaconRoutes = require('./dataRoutes/lbeaconRoutes')
const gatewayRoutes = require('./dataRoutes/gatewayRoutes')
const userRoutes = require('./dataRoutes/userRoutes')
const objectRoutes = require('./dataRoutes/objectRoutes')
const importedObjectRoutes = require('./dataRoutes/importedObjectRoutes')
const locationHistoryRoutes = require('./dataRoutes/locationHistoryRoutes')
const areaRoutes = require('./dataRoutes/areaRoutes')
const fileRoutes = require('./dataRoutes/fileRoutes')
const roleRoutes = require('./dataRoutes/roleRoutes')
const geofenceRoutes = require('./dataRoutes/geofenceRoutes')
const monitorRoutes = require('./dataRoutes/monitorRoutes')
const recordRoutes = require('./dataRoutes/recordRoutes')
const transferredLocationRoutes = require('./dataRoutes/transferredLocationRoutes')
const groupListRoutes = require('./dataRoutes/groupListRoutes')
const utilsRoutes = require('./dataRoutes/utilsRoutes')

module.exports = (app) => {
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
}
