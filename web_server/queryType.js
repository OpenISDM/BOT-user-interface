require('dotenv').config();
function getTrackingData (areas_id) {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.last_reported_timestamp,
			object_summary_table.panic_violation_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_summary_table.base_x,
			object_summary_table.base_y,
			object_table.id,
			object_table.name,
			object_table.type,
			object_table.status,
			object_table.transferred_location,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			object_table.physician_id,
			object_table.asset_control_number as last_four_acn,
			lbeacon_table.description as location_description,
			edit_object_record.notes,
			user_table.name as physician_name,
			object_table.reserved_timestamp,
			notification.json_agg as notification,
			JSON_BUILD_OBJECT(
				'id', area_table.id,
				'value', area_table.name
			) AS area,
			object_table.reserved_user_id,
			(
				SELECT name
				FROM user_table
				WHERE user_table.id = object_table.reserved_user_id
			) as reserved_user_name,
			COALESCE(patient_record.record, ARRAY[]::JSON[]) as records			
		
		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN edit_object_record
		ON object_table.note_id = edit_object_record.id

		LEFT JOIN area_table
		ON object_table.area_id = area_table.id

		LEFT JOIN (
			SELECT 
				object_id,
				ARRAY_AGG(JSON_BUILD_OBJECT(
					'created_timestamp', created_timestamp,
					'record', record,
					'recorded_user', (
						SELECT name
						FROM user_table
						WHERE id = editing_user_id 
					)
				)) as record 
			FROM (
				SELECT *
				FROM patient_record
				ORDER BY created_timestamp DESC
			) as patient_record_table
			GROUP BY object_id					
		) as patient_record
		ON object_table.id = patient_record.object_id

		LEFT JOIN user_table
		ON user_table.id = object_table.physician_id

		LEFT JOIN (
			SELECT 
				mac_address,
				json_agg(json_build_object(
					'type', monitor_type, 
					'time', violation_timestamp
				))
			FROM (
				SELECT 
					mac_address,
					monitor_type,
					MIN(violation_timestamp) AS violation_timestamp
				FROM (
					SELECT 
						mac_address,
						monitor_type,
						violation_timestamp
					FROM notification_table
					WHERE 
						web_processed IS NULL
				)	as tmp_1
				GROUP BY mac_address, monitor_type
			) as tmp_2
			GROUP BY mac_address
		) as notification
		ON notification.mac_address = object_summary_table.mac_address

		WHERE object_table.area_id IN (${areas_id.map(id => id)})

		ORDER BY 
			object_table.type, 
			object_table.asset_control_number
			DESC;
	`
	return query;
}

const getTrackingTableByMacAddress = (object_mac_address) => {
	let text = '';

		text += `
			SELECT
				*
			FROM location_history_table
			WHERE mac_address = '
			`;
		text += object_mac_address;
		text +=`'
			AND  record_timestamp > now() - interval '1 hour'
			ORDER BY  record_timestamp ASC
			`;
	return text;
}

const getLocationHistory = (key, startTime, endTime, mode) => {
	let query = null
	switch(mode) {
		case 'name':
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.record_timestamp,
					location_history_table.mac_address,
					lbeacon_table.description,
					object_table.name,
					area_table.name AS area
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE object_table.name = '${key}'

				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				ORDER BY location_history_table.record_timestamp ASC
			`
			break;
		case "mac": 
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.record_timestamp,
					location_history_table.mac_address,
					lbeacon_table.description,
					object_table.name,
					area_table.name AS area
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE location_history_table.mac_address = '${key}'

				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				ORDER BY location_history_table.record_timestamp ASC
			`
			break;
		case "uuid":
			query =  `
				SELECT 
					location_history_table.uuid,
					location_history_table.mac_address,
					lbeacon_table.description,
					area_table.name AS area,
					object_table.name
				FROM location_history_table

				LEFT JOIN lbeacon_table 
				ON lbeacon_table.uuid = location_history_table.uuid

				LEFT JOIN object_table 
				ON location_history_table.mac_address = object_table.mac_address

				LEFT JOIN area_table
				ON location_history_table.area_id = area_table.id

				WHERE location_history_table.uuid = '${key}'
				AND object_table.object_type != 0
				${startTime ? `AND record_timestamp >= '${startTime}'` : ""}
				${endTime ? `AND record_timestamp <= '${endTime}'` : ""}

				GROUP BY 
					location_history_table.mac_address, 
					location_history_table.uuid,
					object_table.name,
					lbeacon_table.description,
					area_table.name,
					location_history_table.area_id

				ORDER BY object_table.name ASC

			`
			break;

	}

	return query
}

const getImportTable = () => {

	let text = `
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id
			FROM import_table 
			WHERE import_table.type != 'patient'
		`;
	
	return text
} 

const getImportPatient = () => {

	let text = `
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id
			FROM import_table WHERE import_table.type ='patient'
		`;
	
	return text
} 

function addAssociation (formOption) {
	// console.log(formOption)
	const text = `
		INSERT INTO object_table (
			name,
			type,
			asset_control_number,
			mac_address,
			area_id,
			status,
			object_type,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			'normal',
			0,
			now()
		)
	`
	;

	const values = [
		formOption.name,
		formOption.type,
		formOption.asset_control_number,
		formOption.mac_address,
		formOption.area_id
	]

	const query = {
		text, 
		values
	};

	return query;

}


function addAssociation_Patient (formOption) {
	// console.log(formOption)
	const text = `
		INSERT INTO object_table (
			name,
			type,
			asset_control_number,
			mac_address,
			area_id,
			status,
			object_type,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			'Patient',
			1,
			now()
		)
	`
	;

	const values = [
		formOption.name,
		formOption.type,
		formOption.asset_control_number,
		formOption.mac_address,
		formOption.area_id
	]

	const query = {
		text, 
		values
	};

	return query;

}




function cleanBinding(formOption) {
	const text =
		`
		UPDATE import_table
		SET 
			mac_address = $2,
			bindflag = $3
		WHERE id = $1
	`;

	const values = [
		formOption,
		'',
		'No Binding'
	]

	const query = {
		text, 
		values
	};

	return query


}


function getImportData(formOption){
	let	text =	`
		SELECT 
			name, 
			type,
			asset_control_number
		FROM object_table

		WHERE mac_address = $1 
		
		`;

	const values = [formOption];

	const query = {
		text,
		values
	};
	return query;
}

function objectImport (idPackage) {

	let text =  `
		INSERT INTO import_table (
			name,
			type,
			asset_control_number
		)
		VALUES ${idPackage.map((item) => {
			return `(
				'${item.name}',
				'${item.type}',
				'${item.asset_control_number}'
			)`
		})};
	`
	return text	
}


function editImport (formOption) {
	const text =
		`
		Update import_table 
		SET type = $1,
			name = $2,
			mac_address = $3,
			area_id = $5,
			status = $6,
			transferred_location = $7,
			monitor_type = $8
		WHERE asset_control_number = $4
		`;
		
	const values = [
		formOption.type, 
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
		formOption.status,
		formOption.transferred_location,
		formOption.monitor_type
	];

	const query = {
		text,
		values
	};

	return query;
}

function setLocaleID (userID,lang) {

	let text = 
		`
		UPDATE user_table 
		SET locale_id = (
			SELECT id 
			FROM locales
			WHERE name = $1
		)
		WHERE id = $2
		`
	const values = [
		lang,
		userID,
	];

	const query = {
		text,
		values
	};

	return query;
}

function editObject (formOption) {
	 
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
			mac_address = $7
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
	];

	const query = {
		text,
		values
	};

	return query;
}

const editPatient = (formOption) => {
	const text = `
		Update object_table 
		SET name = $2,
			mac_address = $3,
			area_id = $4,
			object_type = 1
		WHERE asset_control_number = $1
	`;
		
	const values = [
		formOption.asset_control_number,
		formOption.name,
		formOption.mac_address,
		formOption.area_id,
	];

	const query = {
		text,
		values
	};

	return query;
}

 
const addObject = (formOption) => {
	const text = `
		INSERT INTO object_table (
			type, 
			asset_control_number, 
			name,
			mac_address,
			status,
			area_id,
			object_type,
			registered_timestamp,
			monitor_type
		)
		VALUES (
			$1, 
			$2, 
			$3,
			$4,
			$5,
			$6,
			0,
			now(),
			$7
		);
	`;
		
	const values = [
		formOption.type, 
		formOption.asset_control_number, 
		formOption.name, 
		formOption.mac_address,
		formOption.status,
		formOption.area_id,
		formOption.monitor_type
	];


	const query = {
		text,
		values
	};

	return query;
}

const addPatient = (formOption) => {
	const text = 
		`
		INSERT INTO object_table (
			name,
			mac_address, 
			asset_control_number,
			area_id,
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
			1,
			'register',
			'normal',
			now()
		)
		`;
	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
	];

	const query = {
		text,
		values
	};

	return query;
}

const addImport = (formOption) => {
	const text = `
		INSERT INTO import_table (
			type, 
			asset_control_number, 
			name
		)
		VALUES (
			$1, 
			$2, 
			$3
		);
	`;
	const values = [
		formOption.type, 

		formOption.asset_control_number, 
		formOption.name, 
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
			transferred_location = '${item.transferred_location}',
			note_id = ${record_id},
			reserved_timestamp = ${item.status == 'reserve' ? `'${reservedTimestamp}'` : null},
			reserved_user_id = (SELECT id
				FROM user_table
				WHERE user_table.name='${username}')
								
		WHERE asset_control_number IN (${formOption.map(item => `'${item.asset_control_number}'`)});
	`
	return text
}

function signin(username) {

	const text =
		`
		WITH 
		user_info
			AS
				(
					SELECT name, password, mydevice, id, main_area, max_search_history_count, locale_id
					FROM user_table
					WHERE name =$1
				)
		,
		roles
			AS
				(
					SELECT 
						user_role.user_id, 
						user_role.role_id, 
						roles.name as role_name 
					FROM user_role
					INNER JOIN roles
					ON roles.id = user_role.role_id
					WHERE user_role.user_id = (SELECT id FROM user_info)
				),
		permissions
			AS
				(
					SELECT roles_permission.role_id, roles_permission.permission_id, permission_table.name as permission_name 
					FROM roles_permission
					INNER JOIN permission_table
					ON roles_permission.permission_id = permission_table.id
					WHERE roles_permission.role_id in (SELECT role_id FROM roles)
				),
		areas
			AS
				(
					SELECT area_id
					FROM user_area
					WHERE user_area.user_id = (SELECT id FROM user_info)
				),
		search_histories
			AS
				(
					SELECT keyword as name, COUNT(id) as value
					FROM search_history where user_id = (SELECT id FROM user_info)
					GROUP BY keyword
				)
		SELECT 
			user_info.name, 
			user_info.password,
			user_info.mydevice, 
			user_info.locale_id,
			array (
				SELECT row_to_json(search_histories) 
				FROM search_histories
			) AS search_history,
			user_info.id,
			user_info.id,
			user_info.locale_id,
			user_info.main_area,
			user_info.max_search_history_count as freq_search_count,
			array (
				SELECT role_name 
				FROM roles
			) AS roles,
			array ( 
				SELECT DISTINCT permission_name 
				FROM permissions 
			) AS permissions, 
			array (
				SELECT area_id::int 
				FROM areas
			) AS areas_id,
			(
				SELECT locales.name 
				FROM locales
				WHERE user_info.locale_id = locales.id
			) AS locale
		FROM user_info
        `;

    const values = [username];

    const query = {
        text,
        values
    };

    return query;

}


const editPassword = (user_id,password) => {
	const text =
		`
		UPDATE user_table
		SET 
			password = $2
		WHERE id = $1
	`;

	const values = [
		user_id,
		password
	];

	const query = {
		text,
		values
	};

	return query
}


function getUserInfo(username) {

	const text =  `
		SELECT 
			name, 
			mydevice, 
			max_search_history_count as freqSearchCount 
		FROM user_table 
		WHERE name= $1
	`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query
}

const addUserSearchHistory = (username, keyType, keyWord) => {

	const text = `
		INSERT INTO search_history(search_time, keyWord, key_type, user_id)
		VALUES(
			now(),
			$1,
			$2,
			(
				SELECT id 
				FROM user_table 
				WHERE name = $3
			)
		) 
			
	`;

	const values = [
		keyWord, 
		keyType, 
		username
	];

	const query = {
		text, 
		values
	};

	return query
}

function modifyUserDevices(username, mode, acn){
	var text = ""
	if(mode === 'add'){
		text = `
			UPDATE user_table 
			SET mydevice = array_append(mydevice, '${acn}') 
			WHERE name = '${username}';
		`
	}else if(mode === 'remove'){
		text = `
			UPDATE user_table 
			SET mydevice = array_remove(mydevice, '${acn}') 
			WHERE name = '${username}';
		`	
	}else{
		text = ""
	}

	return text
	
}
const modifyUserInfo = (username, info) => {	
	const {
		freqSearchCount
	} = info

	return `
		UPDATE user_table 
		SET max_search_history_count = ${freqSearchCount} 
		WHERE name='${username}'
	`
	
}

function getShiftChangeRecord(){
	const query = `
		SELECT 
			shift_change_record.id,
			shift_change_record.file_path,
			shift_change_record.submit_timestamp,
			shift_change_record.shift,
			user_table.name as user_name
		FROM shift_change_record
		
		LEFT JOIN user_table
		ON user_table.id = shift_change_record.user_id

		ORDER BY shift_change_record.submit_timestamp DESC;

	`
	return query
}



const validateUsername = (username) => {
	const text = `
		SELECT 
			name
		FROM
			user_table
		WHERE name=$1
	`

	const values = [
		username
	]

	const query = {
		text, 
		values
	}
	return query
}

const getUserList = () => {
	const query = `
		SELECT

			user_table.id,
			user_table.name, 
			user_table.registered_timestamp,
			user_table.last_visit_timestamp,
			JSON_BUILD_OBJECT(
				'id', user_table.main_area,
				'value', area_table.name
			) AS main_area,
			area_table.name as area_name,
			ARRAY_AGG(roles.name) AS role_type,
			COALESCE(areas.area_ids, ARRAY[]::JSONB[]) as area_ids		
			
		FROM user_table  

		INNER JOIN (
			SELECT * 
			FROM user_role
			INNER JOIN roles 
			ON user_role.role_id = roles.id
		) roles
		ON user_table.id = roles.user_id

		LEFT JOIN area_table
		ON area_table.id = user_table.main_area

		LEFT JOIN (
			SELECT
				user_id,
				ARRAY_AGG(JSONB_BUILD_OBJECT(
					'id', area_id::int,
					'value', (
						SELECT 
							name 
						FROM area_table
						WHERE area_table.id = area_id
					)
				)) AS area_ids
			FROM user_area
			GROUP BY 
				user_id
		) AS areas
		ON areas.user_id = user_table.id

		GROUP BY 
			user_table.id, 
			user_table.name,
			user_table.registered_timestamp, 
			user_table.last_visit_timestamp,
			area_table.name,
			areas.area_ids
		ORDER BY user_table.name DESC
	`
	return query
}

const getRoleNameList = () => {
	const query = `
		SELECT 
			name 
		FROM roles;
	`
	return query
}


const setUserSecondaryArea = (user) => {
	return `
		DELETE FROM user_area
		WHERE user_id = ${user.id};

		INSERT INTO user_area (
			area_id,
			user_id
		)
		VALUES
		${user.areas_id.map(id => `(
			${id},
			${user.id}
		)`)};
	`
}


const getEditObjectRecord = () => {
	const query = `
		SELECT
			user_table.name,
			edit_object_record.id,
			edit_object_record.edit_time,
			edit_object_record.notes,
			edit_object_record.new_status,
			edit_object_record.path as file_path
		FROM edit_object_record

		LEFT JOIN user_table
		ON user_table.id = edit_object_record.edit_user_id

		ORDER BY edit_object_record.edit_time DESC

	`
	return query
}

const deleteEditObjectRecord = (idPackage) => {
	const query = `
		DELETE FROM edit_object_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)}) RETURNING *;
	`
	return query
}


const deleteShiftChangeRecord = (idPackage) => {
	const query = `
		DELETE FROM shift_change_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)})
		RETURNING *;
	`
	return query
}



const deletePatient = (idPackage) => {
	const query = `
		DELETE FROM object_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}
 

const deleteDevice = (formOption) => {
	const query = `
		DELETE FROM object_table
		WHERE mac_address IN (${formOption.map(item => `'${item}'`)});
	`
	return query
}

const deleteImportData = (idPackage) => {
	const query = `
		DELETE FROM import_table
		WHERE asset_control_number IN (${idPackage.map(item => `'${item}'`)});

		DELETE FROM object_table
		WHERE asset_control_number IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

const setShift = (shift, username) => {
	const query = `
		update user_table
		set shift='${shift}'
		where name='${username}'
	`
	return query
}

const setVisitTimestamp = (username) => {
	return `
		UPDATE user_table
		SET last_visit_timestamp=now()
		WHERE name='${username}';
	`
}


const addEditObjectRecord = (formOption, username, filePath) => {

	let item = formOption
	const text = `
		INSERT INTO edit_object_record (
			edit_user_id, 
			edit_time, 
			notes, 
			new_status, 
			new_location, 
			edit_objects,
			path
		)
		VALUES (
			(
				SELECT id 
				FROM user_table 
				WHERE name = $1
			),
			now(),
			$2,
			$3,
			'${item.transferred_location}',
			ARRAY ['${formOption.asset_control_number}'],
			$4
		)
		RETURNING id;
	`
	const values = [
		username,
		item.notes,
		item.status,
		filePath
	]

	const query = {
		text, 
		values
	}
	return query

}

const addShiftChangeRecord = (userInfo, file_path,shift) => {
 
	const query = `
		INSERT INTO shift_change_record (
			user_id, 
			shift,
			submit_timestamp, 
			file_path
		)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name='${userInfo.name}'
			), 
			'${shift.value}',
			now(), 
			'${file_path}'
		);
	`
	return query
}

const getAreaTable = () => {
	return `
		SELECT 
			id,
			name
		FROM area_table
		;
	`
}

const getGeofenceConfig = (areaId) => {
	return `
		SELECT
			*
		FROM geo_fence_config
		ORDER BY id
	;`
}


const setGeofenceConfig = (monitorConfigPackage) => {
	let {
		type,
		id,
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id,
		is_global_fence
	} = monitorConfigPackage

	let text = `
		UPDATE geo_fence_config
		SET 
			name = $2,
			area_id = $3,
			start_time = $4,
			end_time = $5,
			enable = $6,
			perimeters = $7,
			fences = $8,
			is_global_fence = $9
		WHERE id = $1;
	`
	let values = [
		id,
		name,
		area_id,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		is_global_fence
	]

	let query = {
		text,
		values
	}

	return query
}

const checkoutViolation = (mac_address, monitor_type) => {
	return `
		UPDATE notification_table
		SET web_processed = 1
		WHERE (
			mac_address = '${mac_address}'
			AND monitor_type = ${monitor_type}
			AND violation_timestamp < NOW()
		) 	
	`
}

const confirmValidation = (username) => {
	let text = `
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role,
			user_role.role_id as role_id,
			array (
				SELECT area_id
				FROM user_area
				WHERE user_area.user_id = user_table.id
			) as areas_id,
			(
				SELECT id
				FROM user_table
				WHERE user_table.name = $1
			) as user_id,
			ARRAY (
				SELECT role_id
				FROM user_role
				WHERE user_role.user_id = (
					SELECT id
					FROM user_table 
					WHERE user_table.name = '${username}'
				)
			) as roles

		FROM user_table

		LEFT JOIN user_role
		ON user_role.user_id = user_table.id

		LEFT JOIN roles
		ON user_role.role_id = roles.id
		
		LEFT JOIN user_area
		ON user_area.user_id = user_table.id
		
		WHERE user_table.name = $1;
	`

	const values = [username];

	const query = {
		text,
		values
	};

	return query;

}

const addMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		start_time,
		end_time,
		enable,
		area_id
	} = monitorConfigPackage

	let text = `
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

	let values = [
		start_time,
		end_time,
		enable,
		area_id,
	]

	return {
		text, 
		values
	}
}

const getMonitorConfig = (type) => {
	let text =  `
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

const setMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		id,
		start_time,
		end_time,
		enable,
		area_id,
	} = monitorConfigPackage

	 
	let text = `
		UPDATE ${monitorConfigPackage.type}
		SET 
			area_id = $5,
			start_time = $2,
			end_time = $3,
			enable = $4
		
		WHERE id = $1;
	`
	let values = [ 
		id,
		start_time,
		end_time,
		enable,
		area_id,
	]

	let query = {
		text,
		values
	}

	return query
}

const addGeofenceConfig = (monitorConfigPackage) => { 
	let {
		type,
		id,
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id,
		is_global_fence
	} = monitorConfigPackage

	let text = `
		INSERT INTO ${type}
			(
				name,
				start_time,
				end_time,
				enable,
				perimeters,
				fences,
				area_id,
				is_global_fence
			)
		VALUES 
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8
			)
	`

	let values = [
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id,
		is_global_fence
	]

	return {
		text, 
		values
	}
}

const deleteMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		id
	} = monitorConfigPackage  
	return `
		DELETE FROM ${type} 
		WHERE id IN (${id.map(id => `'${id}'`)})
	`
}

function backendSearch(keyType, keyWord){
	var query 	= null
	var text 	= null
	var values 	= null
	switch(keyType){
		case 'location' :
			text = `SELECT mac_address FROM object_summary_table WHERE uuid = $1`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
////////////////////////////////////////////////////////
		case 'name' :
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower(name)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
////////////////////////////////////////////////////////
		case 'type' :
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT 
							mac_address 
						FROM 
							object_table 
						WHERE 
							POSITION( lower($1) IN lower(type)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
		case 'all devices':
			text = `SELECT mac_address FROM object_summary_table WHERE true`
			values = []
			query = {
				text,
				values
			}
			break
////////////////////////////////////////////////////////
		case 'acn last 4':
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower( right(access_control_number, 4) )) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break
////////////////////////////////////////////////////////
		case 'all attributes':
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower( right(asset_control_number, 4) )) > 0
					
					UNION
					
						SELECT 
							mac_address 
						FROM 
							object_table 
						WHERE 
							POSITION( lower($1) IN lower(type)) > 0
					
					UNION
					
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower(name)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break
	}
	return query
}
function deleteSameNameSearchQueue(keyType, keyWord){

	var text = `DELETE FROM search_result_queue where (key_type = '${keyType}' AND key_word = '${keyWord}') 
	OR 
		id NOT IN (SELECT id FROM search_result_queue ORDER BY query_time desc LIMIT 5) RETURNING *;`
	return text
}
function backendSearch_writeQueue(keyType, keyWord, mac_addresses, pin_color_index){
	var text = 
		`
			INSERT INTO 
				search_result_queue(query_time, key_type, key_word, result_mac_address, pin_color_index) VALUES
				(now(), $1, $2, ARRAY['${mac_addresses.join('\',\'')}'], $3);
		`
	values =  [keyType, keyWord, pin_color_index]
	query = {
		text,
		values
	}
	
	return query
}

function getSearchQueue(){
	var query = 
		`
			SELECT 
				*
			FROM
				search_result_queue
			ORDER BY
				query_time DESC
			LIMIT 5
		`
	
	return query
}

const setSearchRssi = (rssi) => {
	let text = `
		UPDATE search_criteria
		SET search_rssi = $1
	`
	let values = [
		rssi
	]
	let query = {
		text,
		values
	}
	return query
}

function clearSearchHistory(){
	const query = `
		DELETE FROM search_history 
		WHERE now() > search_time + interval '${process.env.SEARCH_HISTORY_VALIDATE_DURATION}'
	`
	return query
}

function getTransferredLocation() {
	const query = `SELECT id, branch_name, department FROM branch_and_department ORDER BY id`
	return query
}

function modifyTransferredLocation(type, data){
	const defaultNewDepartment = 'new department'
	var query;
	if(type == 'add branch'){
        query = `insert into branch_and_department(branch_name, department) values('${data.name}', '{"${defaultNewDepartment}"}')`
    }else if(type == 'rename branch'){
        query = `update branch_and_department set branch_name = '${data.name}' where id = ${data.branch_id} `
    }else if(type == 'remove branch'){
        query = `delete from branch_and_department where id = ${data.branch_id} `
    }else if(type == 'add department'){
        query = `update branch_and_department set department = array_append(department, '${data.name}') where id = ${data.branch_id}`
    }else if(type == 'rename department'){
        query = `update branch_and_department set department[${data.departmentIndex + 1}] = '${data.name}' where id = ${data.branch_id}`
    }else if(type == 'remove department'){
        query = `update branch_and_department set department = array_remove(department, department[${data.departmentIndex + 1}]) where id = ${data.branch_id}`
    }else{
        console.log('modifyTransferredLocation: unrecognized command type')
    }

	return query
}

const setMonitorEnable = (enable, areaId, type) => {
	return `
		UPDATE ${type}
		SET enable = ${enable} 
		WHERE area_id = ${areaId}
	`
} 

function getRolesPermission(){
	// const query = `SELECT array(SELECT json_build_object('id',roles.id,'name',roles.name) as role, array_agg(json_build_object('id',permission_table.id,'name',permission_table.name)) as permissions FROM permission_table
	// 					INNER JOIN roles_permission ON roles_permission.permission_id = permission_table.id
	// 					INNER JOIN roles ON roles.id = roles_permission.role_id
	// 					GROUP BY roles.name, roles.id)`
	const query = `SELECT
					(ARRAY(SELECT json_build_object('id',id,'name',name) FROM permission_table ORDER BY id)) as permission_list,
					(ARRAY(SELECT json_build_object('id',id,'name',name) FROM roles ORDER BY id)) as roles_list,
					(ARRAY(

						SELECT json_build_object('role', json_build_object('id',roles.id,'name',roles.name), 'permissions', array_agg(json_build_object('id',permission_table.id,'name',permission_table.name))) FROM permission_table
						INNER JOIN roles_permission ON roles_permission.permission_id = permission_table.id
						INNER JOIN roles ON roles.id = roles_permission.role_id
						GROUP BY roles.name, roles.id

					)) as roles_permission
					
	`
	
	return query
}
function modifyPermission(type, data){
	if(type == 'add permission'){
        const query = `INSERT INTO permission_table(type, name) VALUES ('${data.permissionType}', '${data.permissionType}:${data.name}')`
        return query
    }else if(type == 'rename permission'){
        const query = `UPDATE permission_table SET name = '${data.permissionType}:${data.name}' WHERE id=${data.id}`
        return query
    }else if(type == 'remove permission'){
        const query = `DELETE FROM permission_table WHERE id=${data.id}`
        return query
    }else{
        console.log('modifyPermission: unrecognized command type')
    }
}

function modifyRolesPermission(type, data){
	// type: 'remove permission', 'add permission'
	// data.roleId, data.PermissionId
	if(type == 'add permission'){
        const query = `INSERT INTO roles_permission(role_id, permission_id) VALUES ('${data.roleId}', '${data.permissionId}')`
        return query
    }else if(type == 'remove permission'){
        const query = `DELETE FROM roles_permission WHERE role_id=${data.roleId} AND permission_id=${data.permissionId}`
        return query
    }else{
        console.log('modifyRolesPermission: unrecognized command type')
    }
}

const addPatientRecord = objectPackage => {
	let text = `
		INSERT INTO patient_record (
			object_id,
			editing_user_id, 
			record,
			created_timestamp
		) 
		VALUES (
			$1,
			$2,
			$3,
			NOW()
		)
		
	`
	let values = [
		objectPackage.id,
		objectPackage.userId,
		objectPackage.record
	]	

	let query = {
		text,
		values
	}
	
	return query
	
}

module.exports = {
	getTrackingData,
	getTrackingTableByMacAddress,
	getImportTable,
	getMonitorConfig,
	setGeofenceConfig,
	editPatient,
	editObject,
	editImport,
	objectImport,
	addObject,
	addPatient,
	editObjectPackage,
	signin,
	editPassword,
	getUserInfo,
	addUserSearchHistory,
	modifyUserDevices,
	modifyUserInfo,
	getShiftChangeRecord,
	validateUsername,
	getUserList,
	getRoleNameList,
	getEditObjectRecord,
	deleteEditObjectRecord,
	deleteShiftChangeRecord,
	deletePatient,
	deleteDevice, 
	deleteImportData,
	setShift,
	setVisitTimestamp,
	addEditObjectRecord,
	addShiftChangeRecord,
	getAreaTable,
	getGeofenceConfig,
	setMonitorConfig,
	checkoutViolation,
	confirmValidation,
	backendSearch,
	backendSearch_writeQueue,
	deleteSameNameSearchQueue,
	getSearchQueue,
	addAssociation,
	addAssociation_Patient,
	cleanBinding,
	getImportData,
	setLocaleID,
	addImport,
	getImportPatient,
	addGeofenceConfig,
	deleteMonitorConfig,
	addMonitorConfig,
	getTransferredLocation,
	modifyTransferredLocation,
	getLocationHistory,
	getRolesPermission,
	modifyPermission,
	modifyRolesPermission,
	setMonitorEnable,
	clearSearchHistory,
	setUserSecondaryArea,
	addPatientRecord
}



