const getAllUser = () => {
	const query = `
		SELECT

			user_table.id,
			user_table.name, 
			user_table.registered_timestamp,
			user_table.last_visit_timestamp,
			JSON_BUILD_OBJECT(
				'id', user_table.main_area,
				'value', area_table.name
			) AS main_area,
			area_table.name as area_name,
			ARRAY_AGG(roles.name) AS role_type,
			COALESCE(areas.area_ids, ARRAY[]::JSONB[]) as area_ids		
			
		FROM user_table  

		INNER JOIN (
			SELECT * 
			FROM user_role
			INNER JOIN roles 
			ON user_role.role_id = roles.id
		) roles
		ON user_table.id = roles.user_id

		LEFT JOIN area_table
		ON area_table.id = user_table.main_area

		LEFT JOIN (
			SELECT
				user_id,
				ARRAY_AGG(JSONB_BUILD_OBJECT(
					'id', area_id::int,
					'value', (
						SELECT 
							name 
						FROM area_table
						WHERE area_table.id = area_id
					)
				)) AS area_ids
			FROM user_area
			GROUP BY 
				user_id
		) AS areas
		ON areas.user_id = user_table.id

		GROUP BY 
			user_table.id, 
			user_table.name,
			user_table.registered_timestamp, 
			user_table.last_visit_timestamp,
			area_table.name,
			areas.area_ids
		ORDER BY user_table.name DESC
	`
	return query
}

const addUser = (signupPackage) => {

	const text = 
		`
		INSERT INTO user_table 
			(
				name, 
				password,
				registered_timestamp,
				main_area
			)
		VALUES (
			$1, 
			$2, 
			now(),
			$3
		);
		`;
	const values = [
		signupPackage.name, 
		signupPackage.password,
		signupPackage.area_id
	];

	const query = {
		text,
		values
	};

	return query
}


const insertUserData = (name, roles, area_id) => {

	return `
		INSERT INTO user_role (
			user_id, 
			role_id
		)
		VALUES 
		${
			roles.map(role => `(
				(
					SELECT id
					FROM user_table
					WHERE name = '${name}'
				), 
				(
					SELECT id 
					FROM roles
					WHERE name = '${role}'
				)
			)`
		)};

		INSERT INTO user_area (
			user_id, 
			area_id
		)
		VALUES (
			(
				SELECT id 
				FROM user_table 
				WHERE name ='${name}'
			),
			${area_id}
		)
	`
}


const editUserInfo = user => {
	return `

		DELETE FROM user_role 
		WHERE user_id = ${user.id};

		DELETE FROM user_area
		WHERE user_id = ${user.id};

		UPDATE user_table
		SET 
			name = '${user.name}',
			main_area = ${user.main_area}
		WHERE id = ${user.id};

		INSERT INTO user_role (
			user_id, 
			role_id
		)
			VALUES 
			${
				user.roles.map(roleName => `(
					${user.id}, 
					(
						SELECT id 
						FROM roles
						WHERE name='${roleName}'
					)
				)`).join(',')
			};

		INSERT INTO user_area (
			user_id, 
			area_id
		)
			VALUES 
			${
				user.areas_id.map(areaId => `(
					${user.id}, 
					${areaId}
				)`).join(',')
			};
	`
}

const deleteUser = (username) => {
	
	const query = `
		
		DELETE FROM user_role 
		WHERE user_id = (
			SELECT id 
			FROM user_table 
			WHERE name='${username}'
		); 

		DELETE FROM user_area
		WHERE user_id = (
			SELECT id
			FROM user_table
			WHERE name='${username}'
		);

		DELETE FROM user_table 
		WHERE id = (
			SELECT id 
			FROM user_table
			WHERE name='${username}'
		);
	`
	return query
}

module.exports = {
	getAllUser,
	addUser,
	insertUserData,
	editUserInfo,
	deleteUser,
}