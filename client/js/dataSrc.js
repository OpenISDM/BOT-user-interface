/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        dataSrc.js

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

const dataSrcIP = process.env.DATASRC_IP
const dataSrcProtocol = parseInt(process.env.ENABLE_HTTP) ? 'http' : 'https'
const domain = `${dataSrcProtocol}://${dataSrcIP}`

export const trackingData = `${domain}/data/trackingData`
export const lbeacon = `${domain}/data/lbeacon`
export const gateway = `${domain}/data/gateway`
export const user = `${domain}/data/user`
export const userInfo = {
	area: {
		secondary: `${domain}/data/user/area/secondary`,
	},
	password: `${domain}/data/user/password`,
	locale: `${domain}/data/user/locale`,
	searchHistory: `${domain}/data/user/searchHistory`,
	mydevice: `${domain}/data/user/mydevice`,
	maxSearchHistoryCount: `${domain}/data/user/maxSearchHistoryCount`,
	keywordType: `${domain}/data/user/keywordType`,
	listId: `${domain}/data/user/listId`,
}
export const object = {
	object: `${domain}/data/object`,
	device: `${domain}/data/object/device`,
	person: `${domain}/data/object/person`,
	idleMacaddr: `${domain}/data/object/mac/idle`,
	alias: `${domain}/data/object/alias`,
	aliases: `${domain}/data/object/aliases`,
}
export const userAssignments = {
	getByUserId: `${domain}/data/userAssignments/getByUserId`,
	accept: `${domain}/data/userAssignments/accept`,
	finish: `${domain}/data/userAssignments/finish`,
}
export const objectPackage = `${domain}/data/objectPackage`
export const importedObject = `${domain}/data/importedObject`
export const trace = {
	locationHistory: `${domain}/data/trace/locationHistory`,
	contactTree: `${domain}/data/trace/contactTree`,
}
export const area = `${domain}/data/area`
export const role = `${domain}/data/role`
export const auth = {
	signin: `${domain}/data/auth/signin`,
	signout: `${domain}/data/auth/signout`,
	validation: `${domain}/data/auth/validation`,
	resetPassword: `${domain}/data/auth/resetpassword`,
	sentResetPwdInstruction: `${domain}/data/auth/sentResetPwdInstruction`,
}
export const file = {
	export: {
		csv: `${domain}/data/file/export/csv`,
		pdf: `${domain}/data/file/export/pdf`,
	},
}
export const geofence = `${domain}/data/geofence`
export const monitor = `${domain}/data/monitor`
export const record = {
	editedObject: `${domain}/data/record/editedObject`,
	shiftChange: `${domain}/data/record/shiftChange`,
	patientRecord: `${domain}/data/record/patientRecord`,
}
export const transferredLocation = {
	getAll: `${domain}/data/transferredLocation/getAll`,
	addOne: `${domain}/data/transferredLocation/addOne`,
	removeByIds: `${domain}/data/transferredLocation/removeByIds`,
}
export const deviceGroupList = `${domain}/data/deviceGroupList`
export const deviceGruopDetailByAreaId = `${domain}/data/deviceGruopDetailByAreaId`
export const patientGroupList = `${domain}/data/patientGroupList`
export const patientGruopDetailByAreaId = `${domain}/data/patientGruopDetailByAreaId`
export const pdfUrl = (path) => {
	return `${domain}/data/file/${path}`
}
export const utils = {
	searchableKeyword: `${domain}/data/utils/searchableKeyword`,
}
export const deleteDevice = `${domain}/data/deleteDevice`
export const getImportData = `${domain}/data/getImportData`

export default {
	trackingData,
	lbeacon,
	gateway,
	user,
	userInfo,
	object,
	objectPackage,
	importedObject,
	trace,
	area,
	role,
	auth,
	file,
	geofence,
	monitor,
	record,
	transferredLocation,
	deviceGroupList,
	patientGroupList,
	pdfUrl,
	utils,
	deleteDevice,
	getImportData,
	deviceGruopDetailByAreaId,
}
