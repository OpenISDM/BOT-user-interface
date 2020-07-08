require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const queryType = require ('./queryType');
const pg = require('pg');
const pdf = require('html-pdf');
const csv =require('csvtojson')
var exec = require('child_process').execFile;
const fs = require('fs')
const path = require('path')
const sha256 = require('sha256')
const encrypt = require('../api/config/encrypt');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}


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

const getObjectTable = (request, response) => {
    let { 
        locale, 
        areas_id,
        objectType 
    } = request.body
    pool.query(queryType.getObjectTable(objectType, areas_id))       
        .then(res => {
            console.log('Get objectTable data')
            res.rows.map(item => {
                item.registered_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })

            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get objectTable fails: " + err)
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

const getLbeaconTable = (request, response) => {

    let { locale } = request.body 
    pool.query(queryType.getLbeaconTable)
        .then(res => {
            console.log('get lbeacon table data succeed')
            res.rows.map(item => {
                /** Set the value that distinguish lbeacon is normal */
                item.isInHealthInterval = moment().diff(item.last_report_timestamp, 'minutes') 
                    < process.env.LBEACON_HEALTH_TIME_INTERVAL_IN_MIN;

                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);

            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log(`get lbeacon table failed ${err}`)
        })        
}

const getGatewayTable = (request, response) => {
    let { locale } = request.body

    pool.query(queryType.getGatewayTable)
        .then(res => {
            console.log(`get gateway table succeed`)
            res.rows.map(item => {
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log(`get gateway table failed ${err}`)                

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
            console.log("edit patient success");
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
            console.log(`edit patient fails ${err}`)
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

const editPassword = (request, response) => {
    const { 
        user_id, 
        password
    } = request.body;    

    const hash = encrypt.createHash(password);

    pool.query(queryType.editPassword(user_id,hash)) 
        .then(res => {
            console.log('edit Password success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`edit Password failer ${err}`)
        })  
 
}


const signup = (request, response) => {

    const { 
        name, 
        password, 
        roles,
        area_id,
    } = request.body;    
    
    const hash = encrypt.createHash(password);

    const signupPackage = {
        name,
        password: hash,
        area_id,
        username_sha256:sha256(name),
        password_sha256:sha256(password)
    }

    pool.query(queryType.signup(signupPackage))
        .then(res => {
            pool.query(queryType.insertUserData(name, roles, area_id))
                .then(res => {
                    console.log('sign up succeed') 
                    
                    //SETTING API Key 
                    const hash = encrypt.createHash(password);

                    pool.query(queryType.setAPIKey(name, hash)) 
                        .then(res => {
                            console.log(`set API Key success`)
                            response.status(200).json(res)
                        })
                        .catch(err => {
                            console.log(`set API Key failed ${err}`)
                        })
                })
                .catch(err => {
                    console.log(`sinup failed ${err}`)
                })
        })
        .catch(err => {
            console.log(`signup failed ${err}`)
        })
}


const deleteUser = (request, response) => {
    var username = request.body.username
    pool.query(queryType.deleteUser(username))
        .then(res => {
            console.log('delete user success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete user failer ${err}`)
        })  
}

const getMainSecondArea = (request, response) => { 
    var {
        username
    } = request.body

    pool.query(queryType.getMainSecondArea(username))
        .then(res => {
            console.log(`get Main Second Area success`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get Main Second Area ${err}`)
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

const editLbeacon = (request, response) => {
    const { formOption } = request.body
    pool.query(queryType.editLbeacon(formOption))
        .then(res => {
            console.log('Edit lbeacon success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('Edit lbeacon fails ' + err)
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


const deleteLBeacon = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.deleteLBeacon(idPackage))
        .then(res => {
            console.log('delete LBeacon record success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('deleteLBeacon error: ', err)
        })
}

const deleteGateway = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.deleteGateway(idPackage))
        .then(res => {
            console.log('delete Gateway record success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('deleteGateway error: ', err)
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



module.exports = {
    getObjectTable,
    getImportTable,
    getImportPatient,
    getImportData,
    getLbeaconTable,
    getGatewayTable,
    getUserList,
    getRoleNameList,
    getAreaTable,
    getGeofenceConfig,
    getUserInfo,
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
    editLbeacon,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    deletePatient,
    deleteDevice,
    deleteImportData,
    deleteLBeacon,
    deleteGateway,
    deleteUser,
    signup,
    editPassword,
    generatePDF,
    modifyUserDevices,
    modifyUserInfo,
    validateUsername,
    setUserInfo,
    getMainSecondArea,
    checkoutViolation,
    backendSearch,
    getSearchQueue,
    getTrackingTableByMacAddress,
    clearSearchHistory,
    setMonitorEnable,
    getRolesPermission,
    modifyPermission,
    modifyRolesPermission,
    clearSearchHistory,
    getLocationHistory,
    setUserSecondaryArea,
}