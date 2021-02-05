export default {
	getTrackingData: (areaIds) => {
		const query = `
		SELECT
			object_table.mac_address,
			object_table.id,
			object_table.name,
			object_table.type,
			object_table.status,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			object_table.type_alias,
            object_table.list_id,
            object_table.monitor_type,
            object_table.nickname,
            object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.last_reported_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_summary_table.base_x,
			object_summary_table.base_y,
			object_summary_table.updated_by_n_lbeacons,
            object_summary_table.clear_bed,
            object_summary_table.updated_by_area,
			JSON_BUILD_OBJECT(
				'id', transfer_locations.id,
				'name', transfer_locations.name,
				'department', transfer_locations.department
			) AS transferred_location,
			edit_object_record.notes,
            edit_object_record.edit_user_id,
            (
				SELECT name
				FROM user_table
				WHERE user_table.id = edit_object_record.edit_user_id
			) as edit_user_name,
			lbeacon_table.description as location_description,
			JSON_BUILD_OBJECT(
				'id', area_table.id,
				'value', area_table.readable_name
			) AS lbeacon_area,
			COALESCE(patient_record.record, ARRAY[]::JSON[]) as records

		FROM object_table

		LEFT JOIN object_summary_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN area_table
		ON area_table.id = object_summary_table.updated_by_area

		LEFT JOIN edit_object_record
		ON object_table.note_id = edit_object_record.id

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

		LEFT JOIN transfer_locations
        ON object_table.transferred_location = transfer_locations.id

		WHERE object_table.area_id IN (${areaIds.map((areaId) => areaId).join(',')})

		ORDER BY
			object_table.area_id,
			object_table.type,
			object_table.asset_control_number
			DESC;
	`
		return query
	},
}
