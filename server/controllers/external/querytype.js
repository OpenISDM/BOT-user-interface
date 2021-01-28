//#region common code
function setKey(user_id, username, hash) {
	return ` 
	insert into api_key 
	(id, name, key, register_time) values 
	(${user_id}, '${username}', '${hash}', now())
	on 
	   	conflict(id)
   	do
	   update 
	set
		name = '${username}',
		key = '${hash}',
		register_time = now()
	`
}

function getUserQuery(username, password) {
	return `
	select  
		id, "name", "password"
	from
		user_table
	where
		user_table."name" = '${username}'
		and user_table."password" = '${password}'
	`
}

function getKeyQuery(key){
	return `
	select 
		key,  
		(case 
			when register_time + interval '30 min' > now() then 'ACTIVE'
			else 'UNACTIVE'
			end) as status
	from 
		api_key
	where
		key = '${key}'
	order by 
		register_time 	desc
	`
}
//#endregion

//#region  api v1.0
const get_data = (
	key,
	start_time,
	end_time,
	tag,
	Lbeacon,
	count_limit,
	sort_type
) => {
	let text = `
    WITH ranges AS (
        SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi,
            CASE WHEN LAG(uuid) OVER
                    (PARTITION BY mac_address
                        ORDER BY mac_address, record_timestamp) = uuid
                    THEN NULL ELSE 1 END r
        FROM
        (
            SELECT
                location_history_table.mac_address AS mac_address,
                location_history_table.area_id AS area_id,
                location_history_table.uuid AS uuid,
                location_history_table.record_timestamp AS record_timestamp,
                location_history_table.battery_voltage AS battery_voltage,
                location_history_table.average_rssi AS average_rssi
            FROM location_history_table
            INNER JOIN object_table
            ON location_history_table.mac_address = object_table.mac_address
                AND object_table.object_type != 0
            INNER JOIN user_area
            ON object_table.area_id = user_area.area_id
            INNER JOIN user_table
            ON user_table.id = user_area.user_id
            INNER JOIN api_key
            ON api_key.name = user_table.name
            AND api_key.key = $3
            WHERE
                record_timestamp > $1
                AND record_timestamp < $2`
	if (tag) {
		text += `  AND location_history_table.mac_address IN  (${tag.map(
			(item) => `'${item}'`
		)})`
	}
	if (Lbeacon) {
		text += `  AND location_history_table.uuid IN  (${Lbeacon.map(
			(item) => `'${item}'`
		)})`
	}
	text += `) AS raw_data
    )
    , groups AS (
        SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi, r,
            SUM(r)
                OVER (ORDER BY mac_address, record_timestamp) grp
        FROM ranges
    )
    SELECT
        MIN(groups.mac_address::TEXT) AS mac_address,
        MIN(object_table.name) AS name,
        MIN(groups.area_id) AS area_id,
        MIN(area_table.readable_name) AS area_name,
        MIN(groups.uuid::TEXT) AS uuid,
        MIN(Lbeacon_table.description) AS beacon_description,
        MIN(groups.battery_voltage) AS battery_voltage,
        AVG(groups.average_rssi) AS avg_rssi,
        MIN(groups.record_timestamp) AS start_time,
        MAX(groups.record_timestamp) AS end_time,
        MAX(groups.record_timestamp) - MIN(groups.record_timestamp)  AS duration
    FROM groups
    INNER JOIN object_table
    ON object_table.mac_address = groups.mac_address
    INNER JOIN area_table
    ON area_table.id = groups.area_id
    INNER JOIN Lbeacon_table
    ON Lbeacon_table.uuid = groups.uuid
	GROUP BY grp, groups.mac_address
	ORDER by mac_address ASC, start_time ${sort_type}
	LIMIT ${count_limit}
    `
	const values = [start_time, end_time, key]
	const query = {
		text,
		values,
	}

	return query
}
//#endregion

//#region api v1.1
const getPeopleHistoryQuery = (
	filter,
	start_time,
	end_time,
	count_limit,
	sort_type
) => {
	return `select
	location_history_table.object_id as object_id,
	object_table.name as name,
	location_history_table.mac_address as mac_address,
	object_table.type as object_type,
	location_history_table.area_id as area_id,
	area_table.readable_name as area_name,
	location_history_table.uuid as lbeacon_uuid,
	lbeacon_table.description as lbeacon_description,
	location_history_table.payload as payload,
	location_history_table.record_timestamp as record_timestamp
	from location_history_table

	inner join object_table
	on object_table.asset_control_number = location_history_table.object_id 
	and object_table.object_type = '1'
	
	left join lbeacon_table
	on lbeacon_table.uuid = location_history_table.uuid 
	
	left join area_table
	on area_table.id = location_history_table.area_id 

	where record_timestamp > '${start_time}' 
		  and record_timestamp < '${end_time}'
		  ${filter}

	order by record_timestamp ${sort_type}
	limit ${count_limit};`
}

const getPeopleRealtimeQuery = (filter) => {
	return `
	select
		object_table.asset_control_number as object_id,
		object_table.name as object_name,
		object_summary_table.mac_address as mac_address,
		object_table.type as object_type,
		object_summary_table.updated_by_area as area_id,
		area_table.readable_name as area_name,
		object_summary_table.uuid as lbeacon_uuid,
		lbeacon_table.description as lbeacon_description, 
		object_summary_table.base_x as position_x,
		object_summary_table.base_y as position_y,
		object_summary_table.battery_voltage as battery_voltage,
		object_summary_table.payload as payload,
		object_summary_table.last_reported_timestamp as last_reported_timestamp
	from 
		object_summary_table

	inner join object_table
	on object_table.mac_address = object_summary_table.mac_address 

	left join lbeacon_table
	on object_summary_table.uuid = lbeacon_table.uuid

	left join area_table
	on area_table.id = object_summary_table.updated_by_area
	where 
		object_table.object_type = '1'
		${filter}
	`
}

const getAreaIDQuery = (key) => {
	return `
	select
		area_table.id as area_id,
		area_table.readable_name  as area_name
	from
		area_table
	
	inner join 	user_area 
	on area_table.id = user_area.area_id 

	inner join user_table 
	on user_table.id = user_area.user_id 

	inner join api_key
	on api_key.id = user_table.id
		
	where
		api_key."key" = '${key}'
	group by 
		area_table.id, area_table.readable_name 
	`
}

const getObjectTypeQuery = (type) => {
	return `
	select
		distinct object_table.type as object_type
	from
		object_table
	where
		object_table.object_type = '${type}'
	`
}

const getObjectRealtimeQuery = (filter) => {
	return `
	select distinct on (object_id)
		object_table.asset_control_number as object_id,
		object_table.name as object_name,
		object_table.mac_address as mac_address,
		object_table.type  as object_type,
		object_summary_table.updated_by_area as area_id,
		area_table.readable_name as area_name,
		object_summary_table.uuid as lbeacon_uuid,
		lbeacon_table.description as lbeacon_description,
		object_summary_table.base_x as position_x,
		object_summary_table.base_y as position_y,
		object_summary_table.battery_voltage as battery_voltage,
		object_summary_table.last_reported_timestamp as last_reported_timestamp
	from
		object_summary_table 

	inner join object_table on
		object_table.mac_address = object_summary_table.mac_address

	left join lbeacon_table on
		object_summary_table.uuid = lbeacon_table.uuid

	left join area_table on
		object_summary_table.updated_by_area = area_table.id

	where
		object_table.object_type = '0'
		${filter}
	`
}

const getObjectIDFilter = (object_ids) => {
	if (object_ids && object_ids.length > 0) {
		return `\nand object_table.asset_control_number in (${object_ids.map(
			(item) => `'${item}'`
		)})`
	}
	return ''
}

const getObjectTypeFilter = (object_types) => {
	if (object_types && object_types.length > 0) {
		return `\nand object_table.type in (${object_types.map(
			(item) => `'${item}'`
		)})`
	}
	return ''
}


const getAreaIDFilter = (user_area, area_ids) => {
	if (area_ids && area_ids.length > 0) {
		return `\n and object_table.area_id in (${area_ids.map((item) => `'${item}'`)})`
	}
	return `\nand object_table.area_id in (${user_area.map(
		(item) => `'${item}'`
	)})`
}

const getObjectHistoryQuery = (
	filter,
	start_time,
	end_time,
	count_limit,
	sort_type
) => {
	return `
	select
		object_table.asset_control_number as object_id,
		object_table."name" as object_name,
		object_table.mac_address as mac_address,
		object_table.type as object_type,
		location_history_table.area_id as area_id,
		area_table.readable_name as area_name,
		location_history_table.uuid as lbeacon_uuid,
		lbeacon_table.description as lbeacon_description,
		location_history_table.record_timestamp as record_timestamp
	from
		location_history_table

	inner join object_table on
		object_table.asset_control_number = location_history_table.object_id
		and object_table.object_type = '0'

	left join lbeacon_table on
		location_history_table.uuid = lbeacon_table.uuid

	left join area_table on
		location_history_table.area_id = area_table.id
	where
		location_history_table.record_timestamp > '${start_time}'
		and	location_history_table.record_timestamp < '${end_time}'
		${filter}

	order by
		location_history_table.record_timestamp ${sort_type}
	limit ${count_limit};`
}

const getIDTableQuery = (area_ids) => {
	return `
	select
		object_table.asset_control_number as id,
		object_table.mac_address as mac_address,
		object_table.type as object_type,
		object_table.name as name,
		object_table.area_id as area_id
	from
		object_table
	where
		object_table.area_id in (${area_ids.map((item) => `'${item}'`)})	
	`
}

const getUserAreaQuery = (key, filter = '') => {
	return `
	select 
		area_id
	from 
		user_area

	inner join user_table
	on user_table.id = user_area.user_id 

	inner join api_key
	on api_key.id  = user_table.id 

	where api_key.key= '${key}'
	${filter} 
	group by area_id
	`
}
const getAreaCheckFilter = (area_ids) =>{
	return `\n and area_id in (${area_ids.map((item=> `'${item}'`))})`
}
//#endregion
export default {
	//#region common export
	setKey,
	getKeyQuery,
	getUserQuery,
	getUserAreaQuery,
	//#endregion

	//#region api v1.0
	get_data,
	//#endregion

	//#region api v1.1
	getPeopleRealtimeQuery,
	getPeopleHistoryQuery,
	getObjectHistoryQuery,
	getObjectRealtimeQuery,
	getIDTableQuery,
	getObjectIDFilter,
	getObjectTypeFilter,
	getObjectTypeQuery,
	getAreaIDQuery,
	getAreaIDFilter,
	getAreaCheckFilter
	//#endregion
}
