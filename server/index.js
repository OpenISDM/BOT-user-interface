/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        webServer.js

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

import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import https from 'https'
import session from 'express-session'
import compression from 'compression'

// import validation from './api/middlewares/validation.js';
import sessionOptions from './api/config/session'
import credentials from './api/config/credentials'
import dataRoutes from './api/routes/dataRoutes'
import authRoutes from './api/routes/dataRoutes/authRoutes'
import UIRoutes from './api/routes/UIRoutes'
import UtilRoutes from './api/routes/UtilRoutes'
import shouldCompress from './api/config/compression'
import APIRoutes from './routes/APIRoutes'
import { attach } from './websocket'

const __dirname = dirname(fileURLToPath(import.meta.url))

const httpsPort = process.env.HTTPS_PORT
const app = express()

app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(session(sessionOptions))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

/** Compress asset if the browser supports gzip encoding  */
app.use(
	compression({
		filter: shouldCompress,
	})
)

app.use(express.static(path.join(__dirname, 'dist')))
app.use('/map', express.static(path.join(__dirname, 'map')))

UIRoutes(app)

UtilRoutes(app)

authRoutes(app)

/** Access control of data retrieving from database by session */
// app.use(validation.authChecker);

/** Data retrieving routes */
dataRoutes(app)

APIRoutes(app)

const httpsServer = https.createServer(credentials, app)

attach(httpsServer)

/** Initiate HTTPS server */
httpsServer.listen(httpsPort, () => {
	console.log(`HTTPS Server running on PORT ${httpsPort}`)
})

httpsServer.timeout = parseInt(process.env.SERVER_TIMEOUT)
