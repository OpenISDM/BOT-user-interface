/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        gatawayQueries.js

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

const getAllGateway = `
	SELECT
		ip_address,
		health_status,
		last_report_timestamp,
		registered_timestamp,
		id,
		api_version,
		product_version,
		abnormal_lbeacon_list,
		comment
	FROM
		gateway_table
	ORDER BY ip_address DESC
`

const deleteGateway = (idPackage) => {
    const query = `
		DELETE FROM gateway_table
		WHERE id IN (${idPackage.map((item) => `'${item}'`)});
	`
    return query
}

const editGateway = (formOption) => {
    const text = `
		UPDATE gateway_table
		SET
            comment = $2

		WHERE id = $1
	`

    const values = [formOption.id, formOption.comment]

    const query = {
        text,
        values,
    }

    return query
}

export default {
    getAllGateway,
    deleteGateway,
    editGateway,
}
