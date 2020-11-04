/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectQueries.js

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

const getObject = (objectType, areas_id) => {
	const text = `
		SELECT
			object_table.id,
			object_table.name,
			object_table.type,
			object_table.nickname,
			object_table.asset_control_number,
			object_table.status,
			object_table.transferred_location,
			object_table.list_id,
			object_table.type_alias,
			JSON_BUILD_OBJECT(
				'id', branches.id,
				'name', branches.name,
				'department', branches.department
			) AS transferred_location,
			object_table.mac_address,
			object_table.monitor_type,
			object_table.area_id,
			area_table.name as area_name,
			object_table.registered_timestamp,
			object_table.object_type,
			object_table.id,
			object_table.room,
			object_table.physician_id,
			(
				SELECT name
				FROM user_table
				WHERE user_table.id = object_table.physician_id
			) as physician_name

		FROM object_table

		LEFT JOIN area_table
		ON area_table.id = object_table.area_id

		LEFT JOIN branches
		ON branches.id = object_table.transferred_location

		WHERE object_table.object_type IN (${objectType.map((type) => type)})
		${areas_id ? `AND object_table.area_id IN (${areas_id.map((id) => id)})` : ''}
		ORDER BY
			object_table.name ASC,
			object_table.registered_timestamp DESC

			;
	`
	return text
}

const addPersona = (formOption) => {
	const text = `
		INSERT INTO object_table (
			name,
			mac_address,
			asset_control_number,
			area_id,
			monitor_type,
			object_type,
			type,
			status,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			'Patient',
			'returned',
			now()
		)`

	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
		formOption.monitor_type,
		formOption.object_type,
	]

	const query = {
		text,
		values,
	}

	return query
}

const editPersona = (formOption) => {
	const text = `
		Update object_table
		SET name = $2,
			mac_address = $3,
			area_id = $4,
			monitor_type = $5,
			object_type = $6
		WHERE asset_control_number = $1
	`

	const values = [
		formOption.asset_control_number,
		formOption.name,
		formOption.mac_address,
		formOption.area_id,
		formOption.monitor_type,
		formOption.object_type,
	]

	const query = {
		text,
		values,
	}

	return query
}

const editDevice = (formOption) => {
	const text = `
		Update object_table
		SET type = $2,
			status = $3,
			asset_control_number = $4,
			name = $5,
			monitor_type = $6,
			area_id = $7,
			mac_address = $8,
			nickname = $9,
			transferred_location = $10
		WHERE id = $1
		`
	const values = [
		formOption.id,
		formOption.type,
		formOption.status,
		formOption.asset_control_number,
		formOption.name,
		formOption.monitor_type,
		formOption.area_id,
		formOption.mac_address,
		formOption.nickname,
		formOption.transferred_location,
	]

	const query = {
		text,
		values,
	}

	return query
}

const deleteObject = (formOption) => {
	const query = `
		DELETE FROM object_table
		WHERE id IN (${formOption.map((item) => `'${item.id}'`)})
	`
	return query
}

const disassociate = (formOption) => {
	const text = `
		UPDATE object_table
		SET mac_address = null
		WHERE id = $1

		RETURNING (
			SELECT mac_address
			FROM object_table
			WHERE id = $1
		)
	`

	const values = [formOption.id]

	return {
		text,
		values,
	}
}

const addObject = (formOption) => {
	const text = `
		INSERT INTO object_table (
			type,
			asset_control_number,
			name,
			mac_address,
			area_id,
			monitor_type,
			nickname,
			object_type,
			status,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			0,
			'normal',
			now()
		);
	`

	const values = [
		formOption.type,
		formOption.asset_control_number,
		formOption.name,
		formOption.mac_address,
		formOption.area_id,
		formOption.monitor_type,
		formOption.nickname,
	]

	const query = {
		text,
		values,
	}

	return query
}

const editObjectPackage = (
	formOption,
	username,
	record_id,
	reservedTimestamp
) => {
	const item = formOption[0]

	const [name, department] =
		item &&
		item.transferred_location &&
		item.transferred_location.label &&
		item.transferred_location.label.split('-')

	let branchQuery = null
	if (name && department) {
		branchQuery = `
            (
                SELECT id FROM branches WHERE name = '${name}' AND department = '${department}'
            )`
	}

	const text = `
		UPDATE object_table
		SET
			status = '${item.status}',
			transferred_location = ${item.status === 'transferred' ? branchQuery : null},
			note_id = ${record_id},
			reserved_timestamp = ${
				item.status === 'reserve' ? `'${reservedTimestamp}'` : null
			},
			reserved_user_id = (SELECT id
				FROM user_table
				WHERE user_table.name='${username}')

		WHERE asset_control_number IN (${formOption.map(
			(item) => `'${item.asset_control_number}'`
		)});
	`
	return text
}

const deleteObjectSummaryRecord = (mac_address_array) => {
	return `
		DELETE FROM object_summary_table
		WHERE mac_address IN (${mac_address_array.map((item) => `'${item}'`)});
	`
}

const getIdleMacaddr = () => {
	return `
		SELECT
			ARRAY_AGG(object_summary_table.mac_address) AS mac_set
		FROM object_summary_table

		LEFT JOIN object_table
		ON object_summary_table.mac_address = object_table.mac_address

		WHERE object_table.name IS NULL
	`
}

const getAlias = () => {
	return `
		SELECT
			DISTINCT type,
			type_alias
		FROM object_table
		WHERE type != 'Patient'
		ORDER BY type ASC
	`
}

const editAlias = (objectType, alias) => {
	const text = `
		UPDATE object_table
		SET type_alias = $2
		WHERE type = $1
	`

	const values = [objectType, alias]

	return {
		text,
		values,
	}
}

export default {
	getObject,
	addPersona,
	addObject,
	editDevice,
	editPersona,
	deleteObject,
	disassociate,
	editObjectPackage,
	deleteObjectSummaryRecord,
	getIdleMacaddr,
	getAlias,
	editAlias,
}
