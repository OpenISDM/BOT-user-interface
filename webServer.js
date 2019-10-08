require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;
const db = require('./query')
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const session = require('express-session')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static(path.join(__dirname,'dist')));

app.use(session({
    secret: 'super_hound',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000 * 300
    }
}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', (req,res) => {
    console.log(123)
    if (req.session.userInfo) {
        res.write('views: ' + req.session.userInfo + req.sessionID)
        res.end()
    } else {
        req.session.userInfo = 'joechou'
        res.end('welcome to the session demo. refresh!')
    }
})


app.get(/^\/page\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})

app.post('/data/getObjectTable', db.getObjectTable);

app.post('/data/getLbeaconTable', db.getLbeaconTable);

app.post('/data/getGatewayTable', db.getGatewayTable);

app.post('/data/geofenceData', db.getGeofenceData);

app.post('/data/getTrackingData', db.getTrackingData);

app.post('/data/editObject', db.editObject);

app.post('/data/addObject', db.addObject);

app.post('/data/editObjectPackage', db.editObjectPackage)

app.post('/user/signin', db.signin)

app.post('/user/signup', db.signup);

app.post('/user/getUserInfo', db.getUserInfo)

app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

app.post('/data/editLbeacon', db.editLbeacon)

app.post('/data/generatePDF',db.generatePDF)

app.post('/data/PDFInfo',db.getPDFInfo)

app.post('/data/modifyMyDevice', db.modifyUserDevices)

app.post('/validation/username', db.validateUsername)
app.post('/test/getUserList', db.getUserList)
app.post('/test/getUserRole', db.getUserRole)
app.post('/test/getRoleNameList', db.getRoleNameList)
app.post('/test/removeUser', db.removeUser)
app.post('/test/setUserRole', db.setUserRole)
app.post('/test/getEditObjectRecord', db.getEditObjectRecord)
app.post('/test/deleteEditObjectRecord', db.deleteEditObjectRecord)
app.post('/data/getAreaTable', db.getAreaTable)

app.get('/save_file_path/:file', (req, res) =>{
	res.sendFile(path.join(__dirname, 'save_file_path',req.params['file']));
})

app.get('/download/com.beditech.IndoorNavigation.apk', (req, res) => {
    const file = `${__dirname}/download/com.beditech.IndoorNavigation.apk`;
    res.download(file);
});

var privateKey = fs.readFileSync(__dirname + '/sslforfree/private.key');
var certificate = fs.readFileSync(__dirname + '/sslforfree/certificate.crt');
var ca_bundle = fs.readFileSync(__dirname + '/sslforfree/ca_bundle.crt');

var credentials = { 
    key: privateKey, 
    cert: certificate, 
    ca: ca_bundle 
};

const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () =>{
    console.log(`HTTP Server running on port ${httpPort}`)
})
// httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server running on PORT ${httpsPort}`)
// })

