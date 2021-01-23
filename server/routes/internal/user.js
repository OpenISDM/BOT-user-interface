/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userRoutes.js

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

import userController from '../../controllers/internal/userController'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/user', cors())

	app.options('/data/user/searchHistory', cors())

	app.options('/data/user/myDevice', cors())

	app.options('/data/user/keywordType', cors())

	app.options('/data/user/listId', cors())

	app.options('/data/user/sentResetPwdInstruction', cors())

	app
		.route('/data/user')
		.get(userController.getAllUser)
		.delete(userController.deleteUser)
		.post(userController.addUser)
		.put(userController.setUserInfo)

	app.route('/data/user/area/secondary').post(userController.editSecondaryArea)

	app.route('/data/user/password').post(userController.editPassword)

	app.route('/data/user/locale').post(userController.setLocale)

	app.route('/data/user/mydevice')

	app.route('/data/user/searchHistory').put(userController.addSearchHistory)

	app.route('/data/user/myDevice').put(userController.editMyDevice)

	app
		.route('/data/user/maxSearchHistoryCount')
		.post(userController.editMaxSearchHistoryCount)

	app.route('/data/user/keywordType').put(userController.editKeywordType)

	app.route('/data/user/listId').put(userController.editListId)
}
