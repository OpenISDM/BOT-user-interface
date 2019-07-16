import { 
    IS_OBJECT_LIST_SHOWN, 
    SELECT_OBJECT_LIST,
    RETRIEVE_TRACKING_DATA,
    SHOULD_UPDATE_TRACKING_DATA,
    CHANGE_LOCATION_ACCURACY,
    RETRIEVE_OBJECT_TABLE
} from './actionType';

/** Action Creator for Sidebar */
export const isObjectListShown = (boolean) => {
    return {
        type: IS_OBJECT_LIST_SHOWN,
        value: boolean
    }
}

export const selectObjectList = (array) => {
    return {
        type: SELECT_OBJECT_LIST,
        array: array,
    }
}

/** Retrieve tracking data action creator */
export const retrieveTrackingData = (objectInfo) => {
    return {
        type: RETRIEVE_TRACKING_DATA,
        object: objectInfo
    }
}

export const shouldUpdateTrackingData = (boolean) => {
    return {
        type: SHOULD_UPDATE_TRACKING_DATA,
        value: boolean 
    }
}

export const changeLocationAccuracy = (value) => {
    return {
        type: CHANGE_LOCATION_ACCURACY,
        value: value
    }
}

export const retrieveObjectTable = (objectArray) => {
    return {
        type: RETRIEVE_OBJECT_TABLE,
        value: objectArray 
    }
}