require('dotenv').config();
const moment = require('moment-timezone');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');

var pdf = require('html-pdf');

// const Userconfig = require('./src/js/config')

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)

function GetTimeStampDifference(timestamp1, timestamp2){
    return timestamp1 - timestamp2;
}

function UuidToLocation(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        try{
            const zz = lbeacon_uuid.slice(6,8);
            const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
            const yy = parseInt(lbeacon_uuid.slice(-8));
            return [yy, xx];
        }catch{
            return null
        }
        
}

const getTrackingData = (request, response) => {

    pool.query(queryType.query_getTrackingData(), (error, results) => {        
        var data = results.rows
        var processedData = {}
        // console.log(data)
        for(var i in data){
            let item = data[i]
            let now = moment().format('x')
            let notFoundTime = GetTimeStampDifference(now , moment(item.last_seen_timestamp).format('x'))
            if(notFoundTime > 30 * 1000){
                item['found'] = 0
            }else{
                item['found'] = 1
            }

            let panicTime = GetTimeStampDifference(now, moment(item.panic_timestamp).format('x'))
            if(panicTime < 300000){
                item['panic_button'] = 1
            }else{
                item['panic_button'] = 0
            }

            let stillUnderGeofenceViolation = GetTimeStampDifference(moment(item.geofence_violation_timestamp).format('x'), moment(item.first_seen_timestamp).format('x'))
            let geofenceViolationTime = GetTimeStampDifference(moment().format('x'), moment(item.geofence_violation_timestamp).format('x'))
            if(geofenceViolationTime > 30 * 1000 && stillUnderGeofenceViolation > 0){
                item['geofence_violation'] = 1
            }else{
                item['geofence_violation'] = 0
            }
            item['currentPosition'] = UuidToLocation(item.lbeacon_uuid)
            delete item['geofence_violation_timestamp']
            delete item['first_seen_timestamp']
            delete item['last_seen_timestamp']
            delete item['panic_timestamp']
        }
        

        if (error) {
            console.log("Get trackingData fails : " + error)
        } else {
            // console.log('Get tracking data!')
        }
        response.status(200).json(data)
    })
}

const getObjectTable = (request, response) => {
    pool.query(queryType.query_getObjectTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        } else {
            console.log('Get objectTable data!')
        
            results.rows.map(item => {
                const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
                item.last_report_timestamp = localLastReportTimeStamp.format();
            })
            response.status(200).json(results)
        }
    })
}

const getLbeaconTable = (request, response) => {
    pool.query(queryType.query_getLbeaconTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        }
        console.log('Get lbeaconTable data!')
    
        results.rows.map(item => {
            item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format();
        })
        response.status(200).json(results)
    })
}

const getGatewayTable = (request, response) => {
    pool.query(queryType.query_getGatewayTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)                
        } else {
            console.log('Get gatewayTable data!')
        }

        results.rows.map(item => {
            item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format()
        })
        response.status(200).json(results)
    })
}

const getGeofenceData = (request, response) => {
    pool.query(queryType.query_getGeofenceData, (error, results) => {
        if (error) {
            console.log("Get Geofence Data fails: " + error)
        } else {
            console.log("Get Geofence Data")
        }

        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.receive_time).tz(process.env.TZ);
            item.receive_time = localLastReportTimeStamp.format();
        })
        response.status(200).json(results);
        
    })
}

const editObject = (request, response) => {

    const formOptions = request.body.formOption
    console.log(formOptions)
    for(var i in formOptions){
        let formOption = formOptions[i]
        console.log(formOption)
        pool.query(queryType.query_editObject(formOption), (error, results) => {
            if (error) {
                console.log("Edit Object Fails: " + error)
            } else {
                console.log("Edit Object Success");
            }
            
            response.status(200).json(results)

        })
    }
    
}

const addObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_addObject(formOption), (error, results) => {
        if (error) {
            console.log("Add Object Fails: " + error)
        } else {
            console.log("Add Object Success");
        }
        
        response.status(200).json(results)

    })
}

const editObjectPackage = (request, response) => {
    const body = request.body

    pool.query(queryType.query_editObjectPackage(body), (error, results) => {
        if (error) {
            console.log(error)
        } else {
            console.log('success')
            response.status(200).json(results)
        } 
    })
}

const signin = (request, response) => {
    const username = request.body.username
    const pwd = request.body.password

    pool.query(queryType.query_signin(username), (error, results) => {
        const hash = results.rows[0].password
        if (error) {
            console.log("Login Fails: " + error)
        } else {

            if (results.rowCount < 1) {
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {
                if (bcrypt.compareSync(pwd, hash)) {
                    response.json({
                        authentication: true,
                    })
                } else {
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        }

    })

}

const signup = (request, response) => {
    const { username, password } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    const signupPackage = {
        username: username,
        password: hash,
    }
    pool.query(queryType.query_signup(signupPackage), (error, results) => {

        if (error) {
            console.log("Login Fails!")
        } else {
            console.log('Sign up Success')
        }

        response.status(200).json(results)
    })

}

const userInfo = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.query_getUserInfo(username), (error, results) => {
        if (error) {
            console.log('Get user info Fails!')
        } else {
            // console.log('Get user info success')
        }
        response.status(200).json(results)
    })
}

const userSearchHistory = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.query_getUserSearchHistory(username), (error, results) => {
        if (error) {
            console.log('Get user search history Fails')
        } else {
            console.log('Get user search history success')
        }
 
        response.status(200).json(results)
    })
}

const addUserSearchHistory = (request, response) => {
    const { username, history } = request.body;
    pool.query(queryType.query_addUserSearchHistory(username, history), (error, results) => {
        if (error) {
            console.log('Add user search history fails')
        } else {
            console.log('Add user searech history success')
        }
        response.status(200).json(results)
    })

}

const editLbeacon = (request, response) => {
    const low = request.body.formOption.low_rssi || null
    const med = request.body.formOption.med_rssi || null
    const high = request.body.formOption.high_rssi || null
    const uuid = request.body.formOption.uuid

    pool.query(queryType.query_editLbeacon(uuid, low, med, high), (error, results) => {
        if (error) {
            console.log('Edit lbeacon fails ' + error)
        } else {
            console.log('Edit lbeacon success')
        }
        response.status(200).json(results)
    })
}

const  QRCode = (request, response) => {
    var table = "<table border='1' style='width:100%;word-break:break-word;'>";
    console.log(request.body)
    table += "<tr>";
    table += "<th >Name</th>";
    table += "<th >Type</th>";
    table += "<th >ACN-number</th>";
    table += "<th >Location</th>";
    table += "</tr>";

    for (var i of request.body){
        table += "<tr>";
        table += "<td>"+i.name+"</td>";
        table += "<td>"+i.type+"</td>";
        table += "<td>"+i.access_control_number+"</td>";
        table += "<td>near "+i.location_description+"</td>";
        table += "</tr>";
    }
    table += "</table>"
    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
            "top": "0.1in",
        },
        "timeout": "120000"
    };
    var filePath = 'save_file_path/test.pdf'
    pdf.create(table, options).toFile(filePath, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
        response.status(200).json(filePath)
    });
}

module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    editObject,
    addObject,
    editObjectPackage,
    signin,
    signup,
    userInfo,
    userSearchHistory,
    addUserSearchHistory,
    editLbeacon,
    QRCode
    
}