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
const queryUserInfo = require('./queryUserInfo/queryUserInfo').queryUserInfo

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

app.get('/save_file_path/:file', (req, res) =>{
	console.log(res)
	res.sendFile(path.join(__dirname, 'save_file_path',req.params['file']));
})

app.get('/data/branches', db.getBranches);

app.get('/data/objectTable', db.getObjectTable);

app.get('/data/lbeaconTable', db.getLbeaconTable);

app.get('/data/gatewayTable', db.getGatewayTable);

app.get('/data/geofenceData', db.getGeofenceData);

app.get('/data/trackingData', db.getTrackingData);

app.post('/data/addObject', db.addObject);

app.post('/data/editObject', db.editObject);

app.post('/data/editObjectPackage', db.editObjectPackage)

app.post('/test/:mode',(req, res) => {
  var mode = req.params.mode
  queryUserInfo[mode](req,res)
});
app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

app.post('/data/editLbeacon', db.editLbeacon)


app.post('/data/QRCode',db.generatePDF)


const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () =>{
    console.log(`HTTP Server running on port ${httpPort}`)
})
// httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server running on PORT ${httpsPort}`)
// })

