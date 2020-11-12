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
        SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi, payload,
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
				location_history_table.average_rssi AS average_rssi,
				location_history_table.payload as payload
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
	if (tag !== undefined) {
		text += `  AND location_history_table.mac_address IN  (${tag.map(
			(item) => `'${item}'`
		)})`
	}
	if (Lbeacon !== undefined) {
		text += `  AND location_history_table.uuid IN  (${Lbeacon.map(
			(item) => `'${item}'`
		)})`
	}
	text += `) AS raw_data
    )

    , groups AS (
        SELECT mac_address, area_id, uuid, record_timestamp, battery_voltage, average_rssi, payload, r,
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
		MAX(groups.record_timestamp) - MIN(groups.record_timestamp)  AS duration,
		MIN(groups.payload) as payload
    FROM groups

    INNER JOIN object_table
    ON object_table.mac_address = groups.mac_address

    INNER JOIN area_table
    ON area_table.id = groups.area_id

    INNER JOIN Lbeacon_table
    ON Lbeacon_table.uuid = groups.uuid

    GROUP BY grp, groups.mac_address
    `

	if (sort_type === 'desc') {
		text += '  ORDER by mac_address ASC, start_time DESC   '
	} else {
		text += '   ORDER by mac_address ASC, start_time ASC   '
	}
	text += ' LIMIT  $4'

	const values = [start_time, end_time, key, count_limit]
	const query = {
		text,
		values,
	}

	return query
}

const get_people_history_data = (
	key,
	start_time,
	end_time,
	count_limit,
	sort_type
) => {
	return `select 
	location_history_table.object_id as object_id,
	location_history_table.mac_address as mac_address,
	object_table.name as name,
	location_history_table.area_id as area_id,
	area_table.readable_name as area_name,
	location_history_table.uuid as Lbeacon_uuid,
	lbeacon_table.description as Lbeacon_description,
	location_history_table.record_timestamp as record_timestamp,
	location_history_table.payload as payload
	from api_key
	
	inner join user_table
	on user_table.id = api_key.id
	
	inner join object_table
	on object_table.area_id = user_table.main_area
	and object_table.type = 'Patient'
	
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

const get_people_realtime_data = (key) => {
	return `select 
	object_summary_table.id as object_id, 
	object_summary_table.mac_address as mac_address, 
	object_table.name as object_name, 
	object_summary_table.updated_by_area as area_id, 
	area_table.readable_name as area_name,
	object_summary_table.uuid as Lbeacon_uuid,
	lbeacon_table.description as Lbeacon_description, 
	object_summary_table.payload as payload
	from api_key
	
	inner join user_table
	on user_table.id = api_key.id
	
	inner join object_table
	on object_table.area_id = user_table.main_area
	and object_table.type = 'Patient'
	
	inner join object_summary_table
	on object_summary_table.mac_address = object_table.mac_address
	
	left join lbeacon_table
	on object_summary_table.uuid = lbeacon_table.uuid
	
	left join area_table
	on area_table.id = object_summary_table.updated_by_area
	where api_key.key = '${key}';
	`
}

export default {
	confirmValidation,
	setKey,
	getAllKeyQuery,
	getAllUserQuery,
	get_data,
	get_people_realtime_data,
	get_people_history_data,
}
