const getLbeaconTable = `
	SELECT 
		id,
		uuid, 
		description, 
		ip_address, 
		health_status, 
		gateway_ip_address, 
		last_report_timestamp,
		danger_area,
		room,
		api_version,
		server_time_offset,
		product_version
	FROM lbeacon_table
	ORDER BY ip_address DESC
`;

const deleteLBeacon = (idPackage) => {
	const query = `
		DELETE FROM lbeacon_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

module.exports = {
    getLbeaconTable,
    deleteLBeacon
}