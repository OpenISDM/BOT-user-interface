const getObject = (objectType, areas_id) => {

	let text =  `
		SELECT 
			object_table.id,
			object_table.name, 
			object_table.type, 
			object_table.asset_control_number, 
			object_table.status, 
			object_table.transferred_location, 
			SPLIT_PART(object_table.transferred_location, ',', 1) AS branch_id,
			SPLIT_PART(object_table.transferred_location, ',', 2) AS department_id,
			branch_and_department.branch_name as branch_name,
			CASE WHEN CAST(
				COALESCE(
					NULLIF(SPLIT_PART(object_table.transferred_location, ',', 1), '')
				, '0') AS INTEGER
			) IS NOT NULL THEN branch_and_department.department[CAST(
				COALESCE(
					NULLIF(SPLIT_PART(object_table.transferred_location, ',', 1), '')
				, '0') AS INTEGER
			)] END AS department_name,
			object_table.mac_address,
			object_table.monitor_type,
			object_table.area_id,
			area_table.name as area_name,
			object_table.registered_timestamp,
			object_table.object_type,
			object_table.id,
			object_table.room,
			object_table.physician_id,
			(
				SELECT name
				FROM user_table
				WHERE user_table.id = object_table.physician_id
			) as physician_name

		FROM object_table 

		LEFT JOIN area_table
		ON area_table.id = object_table.area_id

		LEFT JOIN branch_and_department
		ON branch_and_department.id = CAST(
			COALESCE(
				NULLIF(SPLIT_PART(object_table.transferred_location, ',', 1), '')
			, '0') AS INTEGER
		)
	
		WHERE object_table.object_type IN (${objectType.map(type => type)})
		${areas_id ? `AND object_table.area_id IN (${areas_id.map(id => id)})` : ''}
		ORDER BY 
			object_table.registered_timestamp DESC,
			object_table.name ASC
			
			;
	`
	return text
} 

const addPersona = (formOption) => {
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

const editPersona = (formOption) => {
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

const deleteObject = (formOption) => {
    
	const query = `
		DELETE FROM object_table
		WHERE mac_address IN (${formOption.map(item => `'${item}'`)});
	`
	return query
}

module.exports = {
    getObject,
    addPersona,
    editPersona,
    deleteObject,
}