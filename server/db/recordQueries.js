const getShiftChangeRecord = () => {
	const query = `
		SELECT
			shift_change_record.id,
			shift_change_record.file_path,
			shift_change_record.submit_timestamp,
			shift_change_record.shift,
			user_table.name as user_name,
			device_group_list.name as list_name
		FROM shift_change_record

		LEFT JOIN user_table
		ON user_table.id = shift_change_record.user_id

		LEFT JOIN device_group_list
		ON shift_change_record.list_id = device_group_list.id

		ORDER BY shift_change_record.submit_timestamp DESC;

	`
	return query
}

const getEditObjectRecord = () => {
	const query = `
		SELECT
			user_table.name,
			edit_object_record.id,
			edit_object_record.edit_time,
			edit_object_record.notes,
			edit_object_record.new_status,
			edit_object_record.path as file_path
		FROM edit_object_record

		LEFT JOIN user_table
		ON user_table.id = edit_object_record.edit_user_id

		ORDER BY edit_object_record.edit_time DESC

	`
	return query
}

const addEditObjectRecord = (formOption, username, filePath) => {
	const text = `
		INSERT INTO edit_object_record (
			edit_user_id,
			notes,
			new_status,
			new_location,
			edit_objects,
			path,
			edit_time
		)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name = $1
			),
			$2,
			$3,
			$4,
			ARRAY ['${formOption.map((item) => item.asset_control_number)}'],
			$5,
			now()
		)
		RETURNING id;
	`
	const values = [
		username,
		formOption[0].notes,
		formOption[0].status,
		formOption[0].transferred_location,
		filePath,
	]

	const query = {
		text,
		values,
	}
	return query
}

const deleteEditObjectRecord = (idPackage) => {
	const query = `
		DELETE FROM edit_object_record
		WHERE id IN (${idPackage.map((item) => `'${item}'`)})
		RETURNING *;
	`
	return query
}

const addShiftChangeRecord = (userInfo, file_path, shift, list_id) => {
	const text = `
		INSERT INTO shift_change_record (
			user_id,
			shift,
			file_path,
			list_id,
			submit_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			now()
		);
	`

	const values = [userInfo.id, shift.value, file_path, list_id]

	return {
		text,
		values,
	}
}

const addPatientRecord = (objectPackage) => {
	const text = `
		INSERT INTO patient_record (
			object_id,
			editing_user_id,
			record,
			created_timestamp
		)
		VALUES (
			$1,
			$2,
			$3,
			NOW()
		)

	`
	const values = [objectPackage.id, objectPackage.userId, objectPackage.record]

	const query = {
		text,
		values,
	}

	return query
}

const deleteShiftChangeRecord = (idPackage) => {
	const query = `
		DELETE FROM shift_change_record
		WHERE id IN (${idPackage.map((item) => `'${item}'`)})
		RETURNING *;
	`
	return query
}

export default {
	getShiftChangeRecord,
	addShiftChangeRecord,
	deleteShiftChangeRecord,
	getEditObjectRecord,
	addEditObjectRecord,
	deleteEditObjectRecord,
	addPatientRecord,
}
