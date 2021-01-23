/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        UIRoutes.js

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

import authController from '../controllers/authController'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { pageChecker } from '../middlewares/validation'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default (app) => {
	app.get('/login', (req, res) => {
		res.sendFile(
			path.join(__dirname, '..', '..', 'public', 'dist', 'index.html')
		)
	})

	app.get(/^\/page\/(.*)/, pageChecker, (req, res) => {
		res.sendFile(
			path.join(__dirname, '..', '..', 'public', 'dist', 'index.html')
		)
	})

	app.get('/resetpassword/new/:token', authController.verifyResetPwdToken)
}
