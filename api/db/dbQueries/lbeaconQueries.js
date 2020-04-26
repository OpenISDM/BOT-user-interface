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
        product_version,
        comment
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

const editLbeacon = (formOption) => {
	const text =
		`
		UPDATE lbeacon_table
		SET 
            description = $2,
            comment = $3


		WHERE uuid = $1
	`;

	const values = [
		formOption.uuid,
		formOption.description,
		formOption.comment
	]

	const query = {
		text, 
		values
	};

	return query
}

module.exports = {
    getLbeaconTable,
    deleteLBeacon,
    editLbeacon
}