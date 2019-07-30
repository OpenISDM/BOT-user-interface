require('dotenv').config();
const moment = require('moment-timezone');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');

var pdf = require('html-pdf');

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)



const getTrackingData = (request, response) => {

    pool.query(queryType.query_getTrackingData(), (error, results) => {        
        if (error) {
            console.log("Get trackingData fails : " + error)
        } else {
            console.log('Get tracking data!')
        }
        response.status(200).json(results)
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
            console.log('Get user info success')
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
    table += "<th >Mac Address</th>";
    table += "<th >Type</th>";
    table += "<th >ACN-number</th>";
    table += "</tr>";

    for (var i of request.body){
        table += "<tr>";
        table += "<td>"+i.mac_address+"</td>";
        table += "<td>"+i.type+"</td>";
        table += "<td>"+i.access_control_number+"</td>";
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