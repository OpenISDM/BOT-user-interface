require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const httpPort = process.env.httpPort || 80;
const httpsPort = process.env.httpsPort || 443;
const db = require('./query')
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname,'dist')));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var privateKey = fs.readFileSync(__dirname + '/sslforfree/private.key');
var certificate = fs.readFileSync(__dirname + '/sslforfree/certificate.crt');
var ca_bundle = fs.readFileSync(__dirname + '/sslforfree/ca_bundle.crt');

var credentials = { key: privateKey, cert: certificate, ca: ca_bundle };


app.get(/^\/page\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})


app.get('/data/objectTable', db.getObjectTable);

app.get('/data/lbeaconTable', db.getLbeaconTable);

app.get('/data/gatewayTable', db.getGatewayTable);

app.get('/data/geofenceData', db.getGeofenceData);

app.post('/data/trackingData', db.getTrackingData);

app.post('/data/addObject', db.addObject);

app.post('/data/editObject', db.editObject);

app.post('/data/editObjectPackage', db.editObjectPackage)

app.post('/user/signin', db.signin);

app.post('/user/signup', db.signup);

app.post('/user/info', db.userInfo)

app.post('/user/searchHistory', db.userSearchHistory)

app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

app.post('/data/editLbeacon', db.editLbeacon)


const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () =>{
    console.log(`HTTP Server running on port ${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on PORT ${httpsPort}`)
})

