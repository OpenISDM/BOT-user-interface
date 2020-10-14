/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        lbeaconQueries.js

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

const getLbeaconTable = `
	SELECT
		id,
		uuid,
		description,
		ip_address,
		health_status,
		gateway_ip_address,
		last_report_timestamp,
		danger_area,
		room,
		api_version,
		server_time_offset,
        product_version,
        comment
	FROM lbeacon_table
	ORDER BY ip_address DESC
`

const deleteLBeacon = (idPackage) => {
	const query = `
		DELETE FROM lbeacon_table
		WHERE id IN (${idPackage.map((item) => `'${item}'`)});
	`
	return query
}

const editLbeacon = (formOption) => {
	const text = `
		UPDATE lbeacon_table
		SET
            description = $2,
            comment = $3


		WHERE uuid = $1
	`

	const values = [formOption.uuid, formOption.description, formOption.comment]

	const query = {
		text,
		values,
	}

	return query
}

export default {
	getLbeaconTable,
	deleteLBeacon,
	editLbeacon,
}
