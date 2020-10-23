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

const getDeviceGroup = (pack) => {
	const groupIdSelector = pack.groupId ? `WHERE id = ${pack.groupId}` : ''
	const query = `
        SELECT  * FROM device_group_list ${groupIdSelector} ORDER BY id
    `
	return query
}

const addDeviceGroup = (name, areaId) => {
	const text = `
        INSERT INTO device_group_list (
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

const modifyDeviceGroup = ({ groupId, mode, itemId, newName }) => {
	let query = null
	mode = parseInt(mode)
	if (mode === 0) {
		query = `
            UPDATE device_group_list
            SET items = array_append(items, '${itemId}')
            WHERE id = ${groupId};

            UPDATE object_table
            SET list_id = ${groupId}
            WHERE id = ${itemId}
        `
	} else if (mode === 1) {
		query = `
            UPDATE device_group_list
            SET items = array_remove(items, '${itemId}')
            WHERE id=${groupId};

            UPDATE object_table
            SET list_id = null
            WHERE id = ${itemId}
        `
	} else if (mode === 2) {
		query = `UPDATE device_group_list SET name = ${newName} WHERE id=${groupId}`
	}

	return query
}
const removeDeviceGroup = (groupId) => {
	const query = `
        UPDATE object_table
        SET list_id = null
        WHERE id = ANY(
            ARRAY (
                SELECT items
                FROM device_group_list
                WHERE id = ${groupId}
            )::INT[]
        );

        DELETE FROM device_group_list
        WHERE id = ${groupId}
        `
	return query
}

export default {
	getDeviceGroup,
	addDeviceGroup,
	removeDeviceGroup,
	modifyDeviceGroup,
}
