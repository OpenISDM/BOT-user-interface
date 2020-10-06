/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        dataSrc.js

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

dataSrcIP = process.env.DATASRC_IP
dataSrcProtocol = parseInt(process.env.ENABLE_HTTP) ? 'http' : 'https'
domain = `${dataSrcProtocol}://${dataSrcIP}`

const dataSrc = {
    trackingData: `${domain}/data/trackingData`,

    lbeacon: `${domain}/data/lbeacon`,

    gateway: `${domain}/data/gateway`,

    user: `${domain}/data/user`,

    userInfo: {
        area: {
            secondary: `${domain}/data/user/area/secondary`,
        },

        password: `${domain}/data/user/password`,

        locale: `${domain}/data/user/locale`,

        searchHistory: `${domain}/data/user/searchHistory`,

        mydevice: `${domain}/data/user/mydevice`,

        maxSearchHistoryCount: `${domain}/data/user/maxSearchHistoryCount`,

        keywordType: `${domain}/data/user/keywordType`,

        listId: `${domain}/data/user/listId`,
    },

    object: {
        object: `${domain}/data/object`,

        device: `${domain}/data/object/device`,

        person: `${domain}/data/object/person`,

        idleMacaddr: `${domain}/data/object/mac/idle`,

        alias: `${domain}/data/object/alias`,
    },

    objectPackage: `${domain}/data/objectPackage`,

    importedObject: `${domain}/data/importedObject`,

    trace: {
        locationHistory: `${domain}/data/trace/locationHistory`,

        contactTree: `${domain}/data/trace/contactTree`,
    },

    area: `${domain}/data/area`,

    role: `${domain}/data/role`,

    auth: {
        signin: `${domain}/data/auth/signin`,

        signout: `${domain}/data/auth/signout`,

        validation: `${domain}/data/auth/validation`,

        resetPassword: `${domain}/data/auth/resetpassword`,

        sentResetPwdInstruction: `${domain}/data/auth/sentResetPwdInstruction`,
    },

    file: {
        export: {
            csv: `${domain}/data/file/export/csv`,
            pdf: `${domain}/data/file/export/pdf`,
        },
    },

    geofence: `${domain}/data/geofence`,

    monitor: `${domain}/data/monitor`,

    record: {
        editedObject: `${domain}/data/record/editedObject`,

        shiftChange: `${domain}/data/record/shiftChange`,

        patientRecord: `${domain}/data/record/patientRecord`,
    },

    transferredLocation: `${domain}/data/transferredLocation`,

    deviceGroupList: `${domain}/data/deviceGroupList`,

    patientGroupList: `${domain}/data/patientGroupList`,

    pdfUrl: (path) => {
        return `${domain}/data/file/${path}`
    },

    utils: {
        searchableKeyword: `${domain}/data/utils/searchableKeyword`,
    },
}

module.exports = dataSrc
