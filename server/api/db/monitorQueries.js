/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        monitorQueries.js

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

const getMonitorConfig = (type) => {
	const text = `
		SELECT
			${type}.id,
			${type}.area_id,
			${type}.enable,
			${type}.start_time,
			${type}.end_time,
			${type}.is_active,
			lbeacon_temp_table.lbeacons

		FROM ${type}

		LEFT JOIN (

			SELECT
				lbeacon_area_id,
				ARRAY_AGG(uuid) AS lbeacons
			FROM (

				SELECT

					SUBSTRING(uuid::text, 1, 4)::INTEGER AS lbeacon_area_id,
					uuid,
					room

				FROM lbeacon_table
				WHERE room IS NOT NULL

			) AS temp
			GROUP BY lbeacon_area_id
		) as lbeacon_temp_table
		ON lbeacon_temp_table.lbeacon_area_id = ${type}.area_id

		ORDER BY id;
	`
	return text
}

const deleteMonitorConfig = (monitorConfigPackage) => {
	const { type, id } = monitorConfigPackage
	return `
		DELETE FROM ${type}
		WHERE id IN (${id.map((id) => `'${id}'`)})
	`
}

const addMonitorConfig = (monitorConfigPackage) => {
	const { type, start_time, end_time, enable, area_id } = monitorConfigPackage

	const text = `
		INSERT INTO ${type}
			(
				start_time,
				end_time,
				enable,
				area_id
			)
		VALUES
			(
				$1,
				$2,
				$3,
				$4
			)
	`

	const values = [start_time, end_time, enable, area_id]

	return {
		text,
		values,
	}
}

const setMonitorConfig = (monitorConfigPackage) => {
	const {
		type,
		id,
		start_time,
		end_time,
		enable,
		area_id,
	} = monitorConfigPackage

	const text = `
		UPDATE ${monitorConfigPackage.type}
		SET
			area_id = $5,
			start_time = $2,
			end_time = $3,
			enable = $4

		WHERE id = $1;
	`
	const values = [id, start_time, end_time, enable, area_id]

	const query = {
		text,
		values,
	}

	return query
}

export default {
	getMonitorConfig,
	deleteMonitorConfig,
	addMonitorConfig,
	setMonitorConfig,
}
