/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        StateReducer.js

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

import {
	SET_AREA,
	SET_ENABLE_REQUEST_TRACKING_DATA,
	ASSIGN_OBJECT,
	SET_TABLE_SELECTION,
	SET_TRACKING_DATA,
	SET_OBJECT_FOUND_RESULTS,
} from './action'

const StateReducer = (state, action) => {
	switch (action.type) {
		case SET_AREA:
			return {
				...state,
				areaId: action.value,
			}
		case SET_ENABLE_REQUEST_TRACKING_DATA:
			return {
				...state,
				shouldUpdateTrackingData: action.value,
			}
		case ASSIGN_OBJECT:
			return {
				...state,
				assignedObject: action.value,
			}
		case SET_TABLE_SELECTION:
			return {
				...state,
				tableSelection: action.value,
			}
		case SET_TRACKING_DATA:
			return {
				...state,
				trackingData: action.value,
			}
		case SET_OBJECT_FOUND_RESULTS:
			return {
				...state,
				objectFoundResults: action.value,
			}
		default:
			return state
	}
}

export default StateReducer
