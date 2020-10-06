/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        credentials.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

/** privatekey name: private.key
 *  certificate name: certificate.cert or certificate.crt
 *  ca_bundle name: ca.bundle.crt
 */

/** Create self-signed certificate
 *  >> openssl req -nodes -new -x509 -keyout private.key -out certificate.cert
 * If it is window os, please refer to https://tecadmin.net/install-openssl-on-windows/ install openssl
 * and set the environment variables*/
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sslPath = path.join(__dirname, '..', 'ssl')

var privateKey =
    process.env.PRIVATE_KEY &&
    fs.readFileSync(path.join(sslPath, process.env.PRIVATE_KEY))
var certificate =
    process.env.CERTIFICATE &&
    fs.readFileSync(path.join(sslPath, process.env.CERTIFICATE))
var ca_bundle =
    process.env.CA_BUNDLE &&
    fs.readFileSync(path.join(sslPath, process.env.CA_BUNDLE))

var credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca_bundle,
}

module.exports = credentials
