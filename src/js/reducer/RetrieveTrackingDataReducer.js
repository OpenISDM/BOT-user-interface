import { 
    RETRIEVE_TRACKING_DATA, 
    SHOULD_UPDATE_TRACKING_DATA,
    CHANGE_LOCATION_ACCURACY,
    RETRIEVE_OBJECT_TABLE,
} from '../action/actionType';
import config from '../config';

const initialState = {
    shouldTrackingDataUpdate: config.surveillanceMap.startInteval,
    objectInfo: {},
    locationAccuracy: 1,
    objectTable: [],
}

function RetrieveTrackingDataReducer (state = initialState, action) {
    switch(action.type) {
        case RETRIEVE_TRACKING_DATA:
            return {
                ...state,
                objectInfo: action.object
            } 
        case SHOULD_UPDATE_TRACKING_DATA:
            return {
                ...state,
                shouldTrackingDataUpdate: action.value
            }

        case CHANGE_LOCATION_ACCURACY:
            return {
                ...state,
                locationAccuracy: action.value
            }
        case RETRIEVE_OBJECT_TABLE:
            return {
                ...state,
                objectTable: action.value
            }


        default:
            return state
            
    }
}

export default RetrieveTrackingDataReducer;