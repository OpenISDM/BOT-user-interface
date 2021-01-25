/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userQueries.js

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

export default {
	getAllUser: () => {
		const query = `
        SELECT
            user_table.id,
            user_table.name,
            user_table.email,
            user_table.registered_timestamp,
            user_table.last_visit_timestamp,
            ARRAY_REMOVE(ARRAY_AGG(roles.name), NULL) AS role_type,
            coalesce(areas.area_ids, array[]::JSONB[]) as area_ids
        FROM
            user_table
        LEFT JOIN (
            SELECT
                *
            FROM
                user_role
            INNER JOIN roles ON
                user_role.role_id = roles.id ) roles ON
            user_table.id = roles.user_id
        LEFT JOIN (
            SELECT
                user_id,
                ARRAY_AGG(JSONB_BUILD_OBJECT( 'id', area_id::int, 'value', ( SELECT readable_name FROM area_table where area_table.id = area_id ) )) as area_ids
            FROM
                user_area
            GROUP BY
                user_id ) as areas ON
            areas.user_id = user_table.id
        GROUP BY
            user_table.id,
            areas.area_ids
        ORDER BY
            user_table.name desc
		`
		return query
	},

	addUser: (signupPackage) => {
		const text = `
			INSERT INTO user_table
				(
					name,
					password,
					registered_timestamp,
					email
				)
			VALUES (
				$1,
				$2,
				now(),
				$3
			);
			`
		const values = [
			signupPackage.name,
			signupPackage.password,
			signupPackage.email,
		]

		const query = {
			text,
			values,
		}

		return query
	},

	insertUserData: (name, roles, areaIds) => {
		const insertRoles = roles.map((role) => {
			return `(
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
		})

		const insertAreaIds = areaIds.map((areaId) => {
			return `(
                (
                    SELECT id
                    FROM user_table
                    WHERE name = '${name}'
                ),
                ${areaId}
            )`
		})

		return `
			INSERT INTO user_role (
				user_id,
				role_id
			)
			VALUES
			${insertRoles};

			INSERT INTO user_area (
				user_id,
				area_id
			)
            VALUES
            ${insertAreaIds};
		`
	},

	setUserInfo: (user) => {
		return `

			DELETE FROM user_role
			WHERE user_id = ${user.id};

			DELETE FROM user_area
			WHERE user_id = ${user.id};

			UPDATE user_table
			SET
				name = '${user.name}',
				email = '${user.email}'
			WHERE id = ${user.id};

			INSERT INTO user_role (
				user_id,
				role_id
			)
				VALUES
				${user.roles
					.map(
						(roleName) => `(
						${user.id},
						(
							SELECT id
							FROM roles
							WHERE name='${roleName}'
						)
					)`
					)
					.join(',')};

			INSERT INTO user_area (
				user_id,
				area_id
			)
				VALUES
				${user.areaIds
					.map(
						(areaId) => `(
						${user.id},
						${areaId}
					)`
					)
					.join(',')};
		`
	},

	deleteUser: (username) => {
		// TODO: Should use user_id to delete record
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
	},

	editSecondaryArea: (user) => {
		return `
			DELETE FROM user_area
			WHERE user_id = ${user.id};

			INSERT INTO user_area (
				area_id,
				user_id
			)
			VALUES
			${user.areas_id.map(
				(id) => `(
				${id},
				${user.id}
			)`
			)};
		`
	},

	editPassword: (user_id, password) => {
		const text = `
			UPDATE user_table
			SET
				password = $2
			WHERE id = $1
		`

		const values = [user_id, password]

		const query = {
			text,
			values,
		}

		return query
	},

	setLocale: (userId, lang) => {
		const text = `
			UPDATE user_table
			SET locale_id = (
				SELECT id
				FROM locales
				WHERE name = $1
			)
			WHERE id = $2
			`
		const values = [lang, userId]

		const query = {
			text,
			values,
		}

		return query
	},

	addSearchHistory: (username, keyType, keyWord) => {
		const text = `
			INSERT INTO search_history (
				search_time,
				keyWord,
				key_type,
				user_id
			)

			VALUES(
				now(),
				$1,
				$2,
				(
					SELECT id
					FROM user_table
					WHERE name = $3
				)
			)

		`

		const values = [keyWord, keyType, username]

		const query = {
			text,
			values,
		}

		return query
	},

	editMaxSearchHistoryCount: (username, info) => {
		const { freqSearchCount } = info

		return `
			UPDATE user_table
			SET max_search_history_count = ${freqSearchCount}
			WHERE name='${username}'
		`
	},

	editKeywordType: (userId, keywordTypeId) => {
		const text = `
			UPDATE user_table
			SET keyword_type = $2
			WHERE id = $1
		`
		const values = [userId, keywordTypeId]

		return {
			text,
			values,
		}
	},
}
