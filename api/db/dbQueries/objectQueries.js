/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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

	let text =  `
		SELECT 
			object_table.id,
			object_table.name, 
			object_table.type, 
			object_table.nickname,
			object_table.asset_control_number, 
			object_table.status, 
			object_table.transferred_location, 
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
	
		WHERE object_table.object_type IN (${objectType.map(type => type)})
		${areas_id ? `AND object_table.area_id IN (${areas_id.map(id => id)})` : ''}
		ORDER BY 
			object_table.name ASC,
			object_table.registered_timestamp DESC
			
			;
	`
	return text
} 

const addPersona = (formOption) => {
	const text = 
		`
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
			1,
			'register',
			'normal',
			now()
		)`;

	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
		formOption.monitor_type,
	];

	const query = {
		text,
		values
	};

	return query;
}

const editPersona = (formOption) => {
	const text = `
		Update object_table 
		SET name = $2,
			mac_address = $3,
			area_id = $4,
			monitor_type = $5,
			object_type = 1
		WHERE asset_control_number = $1
	`;
		
	const values = [
		formOption.asset_control_number,
		formOption.name,
		formOption.mac_address,
		formOption.area_id,
		formOption.monitor_type
	];

	const query = {
		text,
		values
	};

	return query;
}


const editObject = (formOption) => {
	 
	let text = 
		`
		Update object_table 
		SET type = $1,
			status = $2,
			transferred_location = '${formOption.transferred_location}',
			asset_control_number = $3,
			name = $4,
			monitor_type = $5,
			area_id = $6,
			mac_address = $7,
			nickname = $8
		WHERE asset_control_number = $3
		`
	const values = [
		formOption.type, 
		formOption.status, 
		formOption.asset_control_number, 
		formOption.name,
		formOption.monitor_type,
		formOption.area_id,
		formOption.mac_address,
		formOption.nickname
	];

	const query = {
		text,
		values
	};

	return query;
}

const deleteObject = (formOption) => {
    
	const query = `
		DELETE FROM object_table
		WHERE mac_address IN (${formOption.map(item => `'${item}'`)});
	`
	return query
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
	`;
		
	const values = [
		formOption.type, 
		formOption.asset_control_number, 
		formOption.name, 
		formOption.mac_address,
		formOption.area_id,
		formOption.monitor_type,
		formOption.nickname
	];


	const query = {
		text,
		values
	};

	return query;
}

const editObjectPackage = (
	formOption, 
	username, 
	record_id, 
	reservedTimestamp
) => {
	let item = formOption[0]
	let text = `
		UPDATE object_table
		SET 
			status = '${item.status}',
			transferred_location = ${item.transferred_location.id},
			note_id = ${record_id},
			reserved_timestamp = ${item.status == 'reserve' ? `'${reservedTimestamp}'` : null},
			reserved_user_id = (SELECT id
				FROM user_table
				WHERE user_table.name='${username}')
								
		WHERE asset_control_number IN (${formOption.map(item => `'${item.asset_control_number}'`)});
	`
	return text
}

const addObjectSummaryRecord = (mac_address) => {
	let text = `
		INSERT INTO object_summary_table (
			mac_address
		) 
		values (
			$1
		)
	`

	let values =[
		mac_address
	]

	return {
		text, 
		values
	}
}

module.exports = {
    getObject,
	addPersona,
	addObject,
	editObject,
    editPersona,
	deleteObject,
	editObjectPackage,
	addObjectSummaryRecord
}