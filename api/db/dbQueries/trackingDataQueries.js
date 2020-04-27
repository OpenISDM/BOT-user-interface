const getTrackingData = (areas_id, key) => {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.last_reported_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_summary_table.base_x,
			object_summary_table.base_y,
			object_table.id,
			object_table.name,
			object_table.type,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			object_table.asset_control_number as last_four_acn,
			lbeacon_table.description as location_description,
			JSON_BUILD_OBJECT(
				'id', area_table.id,
				'value', area_table.name
			) AS area
		
		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN area_table
		ON object_table.area_id = area_table.id

		WHERE object_table.area_id IN (${areas_id.map(id => id)}) 
			AND object_table.object_type != 0

		ORDER BY 
			object_table.type, 
			object_table.asset_control_number
			DESC;
	`
	return query;
}

module.exports = {
	getTrackingData
}
