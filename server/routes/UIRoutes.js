// import db from '../query';
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

// temp db for now
const db = {}

export default (app) => {
	setInterval(
		db.clearSearchHistory,
		86400 * process.env.CLEAR_SEARCH_HISTORY_INTERVAL
	)

	app.get('/image/pinImage/:pinImage', (req, res) => {
		res.sendFile(
			path.join(
				__dirname,
				'..',
				'..',
				'src',
				'img',
				'colorPin',
				req.params.pinImage
			)
		)
	})

	app.get(/^\/page\/(.*)/, (req, res) => {
		res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'))
	})
	app.post('/data/getObjectTable', db.getObjectTable)

	app.post(
		'/data/getTrackingTableByMacAddress',
		db.getTrackingTableByMacAddress
	)

	app.post('/data/addAssociation', db.addAssociation)

	app.post('/data/addAssociation_Patient', db.addAssociation_Patient)

	app.post('/data/cleanBinding', db.cleanBinding)

	app.post('/data/getLbeaconTable', db.getLbeaconTable)

	app.post('/data/getGatewayTable', db.getGatewayTable)

	app.post('/data/getTrackingData', db.getTrackingData)

	app.post('/data/editObject', db.editObject)

	app.post('/data/setLocaleID', db.setLocaleID)

	app.post('/data/editImport', db.editImport)

	app.post('/data/addPatientRecord', db.addPatientRecord)

	app.post('/data/setUserSecondaryArea', db.setUserSecondaryArea)

	app.post('/data/editPatient', db.editPatient)

	app.post('/data/objectImport', db.objectImport)

	app.post('/data/addObject', db.addObject)

	app.post('/data/addPatient', db.addPatient)

	app.post('/data/editObjectPackage', db.editObjectPackage)

	app.post('/user/signin', db.signin)

	app.post('/user/signup', db.signup)

	app.post('/user/editPassword', db.editPassword)

	app.post('/user/getUserInfo', db.getUserInfo)

	app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

	app.post('/data/editLbeacon', db.editLbeacon)

	app.post('/data/generatePDF', db.generatePDF)

	app.post('/data/PDFInfo', db.getShiftChangeRecord)

	app.post('/data/modifyMyDevice', db.modifyUserDevices)

	app.post('/data/modifyUserInfo', db.modifyUserInfo)

	app.post('/data/getAreaTable', db.getAreaTable)

	app.post('/validation/username', db.validateUsername)

	app.post('/test/getUserList', db.getUserList)

	app.post('/test/getRoleNameList', db.getRoleNameList)

	app.post('/test/deleteUser', db.deleteUser)

	app.post('/test/setUserInfo', db.setUserInfo)

	app.post('/data/getMainSecondArea', db.getMainSecondArea)

	app.post('/test/getEditObjectRecord', db.getEditObjectRecord)

	app.post('/test/deleteEditObjectRecord', db.deleteEditObjectRecord)

	app.post('/test/deleteShiftChangeRecord', db.deleteShiftChangeRecord)

	app.post('/test/deletePatient', db.deletePatient)

	app.post('/test/deleteDevice', db.deleteDevice)

	app.post('/test/deleteLBeacon', db.deleteLBeacon)

	app.post('/test/deleteGateway', db.deleteGateway)

	app.post('/data/addShiftChangeRecord', db.addShiftChangeRecord)

	app.post('/data/checkoutViolation', db.checkoutViolation)

	app.post('/data/confirmValidation', db.confirmValidation)

	app.post('/data/getMonitorConfig', db.getMonitorConfig)

	app.post('/data/setMonitorConfig', db.setMonitorConfig)

	app.post('/data/addMonitorConfig', db.addMonitorConfig)

	app.post('/data/addGeofenceConfig', db.addGeofenceConfig)

	app.post('/data/getGeofenceConfig', db.getGeofenceConfig)

	app.post('/data/setGeofenceConfig', db.setGeofenceConfig)

	app.post('/data/setMonitorEnable', db.setMonitorEnable)

	app.post('/data/deleteMonitorConfig', db.deleteMonitorConfig)

	app.post('/data/backendSearch', db.backendSearch)

	app.post('/data/getSearchQueue', db.getSearchQueue)

	app.post('/data/getAreaTable', db.getAreaTable)

	app.get('/data/getTransferredLocation', db.getTransferredLocation)

	app.post('/data/modifyTransferredLocation', db.modifyTransferredLocation)

	app.get('/data/getRolesPermission', db.getRolesPermission)

	app.post('/data/modifyPermission', db.modifyPermission)

	app.post('/data/modifyRolesPermission', db.modifyRolesPermission)

	app.post('/data/getLocationHistory', db.getLocationHistory)

	app.get(`/${process.env.DEFAULT_FOLDER}/shift_record/:file`, (req, res) => {
		res.sendFile(
			path.join(
				`${process.env.LOCAL_FILE_PATH}`,
				`${process.env.DEFAULT_FOLDER}/shift_record`,
				req.params.file
			)
		)
	})

	app.get(`/${process.env.DEFAULT_FOLDER}/search_result/:file`, (req, res) => {
		res.sendFile(
			path.join(
				`${process.env.LOCAL_FILE_PATH}`,
				`${process.env.DEFAULT_FOLDER}/search_result`,
				req.params.file
			)
		)
	})

	app.get(
		`/${process.env.DEFAULT_FOLDER}/edit_object_record/:file`,
		(req, res) => {
			res.sendFile(
				path.join(
					`${process.env.LOCAL_FILE_PATH}`,
					`${process.env.DEFAULT_FOLDER}/edit_object_record`,
					req.params.file
				)
			)
		}
	)

	app.get(`/${process.env.DEFAULT_FOLDER}/patient_record/:file`, (req, res) => {
		res.sendFile(
			path.join(
				`${process.env.LOCAL_FILE_PATH}`,
				`${process.env.DEFAULT_FOLDER}/patient_record`,
				req.params.file
			)
		)
	})

	app.get('/download/com.beditech.IndoorNavigation.apk', (req, res) => {
		const file = `${__dirname}/download/com.beditech.IndoorNavigation.apk`
		res.download(file)
	})
}
