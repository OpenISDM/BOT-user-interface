/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        geofenceQueries.js

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

const getGeofenceConfig = (areaId) => {
    return `
		SELECT
			*
		FROM geo_fence_config
		ORDER BY id
	;`;
};

const deleteMonitorConfig = (monitorConfigPackage) => {
    const { type, id } = monitorConfigPackage;
    return `
		DELETE FROM geo_fence_config
		WHERE id IN (${id.map((id) => `'${id}'`)})
	`;
};

const addGeofenceConfig = (monitorConfigPackage) => {
    const {
        type,
        id,
        name,
        start_time,
        end_time,
        enable,
        perimeters,
        fences,
        area_id,
        is_global_fence,
    } = monitorConfigPackage;

    const text = `
		INSERT INTO ${type}
			(
				name,
				start_time,
				end_time,
				enable,
				perimeters,
				fences,
				area_id,
				is_global_fence
			)
		VALUES
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8
			)
	`;

    const values = [
        name,
        start_time,
        end_time,
        enable,
        perimeters,
        fences,
        area_id,
        is_global_fence,
    ];

    return {
        text,
        values,
    };
};

const setGeofenceConfig = (monitorConfigPackage) => {
    const {
        type,
        id,
        name,
        start_time,
        end_time,
        enable,
        perimeters,
        fences,
        area_id,
        is_global_fence,
    } = monitorConfigPackage;

    const text = `
		UPDATE geo_fence_config
		SET
			name = $2,
			area_id = $3,
			start_time = $4,
			end_time = $5,
			enable = $6,
			perimeters = $7,
			fences = $8,
			is_global_fence = $9
		WHERE id = $1;
	`;
    const values = [
        id,
        name,
        area_id,
        start_time,
        end_time,
        enable,
        perimeters,
        fences,
        is_global_fence,
    ];

    const query = {
        text,
        values,
    };

    return query;
};

export default {
    getGeofenceConfig,
    deleteMonitorConfig,
    addGeofenceConfig,
    setGeofenceConfig,
};
