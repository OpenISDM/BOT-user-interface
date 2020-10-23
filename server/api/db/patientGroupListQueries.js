/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectQueries.js

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

const getPatientGroup = (pack) => {
	const groupIdSelector = pack.groupId ? `WHERE id = ${pack.groupId}` : ''
	const query = `
        SELECT  * FROM patient_group_list ${groupIdSelector} ORDER BY id
    `
	return query
}

const addPatientGroup = (name, areaId) => {
	const text = `
        INSERT INTO patient_group_list (
            name,
            area_id
        ) VALUES (
            $1,
            $2
        )
        RETURNING id
    `
	const values = [name, areaId]
	const query = {
		text,
		values,
	}
	return query
}

const modifyPatientGroup = ({ groupId, mode, itemId, newName }) => {
	let query = null
	mode = parseInt(mode)
	if (mode === 0) {
		query = `
            UPDATE patient_group_list
            SET patients = array_append(patients, '${itemId}')
            WHERE id = ${groupId};

            UPDATE object_table
            SET list_id = ${groupId}
            WHERE id = ${itemId}
            `
	} else if (mode === 1) {
		query = `
            UPDATE patient_group_list
            SET patients = array_remove(patients, '${itemId}')
            WHERE id = ${groupId};

            UPDATE object_table
            SET list_id = null
            WHERE id = ${itemId}
        `
	} else if (mode === 2) {
		query = `UPDATE patient_group_list SET name = ${newName} WHERE id=${groupId}`
	}

	return query
}

const removePatientGroup = (groupId) => {
	const query = `
        UPDATE object_table
        SET list_id = null
        WHERE id = ANY(
            ARRAY (
                SELECT items
                FROM patient_group_list
                WHERE id = ${groupId}
            )::INT[]
        );

        DELETE FROM patient_group_list
        WHERE Id = ${groupId}
    `
	return query
}

export default {
	getPatientGroup,
	addPatientGroup,
	removePatientGroup,
	modifyPatientGroup,
}
