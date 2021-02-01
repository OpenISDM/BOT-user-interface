const hostname = window.location.hostname

export const domain = `https://${hostname}`
export const mapPrefix = `${domain}/map/`
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
	maxSearchHistoryCount: `${domain}/data/user/maxSearchHistoryCount`,
	keywordType: `${domain}/data/user/keywordType`,
}
export const object = {
	object: `${domain}/data/object`,
	device: `${domain}/data/object/device`,
	person: `${domain}/data/object/person`,
	idleMacaddr: `${domain}/data/object/mac/idle`,
	acn: `${domain}/data/object/acn`,
	alias: `${domain}/data/object/alias`,
	aliases: `${domain}/data/object/aliases`,
	nickname: `${domain}/data/object/nickname`,
}
export const userAssignments = {
	getByUserId: `${domain}/data/userAssignments/getByUserId`,
	getGroupIdListByUserId: `${domain}/data/userAssignments/getGroupIdListByUserId`,
	accept: `${domain}/data/userAssignments/accept`,
	finish: `${domain}/data/userAssignments/finish`,
	cancel: `${domain}/data/userAssignments/cancel`,
}
export const objectPackage = `${domain}/data/objectPackage`
export const trace = {
	locationHistory: `${domain}/data/trace/locationHistory`,
	contactTree: `${domain}/data/trace/contactTree`,
}
export const area = `${domain}/data/area`
export const areaUser = `${domain}/data/area/user`
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
export const geofenceArea = `${domain}/data/geofence/area`
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
export const getTrackingTableByMacAddress = `${domain}/data/getTrackingTableByMacAddress`
export const namedList = `${domain}/data/namedList`
export const namedListObject = `${domain}/data/namedList/object`
export const namedListWithoutType = `${domain}/data/namedList/without/type`
export const notification = `${domain}/data/notification`
export const agent = `${domain}/data/agent`

export default {
	domain,
	mapPrefix,
	trackingData,
	lbeacon,
	gateway,
	user,
	userInfo,
	object,
	objectPackage,
	trace,
	area,
	areaUser,
	role,
	auth,
	file,
	geofence,
	geofenceArea,
	monitor,
	record,
	transferredLocation,
	deviceGroupList,
	patientGroupList,
	pdfUrl,
	utils,
	deviceGruopDetailByAreaId,
	getTrackingTableByMacAddress,
	namedList,
	namedListObject,
	namedListWithoutType,
	notification,
	agent,
}
