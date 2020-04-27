require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/trackingDataQueries')
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

moment.updateLocale('en', {
    relativeTime : Object
});

moment.updateLocale('en', {
    relativeTime : {
        future: "being here for the past %s",
        past:   "%s ago",
        s  : '1 minute',
        ss : '1 minute',
        m:  "1 minute",
        mm: "%d minutes",
        h:  "1 hour",
        hh: "%d hours",
        d:  "1 day",
        dd: "%d days",
        M:  "1 month",
        MM: "%d months",
        y:  "1 year",
        yy: "%d years"
    }
});

moment.updateLocale('zh-tw', {
    relativeTime : {
        future: "已 %s",
    }
});

/** Parse the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
    const area_id = parseInt(lbeacon_uuid.slice(0,4))
    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
    const yy = parseInt(lbeacon_uuid.slice(-8));
    return [yy, xx, area_id];
};

const calculatePosition = (item) => {
    const area_id = parseInt(item.lbeacon_uuid.slice(0,4))
    const xx = item.base_x;
    const yy = item.base_y;

    return [yy, xx, area_id]
};

const getTrackingData = (request, response) => {
    const locale = request.body.locale || 'en'
    let {
        user,
        areaId,
        key
    } = request.body

    /** The user's authenticated area id */
    let userAuthenticatedAreasId= user.areas_id

    /** User interface's current area id */
    const currentAreaId = areaId.toString()

    pool.query(dbQueries.getTrackingData(
        userAuthenticatedAreasId,
        key
    ))        
        .then(res => {

            console.log('get tracking data')

            /** Filter the objects that do no belong the area */
            const toReturn = res.rows
            .filter(item => item.mac_address)
            .map((item, index) => {

                /** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
                let lbeacon_coordinate = item.lbeacon_uuid ? parseLbeaconCoordinate(item.lbeacon_uuid) : null;

                item.lbeacon_coordinate = lbeacon_coordinate

                item.currentPosition = item.lbeacon_uuid ? calculatePosition(item) : null;

                let lbeaconAreaId = lbeacon_coordinate ? lbeacon_coordinate[2] : null

                let isLbeaconMatchArea = lbeaconAreaId == currentAreaId

                let isUserSObject = userAuthenticatedAreasId.includes(parseInt(item.area_id))

                /** Flag the object that belongs to the current area or to the user's authenticated area */
                item.isMatchedObject = isUserSObject && isLbeaconMatchArea

                /** Set the boolean if the object's last_seen_timestamp is in the specific time period */
                let isInTheTimePeriod = moment().diff(item.last_reported_timestamp, 'seconds') 
                    < process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC;

                    /** Set the boolean if its rssi is below the specific rssi threshold  */
                let isMatchRssi = item.rssi > process.env.RSSI_THRESHOLD ? 1 : 0;
                
                /** Flag the object that satisfied the time period and rssi threshold */
                item.found = isInTheTimePeriod && isMatchRssi 

                /** Set the residence time of the object */
                item.residence_time = item.found 
                    ? moment(item.last_seen_timestamp).locale(locale).from(moment(item.first_seen_timestamp)) 
                    : item.last_reported_timestamp 
                        ? moment(item.last_reported_timestamp).locale(locale).fromNow()
                        : 'N/A'      

                /** Flag the object's battery volumn is limiting */
                if (item.battery_voltage >= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)                    
                    && item.found) {
                        item.battery_indicator = 3;
                } else if (item.battery_voltage < parseInt(process.env.BATTERY_VOLTAGE_INDICATOR) && item.battery_voltage > 0 && item.found) {
                    item.battery_indicator = 2;
                } else {
                    item.battery_indicator = 0
                }

                /** Delete the unused field of the object */
                delete item.first_seen_timestamp
                // delete item.last_seen_timestamp
                delete item.panic_violation_timestamp
                delete item.lbeacon_uuid
                delete item.monitor_type
                delete item.base_x
                delete item.base_y

                return item
            })
        response.status(200).json(toReturn)

    }).catch(err => {
        console.log(`get tracking data failed ${err}`)
    })
}

module.exports = {
    getTrackingData
}