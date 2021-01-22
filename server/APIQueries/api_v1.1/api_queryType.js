const confirmValidation = (username) => {
	const text = `
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
					WHERE user_table.name = $1
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

	const values = [username]

	const query = {
		text,
		values,
	}

	return query
}

function setKey(user_id, username, hash) {
	return ` insert into api_key (id, name, key, register_time)
   values (${user_id}, '${username}', '${hash}', now())
   on conflict(id)
   do
   update set
	name = '${username}',
	key = '${hash}',
	register_time = now()
	`
}

const getAllKeyQuery = ' SELECT  * FROM api_key '
const getAllUserQuery = ' SELECT  * FROM user_table	'

const getPeopleHistoryQuery = (
	key,
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
	from api_key
	
	inner join user_table
	on user_table.id = api_key.id
	
	inner join object_table
	on object_table.area_id = user_table.main_area
	and object_table.object_type = '1'
	${filter}

	inner join location_history_table
	on location_history_table.object_id = object_table.id

	left join lbeacon_table
	on lbeacon_table.uuid = location_history_table.uuid
	
	left join area_table
	on area_table.id = location_history_table.area_id
	
	where api_key.key = '${key}' and 
		  record_timestamp > '${start_time}' and
		  record_timestamp < '${end_time}'
		  

	order by record_timestamp ${sort_type}
	limit ${count_limit};`
}

const getPeopleRealtimeQuery = (key, filter) => {
	return `select 
	object_table.id as object_id, 
	object_table.name as object_name, 
	object_summary_table.mac_address as mac_address, 
	object_table.type as object_type,
	object_summary_table.updated_by_area as area_id, 
	area_table.readable_name as area_name,
	object_summary_table.uuid as lbeacon_uuid,
	lbeacon_table.description as lbeacon_description, 
	object_summary_table.payload as payload,
	object_summary_table.last_reported_timestamp as last_reported_timestamp
	from api_key
	
	inner join user_table
	on user_table.id = api_key.id
	
	inner join object_table
	on object_table.area_id = user_table.main_area
	and object_table.object_type = '1'
	
	inner join object_summary_table
	on object_summary_table.mac_address = object_table.mac_address
	${filter}

	left join lbeacon_table
	on object_summary_table.uuid = lbeacon_table.uuid
	
	left join area_table
	on area_table.id = object_summary_table.updated_by_area
	where api_key.key = '${key}';
	`
}

const getAreaIDQuery = () => {
	return `
	select 
		area_table.id as area_id,
		area_table.readable_name  as area_name
	from 
		area_table 
	where
		not (area_table.id = '9999')  
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

const getObjectRealtimeQuery = (key, filter) => {
	return `
	select 
		object_table.id as object_id,
		object_table.name as object_name,
		object_table.mac_address as mac_address,
		object_table.type  as object_type,
		object_summary_table.updated_by_area as area_id,
		area_table.readable_name as area_name,
		object_summary_table.uuid as lbeacon_uuid,
		lbeacon_table.description as lbeacon_description,
		object_summary_table.last_reported_timestamp as last_reported_timestamp
	from 
		object_table

	inner join object_summary_table on 
		object_table.mac_address = object_summary_table.mac_address
		and object_summary_table.last_reported_timestamp + interval '5' minute > now()

	inner join user_table on 
		user_table.main_area = object_table.area_id 

	inner join api_key on
		user_table.id = api_key.id
		and api_key.key = '${key}'

	left join lbeacon_table on
		object_summary_table.uuid = lbeacon_table.uuid 

	left join area_table on
		object_summary_table.updated_by_area = area_table.id 

	where
		object_table.object_type = '0'
		${filter}
	`
}

const getObjectIDFilter = (object_id) => {
	if (object_id) {
		return `\nand object_table.id in (${object_id.map((item) => `'${item}'`)})`
	}
	return ''
}


const getObjectTypeFilter = (object_type) => {
	if (object_type) {
		return `\nand object_table.type in (${object_type.map(
			(item) => `'${item}'`
		)})`
	}
	return ''
}

const getAreaIDFilter=(area_id)=>{
	if(area_id){
		return `\n and object_table.area_id in (${area_id.map((item=>`'${item}'`))})`
	}
}

const getObjectHistoryQuery = (
	key,
	filter,
	start_time,
	end_time,
	count_limit,
	sort_type
) => {
	return `
	select 
		object_table.id as object_id,
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
		object_table.id = location_history_table.object_id
		${filter}

	inner join user_table on
		user_table.main_area = object_table.area_id
	
	inner join api_key on
		user_table.id = api_key.id
		and api_key.key = '${key}'

	left join lbeacon_table on
		location_history_table.uuid = lbeacon_table.uuid 

	left join area_table on 
		location_history_table.area_id = area_table.id 
	where 
		location_history_table.record_timestamp > '${start_time}'
		and	location_history_table.record_timestamp < '${end_time}'
	order by 
		location_history_table.record_timestamp ${sort_type}
	limit ${count_limit};`
}

const getIDTableQuery = (key, filter) => {
	return `
	select
		object_table.id as id,
		object_table.mac_address as mac_address,
		object_table.type as object_type,
		object_table.name as name,
		object_table.area_id as area_id
	from 
		api_key
	inner join user_table on
		api_key.id = user_table.id
	inner join object_table on
		object_table.area_id = user_table.main_area
	where
		key = '${key}'
		${filter};`
}

export default {
	confirmValidation,
	setKey,
	getAllKeyQuery,
	getAllUserQuery,
	getPeopleRealtimeQuery,
	getPeopleHistoryQuery,
	getObjectHistoryQuery,
	getObjectRealtimeQuery,
	getIDTableQuery,
	getObjectIDFilter,
	getObjectTypeFilter,
	getObjectTypeQuery,
	getAreaIDQuery,
	getAreaIDFilter
}
