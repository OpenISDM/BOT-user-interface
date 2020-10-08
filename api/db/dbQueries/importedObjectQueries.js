/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        importedObjectQueries.js

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

export default {
    getImportedObject: () => {
        const text = `
            SELECT
                import_table.id,
                import_table.name,
                import_table.asset_control_number,
                import_table.type

            FROM import_table

            LEFT JOIN object_table
            ON object_table.asset_control_number = import_table.asset_control_number
        `

        return text
    },

    deleteImporedtObject: (idPackage) => {
        const controlNumbers = idPackage.map((item) => `'${item}'`)
        const query = `
            DELETE FROM import_table
            WHERE asset_control_number IN (${controlNumbers});`

        return query
    },

    addImportedObject: (idPackage) => {
        const item = idPackage.map((item) => {
            return `('${item.name}', '${item.type}', '${item.asset_control_number}')`
        })

        const text = `
            INSERT INTO import_table (
                name,
                type,
                asset_control_number
            )
            VALUES ${item}`
        return text
    },
}
