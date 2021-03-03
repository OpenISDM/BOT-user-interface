const getMonitorConfig = (type, areaIds) => {
	let whereStatement = ''
	if (areaIds && areaIds.length > 0) {
		whereStatement = ` WHERE area_id in (${areaIds})`
	}

	const text = `
		SELECT
			${type}.id,
			${type}.area_id,
			${type}.enable,
			${type}.start_time,
			${type}.end_time,
			${type}.is_active,
			lbeacon_temp_table.lbeacons

		FROM ${type}

		LEFT JOIN (

			SELECT
				lbeacon_area_id,
				ARRAY_AGG(uuid) AS lbeacons
			FROM (

				SELECT

					SUBSTRING(uuid::text, 1, 4)::INTEGER AS lbeacon_area_id,
					uuid,
					room

				FROM lbeacon_table
				WHERE room IS NOT NULL

			) AS temp
			GROUP BY lbeacon_area_id
		) as lbeacon_temp_table
		ON lbeacon_temp_table.lbeacon_area_id = ${type}.area_id

        ${whereStatement}

		ORDER BY id;
	`
	return text
}

const deleteMonitorConfig = (monitorConfigPackage) => {
	const { type, id } = monitorConfigPackage
	return `
		DELETE FROM ${type}
		WHERE id IN (${id.map((id) => `'${id}'`)})
	`
}

const addMonitorConfig = (monitorConfigPackage) => {
	const { type, start_time, end_time, enable, area_id } = monitorConfigPackage

	const text = `
		INSERT INTO ${type}
			(
				start_time,
				end_time,
				enable,
				area_id
			)
		VALUES
			(
				$1,
				$2,
				$3,
				$4
			)
	`

	const values = [start_time, end_time, enable, area_id]

	return {
		text,
		values,
	}
}

const setMonitorConfig = (monitorConfigPackage) => {
	const {
		type,
		id,
		start_time,
		end_time,
		enable,
		area_id,
	} = monitorConfigPackage

	const text = `
		UPDATE ${type}
		SET
			area_id = $5,
			start_time = $2,
			end_time = $3,
			enable = $4

		WHERE id = $1;
	`
	const values = [id, start_time, end_time, enable, area_id]

	const query = {
		text,
		values,
	}

	return query
}

export default {
	getMonitorConfig,
	deleteMonitorConfig,
	addMonitorConfig,
	setMonitorConfig,
}
