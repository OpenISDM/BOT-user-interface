require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');
const pdf = require('html-pdf');
const csv =require('csvtojson')
var exec = require('child_process').execFile;
const fs = require('fs')
const path = require('path')
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const {
    LBEACON_HEALTH_STATUS_TIME_INTERVAL_UNIT,
    LBEACON_HEALTH_STATUS_TIME_INTERVAL
} = process.env


const pool = new pg.Pool(config)

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
    }
})

const upload = multer({ storage: storage }).single('file')

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
const getTrackingData = (request, response) => {
    const locale = request.body.locale || 'en'
    let {
        user,
        areaId
    } = request.body

    /** The user's authenticated area id */
    let userAuthenticatedAreasId= user.areas_id

    /** User interface's current area id */
    const currentAreaId = areaId.toString()

    pool.query(queryType.getTrackingData(
        userAuthenticatedAreasId,
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

                /** Flag the object that is violate geofence */
                item.isViolated = item.notification ? 1 : 0;

                /** Flag the object that is on sos */
                item.panic = moment().diff(item.panic_violation_timestamp, 'second') 
                    < process.env.PANIC_TIME_INTERVAL_IN_SEC ? 1 : 0

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
               
                /** format timestamp*/
                item.reserved_timestamp_LT = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('LT');
                item.reserved_timestamp_MMDD = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('MM/DD');
                item.reserved_timestamp_final = moment(item.reserved_timestamp).add(30,"minutes").format("LT");
                item.reserved_timestamp = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('lll');

                return item
            })

        response.status(200).json(toReturn)

    }).catch(err => {
        console.log(`get tracking data failed ${err}`)
    })
}

const getObjectTable = (request, response) => {
    let { 
        locale, 
        areas_id,
        objectType 
    } = request.body

    pool.query(queryType.getObjectTable(objectType, areas_id))       
        .then(res => {
            console.log('get object table succeed')
            res.rows.map(item => {
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })

            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get object table failed ${err}`)
        })     
}

const getTrackingTableByMacAddress = (request, response) => {
    let{ locale, object_mac_address} = request.body
    pool.query(queryType.getTrackingTableByMacAddress(object_mac_address))
        .then(res => {
            console.log("get tracking table by mac address")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('get trackingTableByMacAddress: ' + err)
        })
}

const getLocationHistory = (request, response) => {
    let {
        key,
        startTime,
        endTime,
        mode
    } = request.body

    pool.query(queryType.getLocationHistory(key, startTime, endTime, mode))
    .then(res => {
        console.log(`get location history by ${mode} succeed`)
        response.status(200).json(res)
    })
    .catch(err => {
        console.log(`get location history by ${mode} failed ${err}`)
    })
}

const getImportPatient = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.getImportPatient())       
        .then(res => {
            console.log('get ImportPatient data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("get ImportPatient fails: " + err)
        })     
}

const getImportTable = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.getImportTable())       
        .then(res => {
            console.log('Get getImportTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get getImportTable fails: " + err)
        })     
}

const getImportData = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    pool.query(queryType.getImportData(formOption))       
        .then(res => {
            console.log('Get getImportData data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get getImportData fails: " + err)
        })     
}

const addAssociation = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    pool.query(queryType.addAssociation(formOption))       
        .then(res => {
            console.log('edit import data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("edit import data fails" + err)
        })     
}


const addAssociation_Patient = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    pool.query(queryType.addAssociation_Patient(formOption))       
        .then(res => {
            console.log('add Association Patient data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("add Association Patient fails" + err)
        })     
}

const cleanBinding = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    formOption.map( item => {
       pool.query(queryType.cleanBinding(item))       
        .then(res => {
            console.log('clean Binding')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("clean Binding fails: " + err)
        })      
    })
}

const setLocaleID = (request, response) => {
    const userID = request.body.userID
    const lang = request.body.lang

    pool.query(queryType.setLocaleID(userID,lang))
        .then(res => {
            console.log("set Locale ID success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("set Locale ID Fails: " + err)
        })
}


const editObject = (request, response) => {
    const formOption = request.body.formOption
    let {
        area_id
    } = formOption

    pool.query(queryType.editObject(formOption))
        .then(res => {
            console.log("edit object succeed");
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_object -f area_one -a ${area_id}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting failed ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting succeed`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
        })
        .catch(err => {
            console.log(`edit object failed ${err}`)
        })
}

const editImport = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.editImport(formOption))
        .then(res => {
            console.log("Edit Import success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Edit Import Fails: " + err)
        })
}

const editPatient = (request, response) => {
    const formOption = request.body.formOption
    let {
        area_id
    } = formOption
    pool.query(queryType.editPatient(formOption))
        .then(res => {
            console.log("edit register succeed");
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_object -f area_one -a ${area_id}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting fails ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting success`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
        })
        .catch(err => {
            console.log(`edit register failed ${err}`)
        })
}

const objectImport = (request, response) => {
    const idPackage = request.body.newData
       pool.query(queryType.objectImport(idPackage))
        .then(res => {
            console.log("import objects success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("import objects Fails: " + err)
        })   


}

const addObject = (request, response) => {
    const formOption = request.body.formOption
    
    pool.query(queryType.addObject(formOption))
        .then(res => {
            console.log("add object succeed");
            pool.query(queryType.addImport(formOption))
                .then(res => {
                    console.log("add import succeed");
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log(`add object failed ${err}`)
                })
        })
        .catch(err => {
            console.log(`add object failed ${err}`)

        })
}

const addPatient = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.addPatient(formOption))
        .then(res => {
            console.log("add patient succeed");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`add patient failed ${err}`)
        })
}



const editObjectPackage = (request, response) => {
    const { 
        formOption, 
        username, 
        pdfPackage, 
        reservedTimestamp, 
        locale
    } = request.body
    pool.query(queryType.addEditObjectRecord(formOption, username, pdfPackage.path))
        .then(res => {
            const record_id = res.rows[0].id
            console.log('add edited object record succeed')
            pool.query(queryType.editObjectPackage(formOption, username, record_id, reservedTimestamp))
                .then(res => {
                    console.log('edit object package succeed')
                    if (pdfPackage) {
                        pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
                            if (err) return console.log(`edit object package error ${err}`);
                        
                            console.log("pdf create succeed");
                            response.status(200).json(pdfPackage.path)
                        });
                    } else {
                        response.status(200).json()
                    }
                })
                .catch(err => {
                    console.log(`edit object package failed ${err}`)
                })
        })
        .catch(err => {
            console.log(`edit object package failed ${err}`)
        })
}

const signin = (request, response) => {
    let { 
        password,
        username
    } = request.body
    username = username.toLowerCase()


    pool.query(queryType.signin(username))
        .then(res => {
            if (res.rowCount < 1) {
                console.log(`signin failed: username or password is incorrect`)
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {
                if (bcrypt.compareSync(password, res.rows[0].password)) {
                    let { 
                        name, 
                        roles, 
                        permissions,
                        mydevice, 
                        freq_search_count,
                        areas_id,
                        id,
                        main_area,
                        locale_id,
                        locale
                    } = res.rows[0]

                    if (main_area && !areas_id.includes(main_area)) {
                        areas_id.push(main_area.toString())
                    }

                    let userInfo = {
                        name,
                        myDevice: mydevice || [],
                        roles,
                        permissions,
                        freqSearchCount: freq_search_count,
                        id,
                        areas_id,
                        main_area,
                        locale_id,
                        locale
                    }

                    request.session.userInfo = userInfo
                    response.json({
                        authentication: true,
                        userInfo
                    })
                    pool.query(queryType.setVisitTimestamp(username))
                        .then(res =>  console.log(`sign in success: ${name}`))
                        .catch(err => console.log(`set visit timestamp fails ${err}`))

                } else {
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        })
        .catch(err => {
            console.log(`sigin fails ${err}`)       
        })
}

const editPassword = (request, response) => {
    const { 
        user_id, 
        password
    } = request.body;    

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    pool.query(queryType.editPassword(user_id,hash)) 
        .then(res => {
            console.log('edit Password success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`edit Password failer ${err}`)
        })  
 
}

const setUserInfo = (request, response) => { 
    var {
        user
    } = request.body
    pool.query(queryType.setUserInfo(user))
        .then(res => {
            console.log(`set user info succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set user info failed ${err}`)
        })
}

const setUserSecondaryArea = (request, response) => {
    const {
        user
    } = request.body
    pool.query(queryType.setUserSecondaryArea(user))
        .then(res => {
            console.log(`set secondary area succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set secondary area failed ${err}`)
        })
}

const getEditObjectRecord = (request, response) => {
    const { locale } = request.body
    pool.query(queryType.getEditObjectRecord())
        .then(res => {
            console.log('get object edited record')

            res.rows.map(item => {
                item.edit_time = moment.tz(item.edit_time, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get object edited record failed ${err}`)
        })
}

const getUserInfo = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.getUserInfo(username))
        .then(res => {
            console.log('Get user info')
            response.status(200).json(res)
        })
        .catch(error => {
            console.log('Get user info Fails error: ' + error)
        })
}

const addUserSearchHistory = (request, response) => {
    let { 
        username, 
        keyType, 
        keyWord 
    } = request.body;

    pool.query(queryType.addUserSearchHistory(username, keyType, keyWord))
        .then(res => {
            console.log('add user searech history success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`add user search history fails ${err}`)
        })
}

const generatePDF = (request, response) => {
    let { pdfPackage } = request.body
    /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
    pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(pdfPackage.path, function(err, result) {
        if (err) return console.log("generate pdf error: ",err);
    
        console.log("pdf create");
        response.status(200).json(pdfPackage.path)
    });
}

const addShiftChangeRecord = (request, response) => {
    let { 
        userInfo, 
        pdfPackage,
        shift 
    } = request.body

    /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
    pool.query(queryType.addShiftChangeRecord(userInfo, pdfPackage.path, shift))
        .then(res => {
             /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
            pdf.create(pdfPackage.pdf, pdfPackage.options ).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
                if (err) return console.log(`add shift change record failed ${err}`);
            
                console.log("pdf create succeed");
                response.status(200).json(pdfPackage.path)
            });
        })
        .catch(err => {
            console.log(`pdf create failed: ${err}`)
        })

}

const modifyUserDevices = (request, response) => {
    const {username, mode, acn} = request.body
    pool.query(queryType.modifyUserDevices(username, mode, acn), (error, results) => {
        if (error) {
            console.log("modifyUserDevices error: ", err)
        } else {
            console.log('Modify Success')
        }
        
        response.status(200).json(results)
    })
}

const modifyUserInfo = (request, response) => {
    const {username, info} = request.body
    pool.query(queryType.modifyUserInfo(username, info))
        .then(res => {
            console.log('modify user info success')
            response.status(200).send('ok')
        })
        .catch(err => {
            console.log(`modify user info fail ${err}`)
        })
    
}

const getShiftChangeRecord = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.getShiftChangeRecord())
        .then(res => {
            console.log('get shift change record succeed')
            res.rows.map(item => {
                item.submit_timestamp = moment.tz(item.submit_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get shift change record failed ${err}`)
        })
}

const validateUsername = (request, response) => {
    let { username } = request.body
    pool.query(queryType.validateUsername(username))
        .then(res => {
            let precheck = false
            res.rowCount === 0 ? precheck = true : precheck = false;
            response.status(200).json({precheck})
        })
        .catch(err => {
            console.log('validateUsername error: ', err)
        })
}


const getUserList = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.getUserList())
        .then(res => {
            console.log('get user list succeed')
            res.rows.map(item => {
                item.last_visit_timestamp = 
                    item.last_visit_timestamp && 
                    moment.tz(item.last_visit_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT);
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ)
                    .locale(locale)
                    .format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get user list failed ${err}`)
        })
}

const getRoleNameList = (request, response) => {
    pool.query(queryType.getRoleNameList())
        .then(res => {
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('getRoleNameList error: ', err)
        })
    
}

const deleteEditObjectRecord = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.deleteEditObjectRecord(idPackage))
        .then(res => {
            pool.query(`UPDATE object_table SET note_id = null WHERE note_id IN (${idPackage.map(id => `${id}`)})`)
                .then(res1 => {
                    console.log('delete edit object record success')
                    fs.unlink(path.join(process.env.LOCAL_FILE_PATH, res.rows[0].path), (err) => {
                        if(err){
                            console.log('err when deleting files', err)
                        }
                        response.status(200).json('success')
                        
                    })
                })
                .catch(err => {
                    console.log('delete edit object record fail: ' + err)
                })
        })
        .catch(err => {
            console.log('deleteEditObjectRecord error: ', err)
        })
}




const deleteShiftChangeRecord = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.deleteShiftChangeRecord(idPackage))
    .then(res => {
                console.log('delete shift change record success')
                fs.unlink(path.join(process.env.LOCAL_FILE_PATH, res.rows[0].file_path), (err) => {
                    if(err){
                        console.log('err when deleting files', err)
                    }
                    response.status(200).json(res)
                    
                })
                
    })
    .catch(err => {
        console.log('deleteShiftChangeRecord error: ', err)
    })
}


const deletePatient = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.deletePatient(idPackage))
    .then(res => {
                console.log('deletePatient change record success')
                response.status(200).json(res)
    })
    .catch(err => {
        console.log('deletePatient error: ', err)
    })
}

const deleteDevice = (request, response) => {
    const { formOption } = request.body
    pool.query(queryType.deleteDevice(formOption))
        .then(res => {
            console.log('delete Device success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('deleteDevice error: ', err)
        })
}

const deleteImportData = (request, response) => {
    const { idPackage } = request.body 
        pool.query(queryType.deleteImportData(idPackage))
        .then(res => {
                    console.log('delete ImportData success')
                    response.status(200).json(res)
        })
        .catch(err => {
            console.log('deleteImportData error: ', err)
        })
}


const getMonitorConfig = (request, response) => {
    let {
        type,
    } = request.body
   
    pool.query(queryType.getMonitorConfig(type))
        .then(res => {
            console.log(`get ${type} success`)
            let toReturn = res.rows
            .map(item => {
                item.start_time = item.start_time.split(':').filter((item,index) => index < 2).join(':')
                item.end_time = item.end_time.split(':').filter((item,index) => index < 2).join(':')
                return item
            })
            response.status(200).json(toReturn)
        })
        .catch(err => {
            console.log(`get ${type} fail ${err}`)
        })
}

const setMonitorConfig = (request, response) =>{
    let { monitorConfigPackage } = request.body 
    pool.query(queryType.setMonitorConfig(monitorConfigPackage))
        .then(res => {
            console.log(`set monitor config success`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set monitor config fail ${err}`)
        })
}

const checkoutViolation = (request, response) => {
    let { 
        mac_address,
        monitor_type
    } = request.body
    pool.query(queryType.checkoutViolation(mac_address, monitor_type))
        .then(res => {
            console.log(`checkout violation`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`checkout violation fail: ${err}`)
        })
}

const confirmValidation = (request, response) => {
    let { 
        username, 
        password 
    } = request.body 
    pool.query(queryType.confirmValidation(username))
        .then(res => {
            if (res.rowCount < 1) {
                console.log(`confirm validation failed: incorrect`)
                response.json({
                    confirmation: false,
                    message: 'incorrect'
                })
            } else {
                const hash = res.rows[0].password
                
                if (bcrypt.compareSync(password, hash)) {
                    let { 
                        roles, 
                    } = res.rows[0] 
                    /** authenticate if user is care provider */
                    if (roles.includes('3') || roles.includes('4')) {

                        console.log(`confirm validation succeed`)
                        response.json({
                            confirmation: true,
                        })
                    } else {

                        console.log(`confirm validation failed: authority is not enough`)
                        response.json({
                            confirmation: false,
                            message: 'authority is not enough'
                        })
                    }
                } else {
                    console.log(`confirm validation failed: password is incorrect`)
                    response.json({
                        confirmation: false,
                        message: 'password incorrect'
                    })
                }
            }
        })
        .catch(err => {
            console.log(`confirm validation fails ${err}`)
        })
}

const getGeofenceConfig = (request, response) => {
    let { areaId } = request.body
    pool.query(queryType.getGeofenceConfig(areaId))
        .then(res => {
            res.rows.map(item => {
                item.start_time = item.start_time.split(':').filter((item,index) => index < 2).join(':')
                item.end_time = item.end_time.split(':').filter((item,index) => index < 2).join(':')
                item.parsePerimeters = parseGeoFenceConfig(item.perimeters)
                item.parseFences = parseGeoFenceConfig(item.fences)
            })
            console.log("get geofence config success")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get geofence config fail ${err}`)
        })
}

const setGeofenceConfig = (request, response) => {
    let {
        monitorConfigPackage,
    } = request.body
    let { 
        area_id 
    } = monitorConfigPackage

    pool.query(queryType.setGeofenceConfig(monitorConfigPackage))
        .then(res => {
            console.log(`set geofence config success`)
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_list -f area_one -a ${area_id}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting fails ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting success`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
          
        })
        .catch(err => {
            console.log(`set geofence config fail ${err}`)
        })
}

const addGeofenceConfig = (request, response) => {

    let {
        monitorConfigPackage,
    } = request.body
    let area_id = monitorConfigPackage.area.id
    
    pool.query(queryType.addGeofenceConfig(monitorConfigPackage))
        .then(res => {
            console.log(`add geofence config success`)
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_list -f area_one -a ${area_id}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting fails ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting success`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
        })
        .catch(err => {
            console.log(`add geofence config fail: ${err}`)
        })
}

const setMonitorEnable = (request, response) => {
    const {
        enable,
        areaId,
        type
    } = request.body

    pool.query(queryType.setMonitorEnable(enable, areaId, type))
        .then(res => {
            console.log(`set geofence enable success`)
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_list -f area_one -a ${areaId}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting fails ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting success`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const addMonitorConfig = (request, response) => {
    let {
        monitorConfigPackage,
    } = request.body

    let {
        type
    } = monitorConfigPackage
    pool.query(queryType.addMonitorConfig(monitorConfigPackage))
        .then(res => {
            console.log(`add ${type} config success`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`add ${type} fail ${err}`)
        })
}

const deleteMonitorConfig = (request, response) => {
    let {
        monitorConfigPackage,
    } = request.body
    pool.query(queryType.deleteMonitorConfig(monitorConfigPackage))
        .then(res => {
            console.log(`delete ${monitorConfigPackage.type.replace(/_/g, ' ')}`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete monitor config fail: ${err}`)
        })
}

/** Parse the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
    const area_id = parseInt(lbeacon_uuid.slice(0,4))
    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
    const yy = parseInt(lbeacon_uuid.slice(-8));
    return [yy, xx, area_id];
}

const calculatePosition = (item) => {
    const area_id = parseInt(item.lbeacon_uuid.slice(0,4))
    const xx = item.base_x;
    const yy = item.base_y;

    return [yy, xx, area_id]
}

/** Parse geo fence config */
const parseGeoFenceConfig = (field = []) => {
    let fieldParse = field.split(',')
    let number = parseInt(fieldParse[0])
    let lbeacons = fieldParse
        .filter((item, index) => index > 0  && index <= number)
    let rssi = fieldParse[number + 1]
    let coordinates = lbeacons.map(item => {
        const area_id = parseInt(item.slice(0,4))
        const xx = parseInt(item.slice(12,20));
        const yy = parseInt(item.slice(-8));
        return [yy, xx]
    })
    return {
        number,
        lbeacons,
        rssi,
        coordinates
    }
}

/** Check tracking data match the current UI area */
const checkMatchedObject = (item, userAuthenticatedAreasId, currentAreaId) => {

    /** If the current area id is the user's authenticated area id */
    let isInUserSAuthArea = userAuthenticatedAreasId.includes(parseInt(currentAreaId))

    /** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
    let lbeacon_coordinate = item.lbeacon_uuid ? parseLbeaconCoordinate(item.lbeacon_uuid) : null;

    item.lbeacon_coordinate = lbeacon_coordinate

    /** Set the object's location in the form of lbeacon coordinate parsing by lbeacon uuid  */
    item.currentPosition = item.lbeacon_uuid ? calculatePosition(item) : null;

    /** Set the lbeacon's area id from lbeacon_coordinate*/
    let lbeacon_area_id = item.lbeacon_uuid ? lbeacon_coordinate[2] : null;

    /** Set the boolean if the object scanned by Lbeacon is matched the current area */
    let isMatchedArea = lbeacon_area_id == parseInt(currentAreaId)

    /** Set the boolean if the object belong to the user's authenticated area id */
    let isUserSObject = userAuthenticatedAreasId.includes(parseInt(item.area_id))

    /** Set the boolean if the object belong to the current area */
    let isAreaSObject = item.area_id == parseInt(currentAreaId)

    /** Filter the object if the object scanned by the current area's Lbeacon */
    if (isMatchedArea) {

        /** Determine if the current area is the authenticated area */
        return isUserSObject
        if (isInUserSAuthArea) {

            /** Flag the object that belongs to the current area and to the user's authenticated area,
             * if the current area is the authenticated area */
            return isUserSObject
        } else {

            /** Flag the object that belongs to the user's authenticated area, 
             * if the current area is not the authenticated area */
            return isUserSObject
        }
    } else {
        return false
    }
}

const backendSearch = (request, response) => {
    
    const {keyType, keyWord, mac_address} = request.body
    var query = queryType.backendSearch(keyType, keyWord, mac_address)
    pool.query(query, (err, res) => {
        if(err){
            console.log(err)
        }else{
            var mac_addresses = res.rows.map((mac) => {
                return mac.mac_address
            })
            pool.query({
                text: `DELETE FROM search_result_queue where (key_type = $1 AND key_word = $2)`,
                values: [keyType, keyWord]
            }, (err, res) => {
                if(err){
                    console.log('delete same name')
                    console.log(err)
                }else{
                    pool.query(`DELETE FROM search_result_queue WHERE id NOT IN (SELECT id FROM search_result_queue ORDER BY query_time desc LIMIT 4)`, (err, res) => {
                        if(err){
                            console.log('delete exceed')
                            console.log(err)

                        }else{
                            pool.query(`SELECT pin_color_index FROM search_result_queue GROUP BY pin_color_index`, (err, res) => {
                                // console.log(res.rows)
                                var usedIndex = res.rows.map(i => {
                                    return i['pin_color_index']
                                })
                                var avail = [0, 1, 2, 3, 4].filter(function(i) {return usedIndex.indexOf(i) < 0;});
                                // console.log(avail)
                                if(err){
                                    console.log(err)
                                }else{
                                    pool.query(queryType.backendSearch_writeQueue(keyType, keyWord, mac_addresses, avail[0]), (err, res) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            response.send(mac_addresses)
                                        } 
                                    })        
                                }
                            })
                            
                        }
                    })
                        
                }
            })
        }
        
    })

}
const getSearchQueue = (request, response) => {

    pool.query(queryType.getSearchQueue())
        .then(res => {
            console.log(`get search queue succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get search queue failed ${err}`)
        })
    
}

const addBulkObject = (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const csvFilePath = req.file.path
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            pool.query(queryType.addBulkObject(jsonObj))
                .then(res => {
                    // console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        return res.status(200).send(req.file)
    })
}

const getAreaTable = (request, response) => {
    pool.query(queryType.getAreaTable())
        .then(res => {
            console.log("get area table succeed")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get area table failed ${err}`)
        })
}

const clearSearchHistory = () => {
    pool.query(queryType.clearSearchHistory()).then(res => {

    }).catch(err => {
        console.log('clearSearchHistory error: ', err)
    })
}
const getTransferredLocation = (request, response) => {
    pool.query(queryType.getTransferredLocation())
        .then(res => {
            response.status(200).json(res.rows)
        })
        .catch(err => {
            console.log('getTransferredLocation error: ', err)
        })
}
const modifyTransferredLocation = (request, response) => {
    const {type, data} = request.body
    let query = null
    if(type == 'add branch'){
        query = queryType.modifyTransferredLocation('add branch', data)
    }else if(type == 'rename branch'){
        query = queryType.modifyTransferredLocation('rename branch', data)
    }else if(type == 'remove branch'){
        query = queryType.modifyTransferredLocation('remove branch', data)
    }else if(type == 'add department'){
        query = queryType.modifyTransferredLocation('add department', data)
    }else if(type == 'rename department'){
        query = queryType.modifyTransferredLocation('rename department', data)
    }else if(type == 'remove department'){
        query = queryType.modifyTransferredLocation('remove department', data)
    }else{
        console.log('modifyTransferredLocation: unrecognized command type')
    }
    pool.query(query)
        .then(res => {
            response.status(200).json('ok')
        }).catch(err => {
            console.log('modifyTransferredLocation error: ', err)
        })
}

const getRolesPermission = (request, response) => {
    let query = queryType.getRolesPermission()
    pool.query(query).then(res => {
        response.status(200).json(res.rows[0])
    }).catch(err => {
        console.log('getRolesPermission error: ', err)
    })
}

const modifyPermission = (request, response) => {
    console.log(request.body)
    const {type, permissionType, id, name} = request.body
    let query = null
    if(type == 'add permission'){
        query = queryType.modifyPermission('add permission', 
        {
            permissionType,
            name
        })
    }else if(type == 'rename permission'){
        query = queryType.modifyPermission('rename permission', {
            permissionType,
            id,
            name
        })
    }else if(type == 'remove permission'){
        query = queryType.modifyPermission('remove permission', {
            id
        })
    }else{
        console.log('modifyPermission: unrecognized command type')
    }
    pool.query(query)
        .then(res => {
            response.status(200).json('ok')
        }).catch(err => {
            console.log('modifyPermission error: ', err)
        })
}

const modifyRolesPermission = (request, response) => {

    const {type, roleId, permissionId} = request.body
    let query = null
    if(type == 'add permission'){
        query = queryType.modifyRolesPermission('add permission', {
                roleId,
                permissionId
            })
        console.log('add')
    }else if(type == 'remove permission'){
        query = queryType.modifyRolesPermission('remove permission', {
                roleId,
                permissionId
            })
    }else{
        console.log('modifyPermission: unrecognized command type')
    }
    pool.query(query)
        .then(res => {
            response.status(200).json('ok')
        }).catch(err => {
            console.log('modifyPermission error: ', err)
        })
}

const addPatientRecord = (request, response) => {
    let {
        objectPackage
    } = request.body

    pool.query(queryType.addPatientRecord(objectPackage))
        .then(res => {
            console.log(`add patient record succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`add patient record failed ${err}`)
        })

}


module.exports = {
    getTrackingData,
    getObjectTable,
    getImportTable,
    getImportPatient,
    getImportData,
    getUserList,
    getRoleNameList,
    getAreaTable,
    getGeofenceConfig,
    getUserInfo,
    getShiftChangeRecord,
    getEditObjectRecord,
    getMonitorConfig,
    addShiftChangeRecord,
    addUserSearchHistory,
    addObject,
    addPatient,
    addBulkObject,
    addAssociation,
    addAssociation_Patient,
    cleanBinding,
    editObject,
    setLocaleID,
    editImport,
    editPatient,
    objectImport,
    editObjectPackage,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    deletePatient,
    deleteDevice,
    deleteImportData,
    signin,
    editPassword,
    generatePDF,
    modifyUserDevices,
    modifyUserInfo,
    validateUsername,
    setUserInfo,
    setMonitorConfig,
    setGeofenceConfig,
    checkoutViolation,
    confirmValidation,
    backendSearch,
    getSearchQueue,
    getTrackingTableByMacAddress,
    addGeofenceConfig,
    deleteMonitorConfig,
    addMonitorConfig,
    getTransferredLocation,
    modifyTransferredLocation,
    clearSearchHistory,
    setMonitorEnable,
    getRolesPermission,
    modifyPermission,
    modifyRolesPermission,
    clearSearchHistory,
    getLocationHistory,
    setUserSecondaryArea,
    addPatientRecord
}