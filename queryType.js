var moment = require('moment')


function query_getTrackingData (accuracyValue = 1) {
        const query = `
                SELECT
                        object_table.mac_address,
                        object_summary_table.uuid as lbeacon_uuid,
                        object_summary_table.rssi,
                        object_summary_table.first_seen_timestamp,
                        object_summary_table.last_seen_timestamp,
                        object_summary_table.geofence_type,
                        object_summary_table.geofence_violation_timestamp,
                        object_summary_table.panic_timestamp,
                        object_table.name,
                        object_table.type,
                        object_table.status,
                        object_table.transferred_location,
                        object_table.access_control_number,
                        split_part(object_table.access_control_number, '-', 3) as 
last_four_acn,
                        lbeacon_table.description as location_description

                FROM object_summary_table

                LEFT JOIN object_table
                ON object_table.mac_address = object_summary_table.mac_address

                LEFT JOIN lbeacon_table
                ON lbeacon_table.uuid = object_summary_table.uuid

                ORDER BY object_table.type ASC, last_four_acn ASC;
        `
        return query;
}



const query_getObjectTable = 
	`
    SELECT id, name, type, access_control_number, status, transferred_location, mac_address
	FROM object_table ORDER BY id ASC
	`;

const query_getLbeaconTable = 
    `
	SELECT uuid, low_rssi, med_rssi, high_rssi, description, ip_address, health_status, gateway_ip_address, last_report_timestamp 
	FROM lbeacon_table 
	ORDER BY last_report_timestamp DESC
	`;

const query_getGatewayTable = 
    `
    select ip_address, health_status, last_report_timestamp from gateway_table ORDER BY last_report_timestamp DESC`;
    // `
	// select * from gateway_table ORDER BY last_report_timestamp DESC`;

const query_getGeofenceData = 
	// `
	// SELECT * FROM geo_fence_alert 
	// WHERE receive_time > current_timestamp - INTERVAL '7 days'
	// order by receive_time DESC 
	// `;
	`
	SELECT * FROM object_table
	`;
	

function query_editObject (formOption) {
	const text = 
		`
		Update object_table 
		SET type = $2,
			status = $3,
			transferred_location = $4,
			access_control_number = $5,
			name = $6
		WHERE mac_address = $1
		`;
		
	const values = [formOption.mac_address, formOption.type, formOption.status, formOption.transferredLocation.value, formOption.access_control_number, formOption.name];

	const query = {
		text,
		values
	};

	return query;
}

function query_addObject (formOption) {
	const text = 
		`
		INSERT INTO object_table  (type, status, transferred_location, access_control_number, name, mac_address, registered_timestamp)
		VALUES($1, $2, $3, $4, $5, $6, $7)
		`;
		
	const values = [formOption.type, formOption.status, formOption.transferredLocation?formOption.transferredLocation.value:null, formOption.access_control_number, formOption.name, formOption.mac_address, moment()];

	const query = {
		text,
		values
	};

	return query;
}

function query_editObjectPackage (data) {

	var mac_string = data.macAddresses.join('\',\'')
	var query = `Update object_table 
			SET status = '${data.newStatus}',
			transferred_location = '${data.newLocation}' WHERE mac_address in ('${mac_string}')`

	return query
}

function query_signin(username) {

	const text =
		`
		SELECT password
		FROM user_table
		WHERE name= $1
		`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query;
	
}
function query_setShift(shift, username){
	const query = `update user_table
					set shift='${shift}'
					where name='${username}'
					`
	return query
}

function query_signup(signupPackage) {

	const text = 
		`
		INSERT INTO user_table (name, password)
		VALUES ($1, $2);
		INSERT INTO user_roles(user_id, role_id) 
		VALUES((select id from user_table where name=$1), 1);
		`;
	const values = [signupPackage.username, signupPackage.password];

	const query = {
		text,
		values
	};

	return query
}

function query_modifyUserDevices(username, mode, acn){
	console.log(acn)
	var text = ""
	if(mode === 'add'){
		text = `UPDATE user_table SET mydevice = array_append(mydevice, '${acn}') WHERE name = '${username}';`
	}else if(mode === 'remove'){
		text = `UPDATE user_table SET mydevice = array_remove(mydevice, '${acn}') WHERE name = '${username}';`
	}else{
		text = ""
	}

	return text
	
}

function query_getUserInfo(username) {
	const text =  `
		SELECT name, mydevice from user_table where name= $1
	`;

	const values = [username];
	// console.log(username)
	const query = {
		text,
		values
	};

	return query
}

function query_getUserSearchHistory (username) {
	const text = `
		SELECT search_history from user_table where name=$1
	`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query
}

function query_addUserSearchHistory (username, history) {
	const text = `
		UPDATE user_table
		SET search_history = $1
		WHERE name = $2
	`;

	const values = [history, username];

	const query = {
		text, 
		values
	};

	return query
}

function query_editLbeacon (uuid, low, med, high) {
	const text =
		`
		UPDATE lbeacon_table
		SET low_rssi = $1,
			med_rssi = $2,
			high_rssi = $3
		WHERE uuid = $4
	`;

	const values = [low, med, high, uuid]

	const query = {
		text, 
		values
	};

	return query
}

function query_addShiftChangeRecord(submit_timestamp, user_id, file_path){
	const query = `INSERT INTO shift_change_record(submit_timestamp, user_id, file_path)
					VALUES (to_timestamp('${submit_timestamp}', 'YYYY-MM-DDTHH:MI:SSTZH:TZM'), ${user_id}, '${file_path}');`
	return query
}

function query_getShiftChangeRecord(){
	const query = `SELECT * FROM shift_change_record`
	return query
}

function query_setUserRole(role, username){
	const query = `update user_roles
					set role_id=(select id from roles where name='${role}')
					where user_roles.user_id = (select id from user_table where name='${username}');
	`
	return query
}
function query_getUserRole(username){
	const query = `select name      from roles      where 
	    id=(       select role_id   from user_roles where 
	    user_id=(  select id        from user_table where name='${username}'));`
	return query
}

function query_getRoleNameList(){
	const query = `select name from roles;`
	return query
}
function query_getUserList(){
	const query = `select * from user_table`
	return query
}
function query_removeUser(username){
	const query = `delete from user_roles where user_id=(select id from user_table where name='${username}'); delete from user_table where name = '${username}';`
	return query
}
module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getGeofenceData,
	query_editObject,
	query_addObject,
	query_editObjectPackage,
	query_signin,
	query_setShift,
	query_signup,
	query_modifyUserDevices,
	query_getUserInfo,
	query_getUserSearchHistory,
	query_addUserSearchHistory,
	query_editLbeacon,
	query_addShiftChangeRecord,
	query_getShiftChangeRecord,
	query_setUserRole,
	query_getUserRole,
	query_getRoleNameList,
	query_getUserList,
	query_removeUser
}