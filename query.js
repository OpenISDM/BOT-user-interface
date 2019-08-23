require('dotenv').config();
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)

const moment = require('moment-timezone');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');


const pdf = require('html-pdf');
const csv=require('csvtojson')
const queryUserInfo = require('./queryUserInfo/queryUserInfo').queryUserInfo
// const Userconfig = require('./src/js/config')



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
            if(panicTime < 30){
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

const getBranches = (request, response) => {
    const csvFilePath='./src/csv/branches.csv';
    csv({
        noheader:true,
        output: "line"
    })
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        var branchList = {}
        for(var row of jsonObj){

            var splitted = row.split(',')
            var branch = splitted[0]
            branchList[branch] = []
            for(var item of splitted.slice(1)){
                console.log(item)
                if(item !== ''){
                    branchList[branch].push(item)
                }
                
            }
            
        }
        response.status(200).json(branchList)
        
    })
}

const getObjectTable = (request, response) => {
    pool.query(queryType.query_getObjectTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        } else {
            console.log('Get objecthtml data!')
        
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
        console.log('Get lbeaconhtml data!')
    
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
            console.log('Get gatewayhtml data!')
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

const addUserSearchHistory = (request, response) => {
    const { username, history } = request.body;
    pool.query(queryType.query_addUserSearchHistory(username, history), (error, results) => {
        if (error) {
            console.log(error)
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

const  generatePDF = (request, response) => {
    var {foundResult, notFoundResult, user, save} = request.body
    pool.query(`select shift from user_table where name = '${user}'`,(error, results) => {
        var shiftType = results.rows[0] ? results.rows[0].shift : null
        var header = "<h1 style='text-align: center;'>" + "checked by " + user + "</h1>"
        var timestamp = "<h3 style='text-align: center;'>" + moment().format('LLLL') + "</h3>"
        var shift = shiftType ? ("<h3 style='text-align: center;'> Shift: " + shiftType + "</h3>") : ''

        var types = ["Name", "Type", "ACN", "Location"]
        var attributes = ["name", "type", "access_control_number", "location_description"]

        var title = "Found Results"
        var lists = foundResult
        var foundTable = generateTable(title, types, lists, attributes)


        var title = "Not Found Results"
        var lists = notFoundResult
        var notFoundTable = generateTable(title, types, lists, attributes)
        var options = {
            "format": "A4",
            "orientation": "landscape",
            "border": {
                "top": "0.3in",            // default is 0, units: mm, cm, in, px
                "right": "2in",
                "bottom": "0.3in",
                "left": "2in"
            },
            "timeout": "120000"
        };
        var html = header + timestamp + shift + foundTable + notFoundTable
        var filePath = `save_file_path/${user}_${moment().format('x')}.pdf`
        pdf.create(html, options).toFile(filePath, function(err, result) {
            if (err) return console.log(err);

            var submit_time = moment().format()
            var user_id = 1234
            var file_path = filePath
            console.log(shift)
            if(save){
                console.log(queryType.query_addShiftChangeRecord(submit_time, user_id, file_path, shiftType))
                pool.query(queryType.query_addShiftChangeRecord(submit_time, user_id, file_path, shiftType), (error, results) => {
                    if (error) {
                        console.log('save pdf file fails ' + error)
                    } else {
                        console.log('save pdf file success')
                        response.status(200).json(filePath)
                    }
                })   
            }else{
                response.status(200).json(filePath)
            }
            
        });
    })
    

    function generateTable(title, types, lists, attributes){
        if(Object.keys(lists).length === 0){
            return ''
        }else{
            var html = "<div>"
            html += "<h2 style='text-align: center;'>" + title + "</h2>"
            html += "<table border='1' style='width:100%;word-break:break-word;'>";
            html += "<tr>";
            for(var i in types){
                html += "<th >" + types[i] + "</th>";
            }
            for (var i in lists){
                html += "<tr>";
                for(var j of attributes){
                    html += "<td>"+lists[i][j]+"</td>";
                }
            }
            html += "</table></div>"

            return html
        }
        
    }
}

module.exports = {
    getTrackingData,
    getBranches,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    editObject,
    addObject,
    editObjectPackage,
    addUserSearchHistory,
    editLbeacon,
    generatePDF,
    
}