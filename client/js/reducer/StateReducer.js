import {
	SET_AREA,
	SET_ENABLE_REQUEST_TRACKING_DATA,
	ASSIGN_OBJECT,
	SET_TABLE_SELECTION,
	SET_TRACKING_DATA,
	SET_OBJECT_FOUND_RESULTS,
	SET_DEVICE_OBJECT_TYPE_VISIBLE,
	SET_PERSON_OBJECT_TYPE_VISIBLE,
	SET_OPENED_NOTIFICATION,
} from './action'

const StateReducer = (state, action) => {
	switch (action.type) {
		case SET_AREA:
			return {
				...state,
				area: action.value,
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
		case SET_DEVICE_OBJECT_TYPE_VISIBLE:
			return {
				...state,
				deviceObjectTypeVisible: action.value,
			}
		case SET_PERSON_OBJECT_TYPE_VISIBLE:
			return {
				...state,
				personObjectTypeVisible: action.value,
			}
		case SET_OPENED_NOTIFICATION:
			return {
				...state,
				openedNotification: action.value,
			}
		default:
			return state
	}
}

export default StateReducer
