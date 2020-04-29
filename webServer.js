require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const httpsPort = 443;
const db = require('./web_server/query')
const path = require('path');
const fs = require('fs')
const http = require('http');
const https = require('https');
const session = require('express-session');
const pdf = require('html-pdf');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)
const pgSession = require('connect-pg-simple')(session);


// const csv = require('csv-parse')
const csv =require('csvtojson')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    store: new pgSession({
        pool,              // Connection pool
        tableName: 'session'   // Use another table-name than the default "session" one
    }),
    secret: 'super_hound',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000 * 300
    }
}))

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }    
};

// app.use(sessionChecker)


app.use(express.static(path.join(__dirname,'dist')));



// setInterval(db.clearSearchHistory, 86400*process.env.CLEAR_SEARCH_HISTORY_INTERVAL)

// app.get('/image/pinImage/:pinImage', (req, res) => {
//     res.sendFile(path.join(__dirname, 'src','img','colorPin',req.params['pinImage']));
// })

app.get(/^\/page\/(.*)/, sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})

// app.post('/data/getTrackingTableByMacAddress', db.getTrackingTableByMacAddress);

// app.post('/data/getImportTable', db.getImportTable);

// app.post('/data/getImportData', db.getImportData);

// app.post('/data/addAssociation', db.addAssociation);

// app.post('/data/addAssociation_Patient', db.addAssociation_Patient);

// app.post('/data/cleanBinding', db.cleanBinding);

// // app.post('/data/getTrackingData', db.getTrackingData);

// app.post('/data/editObject', db.editObject);

// app.post('/data/setLocaleID', db.setLocaleID);

// app.post('/data/editImport', db.editImport);

// app.post('/data/addPatientRecord', db.addPatientRecord)

// app.post('/data/setUserSecondaryArea', db.setUserSecondaryArea)

// app.post('/data/objectImport', db.objectImport);

// app.post('/data/addObject', db.addObject);

// app.post('/data/editObjectPackage', db.editObjectPackage)

app.post('/user/signin', db.signin)

// app.post('/user/editPassword', db.editPassword)

// app.post('/user/getUserInfo', db.getUserInfo)

// app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

// app.post('/data/generatePDF',db.generatePDF)

// app.post('/data/PDFInfo',db.getShiftChangeRecord)

// app.post('/data/modifyMyDevice', db.modifyUserDevices)

// app.post('/data/modifyUserInfo', db.modifyUserInfo)

// app.post('/data/getAreaTable', db.getAreaTable)

// app.post('/validation/username', db.validateUsername)

// app.post('/test/getRoleNameList', db.getRoleNameList)

// app.post('/test/getEditObjectRecord', db.getEditObjectRecord)

// app.post('/test/deleteEditObjectRecord', db.deleteEditObjectRecord)

// app.post('/test/deleteShiftChangeRecord', db.deleteShiftChangeRecord)

// app.post('/test/deletePatient', db.deletePatient)

// app.post('/test/deleteImportData', db.deleteImportData)

// app.post('/data/addShiftChangeRecord', db.addShiftChangeRecord)

// app.post('/data/checkoutViolation', db.checkoutViolation)

// app.post('/data/confirmValidation', db.confirmValidation)

// app.post('/data/getMonitorConfig', db.getMonitorConfig)

// app.post('/data/setMonitorConfig', db.setMonitorConfig)

// app.post('/data/addMonitorConfig', db.addMonitorConfig)

// app.post('/data/addGeofenceConfig', db.addGeofenceConfig)

// app.post('/data/getGeofenceConfig', db.getGeofenceConfig)

// app.post('/data/setGeofenceConfig', db.setGeofenceConfig)

// app.post('/data/setMonitorEnable', db.setMonitorEnable)

// app.post('/data/deleteMonitorConfig', db.deleteMonitorConfig)

// app.post('/data/backendSearch', db.backendSearch)

// app.post('/data/getSearchQueue', db.getSearchQueue)

// app.post('/data/getAreaTable', db.getAreaTable)

// app.get('/data/getTransferredLocation', db.getTransferredLocation)

// app.post('/data/modifyTransferredLocation', db.modifyTransferredLocation)

// app.get('/data/getRolesPermission', db.getRolesPermission)

// app.post('/data/modifyPermission', db.modifyPermission)

// app.post('/data/modifyRolesPermission', db.modifyRolesPermission)

// app.post('/data/getLocationHistory', db.getLocationHistory)

// app.post('/exportCSV', (req, res) => {
//     let {
//         header,
//         data,
//         filePackage
//     } = req.body

//     let folderPath = path.join(process.env.LOCAL_FILE_PATH, filePackage.directory)

//     if (!fs.existsSync(folderPath)){
//         fs.mkdirSync(folderPath);
//     }

//     let filePath = path.join(process.env.LOCAL_FILE_PATH, filePackage.path)
//     const csvWriter = createCsvWriter({
//         path: filePath,
//         header,
//         encoding: 'utf8'
//     });
    

//     csvWriter
//         .writeRecords(data)
//         .then((data)=> {
//             console.log('the csv file was written successfully')
//             res.status(200).json(data)
//         });
// })

// app.post('/exportPDF', (request, response) => {
//     const { 
//         pdfPackage, 
//     } = request.body
//     pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
//         if (err) return console.log(`edit object package error ${err}`);
    
//         console.log("pdf create succeed");
//         response.status(200).json(pdfPackage.path)
//     });
// })

// app.get(`/${process.env.DEFAULT_FOLDER}/:folder/:file`, (req, res) =>{
// 	res.sendFile(path.join(`${process.env.LOCAL_FILE_PATH}`, `${process.env.DEFAULT_FOLDER}/${req.params.folder}`,req.params.file));
// })

// app.get('/download/com.beditech.IndoorNavigation.apk', (req, res) => {
//     const file = `${__dirname}/download/com.beditech.IndoorNavigation.apk`;
//     res.download(file);
// });


const trackingDataRoutes = require('./api/routes/trackingDataRoutes');
const lbeaconRoutes = require('./api/routes/lbeaconRoutes');
const gatewayRoutes = require('./api/routes/gatewayRoutes');
const userRoutes = require('./api/routes/userRoutes');
const objectRoutes = require('./api/routes/objectRoutes');
const importedObjectRoutes = require('./api/routes/importedObjectRoutes');
const locationHistoryRoutes = require('./api/routes/locationHistoryRoutes');
const areaRoutes = require('./api/routes/areaRoutes');
const authRoutes = require('./api/routes/authRoutes');

trackingDataRoutes(app);
lbeaconRoutes(app);
gatewayRoutes(app);
userRoutes(app);
objectRoutes(app);
importedObjectRoutes(app);
locationHistoryRoutes(app);
areaRoutes(app);
authRoutes(app);

/** privatekey name: private.key
 *  certificate name: certificate.cert or certificate.crt
 *  ca_bundle name: ca.bundle.crt
 */

/** Create self-signed certificate  
 *  >> openssl req -nodes -new -x509 -keyout private.key -out certificate.cert 
 * If it is window os, please refer to https://tecadmin.net/install-openssl-on-windows/ install openssl 
 * and set the environment variables*/

var privateKey = process.env.PRIVATE_KEY && fs.readFileSync(__dirname + `/ssl/${process.env.PRIVATE_KEY}`)
var certificate = process.env.CERTIFICATE && fs.readFileSync(__dirname + `/ssl/${process.env.CERTIFICATE}`) 
var ca_bundle = process.env.CA_BUNDLE && fs.readFileSync(__dirname + `/ssl/${process.env.CA_BUNDLE}`)

var credentials = { 
    key: privateKey, 
    cert: certificate,
    ca: ca_bundle
}

const httpsServer = https.createServer(credentials, app)

// /** Enable HTTPS server */
// httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server running on PORT ${httpsPort}`)
// })

const httpServer = http.createServer(app);
httpServer.listen(3000, () => console.log(`running on PORT 3000`))




