const addPerson = (formOption) => {
	const text = `
		INSERT INTO object_table (
			name,
			mac_address,
			asset_control_number,
			area_id,
			object_type,
			type,
            status,
            room,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			1,
			$5,
            'returned',
            $6,
			now()
		)`

	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
		formOption.type,
		formOption.room,
	]

	const query = {
		text,
		values,
	}

	return query
}

const editPerson = (formOption) => {
	return `
		update
			object_table
		set
			name = '${formOption.name}',
			mac_address = '${formOption.mac_address}',
			area_id = '${formOption.area_id}',
			type = '${formOption.type}',
			asset_control_number = '${formOption.asset_control_number}'
		where
			id = '${formOption.id}';
	`
}

const editDevice = (formOption) => {
	const text = `
		Update object_table
		SET type = $2,
			status = $3,
			asset_control_number = $4,
			name = $5,
			monitor_type = $6,
			area_id = $7,
			mac_address = $8,
			nickname = $9,
			transferred_location = $10
		WHERE id = $1
		`
	const values = [
		formOption.id,
		formOption.type,
		formOption.status,
		formOption.asset_control_number,
		formOption.name,
		formOption.monitor_type,
		formOption.area_id,
		formOption.mac_address,
		formOption.nickname,
		formOption.transferred_location,
	]

	const query = {
		text,
		values,
	}

	return query
}

const deleteObject = (formOption) => {
	const query = `
		DELETE FROM object_table
		WHERE id IN (${formOption.map((item) => `'${item.id}'`)})
	`
	return query
}

const disassociate = (formOption) => {
	const text = `
		UPDATE object_table
		SET mac_address = null
		WHERE id = $1

		RETURNING (
			SELECT mac_address
			FROM object_table
			WHERE id = $1
		)
	`

	const values = [formOption.id]

	return {
		text,
		values,
	}
}

const addObject = (formOption) => {
	const text = `
		INSERT INTO object_table (
			type,
			asset_control_number,
			name,
			mac_address,
			area_id,
			monitor_type,
			nickname,
			object_type,
			status,
			registered_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			0,
			'normal',
			now()
		);
	`

	const values = [
		formOption.type,
		formOption.asset_control_number,
		formOption.name,
		formOption.mac_address,
		formOption.area_id,
		formOption.monitor_type,
		formOption.nickname,
	]

	const query = {
		text,
		values,
	}

	return query
}

const editObjectPackage = (
	formOption,
	username,
	record_id,
	reservedTimestamp
) => {
	const item = formOption[0]

	const [name, department] =
		item &&
		item.transferred_location &&
		item.transferred_location.label &&
		item.transferred_location.label.split('-')

	let transferLocationsQuery = null
	if (name && department) {
		transferLocationsQuery = `
            (
                SELECT id FROM transfer_locations WHERE name = '${name}' AND department = '${department}'
            )`
	}

	const text = `
		UPDATE object_table
		SET
			status = '${item.status}',
			transferred_location = ${
				item.status === 'transferred' ? transferLocationsQuery : null
			},
			note_id = ${record_id},
			reserved_timestamp = ${
				item.status === 'reserve' ? `'${reservedTimestamp}'` : null
			},
			reserved_user_id = (SELECT id
				FROM user_table
				WHERE user_table.name='${username}')

		WHERE asset_control_number IN (${formOption.map(
			(item) => `'${item.asset_control_number}'`
		)});
	`
	return text
}

const deleteObjectSummaryRecord = (mac_address_array) => {
	return `
		DELETE FROM object_summary_table
		WHERE mac_address IN (${mac_address_array.map((item) => `'${item}'`)});
	`
}

const getIdleMacaddr = () => {
	return `
		SELECT
			ARRAY_AGG(object_summary_table.mac_address) AS mac_set
		FROM object_summary_table

		LEFT JOIN object_table
		ON object_summary_table.mac_address = object_table.mac_address

		WHERE object_table.name IS NULL
	`
}

const getSearchableKeyword = (areaId) => {
	return `
        SELECT
            ARRAY_AGG(key) as keys
        FROM (
            SELECT
                DISTINCT name AS key
            FROM object_table
            WHERE area_id = ${areaId}

            UNION

            SELECT
                DISTINCT name
            FROM object_table
            WHERE area_id = ${areaId}

            UNION

            SELECT
                DISTINCT type
            FROM object_table
            WHERE area_id = ${areaId}

            UNION

            SELECT
                DISTINCT asset_control_number
            FROM object_table
            WHERE area_id = ${areaId}

            UNION

            SELECT
                DISTINCT nickname
            FROM object_table
            WHERE area_id = ${areaId}

            UNION

            SELECT
                DISTINCT description
            FROM lbeacon_table
            WHERE CAST(uuid as TEXT)
            LIKE '000${areaId}%'
        ) AS keywords
        WHERE key IS NOT NULL
    `
}

export default {
	addPerson,
	addObject,
	editDevice,
	editPerson,
	deleteObject,
	disassociate,
	editObjectPackage,
	deleteObjectSummaryRecord,
	getIdleMacaddr,
	getSearchableKeyword,
}
