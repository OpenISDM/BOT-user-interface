export default {
	getSearchableKeyword: (areaId) => {
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
	},
}
