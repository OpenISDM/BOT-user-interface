/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        authQueries.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

module.exports = {
	signin: (username) => { 
		const text =
			`
			WITH 
			user_info
				AS 
					(
						SELECT 
							name, 
							password, 
							id, 
							main_area, 
							max_search_history_count, 
							locale_id,
							keyword_type
						FROM user_table
						WHERE name =$1
					)
			,
			roles
				AS
					(
						SELECT 
							user_role.user_id, 
							user_role.role_id, 
							roles.name as role_name 
						FROM user_role
						INNER JOIN roles
						ON roles.id = user_role.role_id
						WHERE user_role.user_id = (SELECT id FROM user_info)
					),
			permissions
				AS
					(
						SELECT roles_permission.role_id, roles_permission.permission_id, permission_table.name as permission_name 
						FROM roles_permission
						INNER JOIN permission_table
						ON roles_permission.permission_id = permission_table.id
						WHERE roles_permission.role_id in (SELECT role_id FROM roles)
					),
			areas
				AS
					(
						SELECT area_id
						FROM user_area
						WHERE user_area.user_id = (SELECT id FROM user_info)
					),
			search_histories
				AS
					(
						WITH temp AS (
							SELECT 
								keyword,
								search_time, 
								CASE WHEN LAG(keyword) OVER (PARTITION BY keyword ORDER BY search_history DESC ) = keyword 
								THEN null ELSE 1 END 
							FROM search_history 
							WHERE user_id = (
								SELECT id
								FROM user_table
								WHERE name = $1
							)
							ORDER BY search_time DESC
						) 
						SELECT * 
						FROM temp 
						WHERE temp.case IS NOT NULL
					)
			SELECT 
				user_info.name, 
				user_info.password,
				user_info.locale_id,
				array (
					SELECT keyword
					FROM search_histories
				) AS search_history,
				user_info.id,
				user_info.id,
				user_info.locale_id,
				user_info.main_area,
				user_info.keyword_type,
				user_info.max_search_history_count as freq_search_count,
				array (
					SELECT role_name 
					FROM roles
				) AS roles,
				array ( 
					SELECT DISTINCT permission_name 
					FROM permissions 
				) AS permissions, 
				array (
					SELECT area_id::int 
					FROM areas
				) AS areas_id,
				(
					SELECT locales.name 
					FROM locales
					WHERE user_info.locale_id = locales.id
				) AS locale

			FROM user_info
			`;

		const values = [
			username
		];

		const query = {
			text,
			values
		};

		return query;
	},

	setVisitTimestamp: (username) => {
		return `
			UPDATE user_table
			SET last_visit_timestamp = NOW()
			WHERE name = '${username}';
		`
	},


	validateUsername: username => {
		let text = `
			SELECT 
				user_table.name, 
				user_table.password,
				roles.name as role,
				user_role.role_id as role_id,
				array (
					SELECT area_id
					FROM user_area
					WHERE user_area.user_id = user_table.id
				) as areas_id,
				(
					SELECT id
					FROM user_table
					WHERE user_table.name = $1
				) as user_id,
				ARRAY (
					SELECT role_id
					FROM user_role
					WHERE user_role.user_id = (
						SELECT id
						FROM user_table 
						WHERE user_table.name = $1
					)
				) as roles

			FROM user_table

			LEFT JOIN user_role
			ON user_role.user_id = user_table.id

			LEFT JOIN roles
			ON user_role.role_id = roles.id
			
			LEFT JOIN user_area
			ON user_area.user_id = user_table.id
			
			WHERE user_table.name = $1;
		`

		const values = [
			username
		];

		const query = {
			text,
			values
		};

		return query;

	},

	resetPassword: (email, hash) => {
		let text = `
			UPDATE user_table
			SET password = $2
			WHERE email = $1;
		`

		let values = [
			email, 
			hash
		]

		const query = {
			text,
			values
		}

		return query;
	},

	validateEmail: email => {
		let text = `
			SELECT 
				id,
				registered_timestamp
			FROM user_table
			WHERE email = LOWER($1)
		`

		let values = [
			email
		]

		return {
			text,
			values
		}
	}
}
