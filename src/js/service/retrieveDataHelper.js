import dataSrc from '../dataSrc'
import axios from 'axios'
import config from '../config'

const retrieveDataHelper = {
    
    /**
     * get tracking data from object_summary_table
     * @param {*} locale: the abbr in locale context
     * @param {*} userInfo: the user object in auth
     * @param {*} areaId: the area_id of current area or the area_id in stateReducer
     */
    getTrackingData: async function (
        locale, 
        user, 
        areaId
    ) {
        return await axios.post(dataSrc.trackingData,{
            locale,
            user,
            areaId,
        })
    },
    
    /**
     * get object data from object_table
     */
    getObjectTable: async function(
        locale, 
        areas_id, 
        objectType
    ){
        return await axios.post(dataSrc.getObjectTable, {
            locale,
            areas_id,
            objectType,
        })
    },

    getAreaTable: async function() {
        return await axios.post(dataSrc.getAreaTable)
    },

    getLbeaconTable: async function(locale) {
        return await axios.get(dataSrc.lbeacon, {
            params: {
                locale,
            }
        })
    },

    getGatewayTable: async function(locale) {
        return await axios.get(dataSrc.gateway, {
            params: {
                locale
            }
        })
    },

    getMonitorConfig: async function(
        type, 
        areasId,
        isGetLbeaconPosition
    ) {
        
        return await axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[type],
            areasId,
            isGetLbeaconPosition,
        })
    },

    getEditObjectRecord: async function(locale) {
        return await axios.post(dataSrc.getEditObjectRecord,{
            locale
        })
    },

    getShiftChangeRecord: async function(locale) {
        return await axios.post(dataSrc.getShiftChangeRecord,{
            locale
        })
    },

    setMonitorEnable: async function(
        enable,
        areaId,
        type
    ){
        return await axios.post(dataSrc.setMonitorEnable, {
            enable,
            areaId,
            type
        })
    },
}


export default retrieveDataHelper
