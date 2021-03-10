export default {
	getLocationHistory: (key, startTime, endTime, mode) => {
		let query = null
		switch (mode) {
			case 'nameGroupByArea':
				query = `
					WITH ranges AS (
						SELECT
							mac_address,
							area_id,
							record_timestamp,
							battery_voltage,
							average_rssi,
							CASE WHEN LAG(area_id) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = area_id
								THEN NULL ELSE 1 END r
						FROM
						(
							SELECT
								location_history_table.mac_address AS mac_address,
								location_history_table.area_id AS area_id,
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

							WHERE
								object_table.name = '${key}'
								AND record_timestamp >= '${startTime}'
								AND record_timestamp <= '${endTime}'

						) AS raw_data
					)
					, groups AS (
						SELECT
							mac_address,
							area_id,
							record_timestamp,
							battery_voltage,
							average_rssi,
							r,
							SUM(r) OVER (ORDER BY mac_address, record_timestamp) grp
						FROM ranges
					)

					SELECT
						MIN(groups.mac_address::TEXT) AS mac_address,
						MIN(object_table.name) AS name,
						MIN(groups.area_id) AS area_id,
						MIN(area_table.name) AS area_name,
						MIN(groups.battery_voltage) AS battery_voltage,
						AVG(groups.average_rssi) AS avg_rssi,
						MIN(groups.record_timestamp) AS start_time,
						MAX(groups.record_timestamp) AS end_time,
						MAX(groups.record_timestamp) - MIN(groups.record_timestamp) AS duration,
						grp
					FROM groups

					INNER JOIN object_table
					ON object_table.mac_address = groups.mac_address

					INNER JOIN area_table
					ON area_table.id = groups.area_id

					GROUP BY
						grp,
						groups.mac_address
					ORDER by mac_address ASC, start_time DESC
					`
				break
			case 'nameGroupByUUID':
				query = `
					WITH ranges AS (
						SELECT
							mac_address,
							area_id,
							uuid,
							record_timestamp,
							battery_voltage,
							average_rssi,
							CASE WHEN LAG(uuid) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = uuid
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

							WHERE
								object_table.name = '${key}'
								AND record_timestamp >= '${startTime}'
								AND record_timestamp <= '${endTime}'

						) AS raw_data
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
						MIN(area_table.name) AS area_name,
						MIN(groups.uuid::TEXT) AS uuid,
						MIN(lbeacon_table.description) AS location_description,
						MIN(groups.battery_voltage) AS battery_voltage,
						AVG(groups.average_rssi) AS avg_rssi,
						MIN(groups.record_timestamp) AS start_time,
						MAX(groups.record_timestamp) AS end_time,
						MAX(groups.record_timestamp) - MIN(groups.record_timestamp) AS duration
					FROM groups

					INNER JOIN object_table
					ON object_table.mac_address = groups.mac_address

					INNER JOIN area_table
					ON area_table.id = groups.area_id

					INNER JOIN lbeacon_table
					ON lbeacon_table.uuid = groups.uuid

					GROUP BY grp, groups.mac_address
					ORDER by mac_address ASC, start_time DESC
				`
				break
			case 'uuid':
				query = `
					SELECT
						location_history_table.uuid,
						location_history_table.mac_address,
						lbeacon_table.description AS location_description,
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
						AND record_timestamp >= '${startTime}'
						AND record_timestamp <= '${endTime}'

					GROUP BY
						location_history_table.mac_address,
						location_history_table.uuid,
						object_table.name,
						lbeacon_table.description,
						area_table.name,
						location_history_table.area_id

					ORDER BY object_table.name ASC

				`
				break
			case 'area':
				query = `
					SELECT
						object_table.name,
						location_history_table.mac_address,
						area_table.name AS area,
						area_table.id as area_id
					FROM location_history_table

					LEFT JOIN object_table
					ON location_history_table.mac_address = object_table.mac_address

					LEFT JOIN area_table
					ON location_history_table.area_id = area_table.id

					WHERE location_history_table.area_id = '${key}'
						AND object_table.object_type != 0
						AND record_timestamp >= '${startTime}'
						AND record_timestamp <= '${endTime}'

					GROUP BY
						location_history_table.mac_address,
						object_table.name,
						area_table.name,
						location_history_table.area_id,
						area_table.id

					ORDER BY object_table.name ASC
				`
				break
		}
		return query
	},

	getContactTree: (child, duplicate, startTime, endTime) => {
		return `
			WITH parent AS (
				WITH ranges AS (
					SELECT
						mac_address,
						area_id,
						record_timestamp,
						battery_voltage,
						average_rssi,
						CASE WHEN LAG(area_id) OVER (PARTITION BY mac_address ORDER BY mac_address, record_timestamp) = area_id
							THEN NULL ELSE 1 END r
					FROM
					(
						SELECT
							location_history_table.mac_address AS mac_address,
							location_history_table.area_id AS area_id,
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

						WHERE
							object_table.name = '${child}'
							AND record_timestamp >= '${startTime}'
							AND record_timestamp <= '${endTime}'

					) AS raw_data
				)
				, groups AS (
					SELECT
						mac_address,
						area_id,
						record_timestamp,
						battery_voltage,
						average_rssi,
						r,
						SUM(r)OVER (ORDER BY mac_address, record_timestamp) grp
					FROM ranges
				)

				SELECT
					MIN(groups.mac_address::TEXT) AS mac_address,
					MIN(object_table.name) AS name,
					MIN(groups.area_id) AS area_id,
					MIN(area_table.name) AS area_name,
					MIN(groups.battery_voltage) AS battery_voltage,
					AVG(groups.average_rssi) AS avg_rssi,
					MIN(groups.record_timestamp) AS start_time,
					MAX(groups.record_timestamp) AS end_time,
					MAX(groups.record_timestamp) - MIN(groups.record_timestamp) AS duration
				FROM groups

				INNER JOIN object_table
				ON object_table.mac_address = groups.mac_address

				INNER JOIN area_table
				ON area_table.id = groups.area_id

				GROUP BY
					grp,
					groups.mac_address

				ORDER by
					mac_address ASC,
					start_time DESC
			)

			SELECT
				DISTINCT ON (object_table.name) object_table.name AS child,
				parent.name AS parent,
				parent.area_id,
				MIN(children.record_timestamp) AS start_time,
				MAX(children.record_timestamp) AS end_time

			FROM parent

			LEFT JOIN location_history_table AS children
			ON children.area_id = parent.area_id
			AND children.record_timestamp >= parent.start_time
			AND children.record_timestamp <= parent.end_time
			AND children.mac_address::text != parent.mac_address::text

			LEFT JOIN object_table
			ON children.mac_address = object_table.mac_address
			AND object_table.object_type != 0

			WHERE object_table.name NOT IN (${duplicate.map((dup) => `'${dup}'`)})

			GROUP BY
				child,
				parent,
				parent.area_id

			ORDER BY
				child ASC,
				start_time ASC

			`
	},
	getTracePathByObjectId: (objectIds, startTime, endTime) => {
		return `
		WITH range_table AS(
   			SELECT
				object_id,
   				area_id,
   				uuid,
   				record_timestamp,
  				CASE
   					WHEN LAG(uuid) OVER 
						(PARTITION BY object_id ORDER BY object_id, record_timestamp) = uuid
        			THEN 
						NULL
   					ELSE 1
   				END AS r
    		FROM (
        		SELECT
   					lht.object_id AS object_id,
            		lht.area_id AS area_id,
            		lht.uuid AS uuid,
            		lht.record_timestamp AS record_timestamp
        		FROM 
					location_history_table lht
				INNER JOIN object_table ot
        		ON lht.object_id = ot.asset_control_number    
        	WHERE
            	record_timestamp > '${endTime}'
            	AND	record_timestamp < '${startTime}'
   				AND	lht.object_id in (${objectIds.map((item) => `'${item}'`)})
   			) AS raw_data
		), group_table AS (
    		SELECT
   				object_id,
   				area_id,
   				uuid,
   				record_timestamp,
   				r,
   				SUM(r) OVER (ORDER BY object_id, record_timestamp) grp

    		FROM 
				range_table
		)
		SELECT
    		object_id,
    		area_id,
    		uuid,
    		EXTRACT(EPOCH FROM (MIN(record_timestamp)))::INTEGER AS start_time,
    		EXTRACT(EPOCH FROM (MAX(record_timestamp)))::INTEGER AS end_time,
    		(EXTRACT(EPOCH FROM (MAX(record_timestamp))) - EXTRACT(EPOCH FROM(MIN(record_timestamp))))::INTEGER AS duration
		From 
			group_table gps
		GROUP BY
			grp,
			gps.object_id,
			gps.area_id,
			gps.uuid
		ORDER BY
			grp asc,
			object_id asc,
			start_time asc
		`
	},
}
