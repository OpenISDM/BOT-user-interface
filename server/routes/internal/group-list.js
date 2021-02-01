import deviceGroupListController from '../../controllers/internal/device-group-list'
import patientGroupListController from '../../controllers/internal/patient-group-list'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/deviceGroupList', cors())
	app.options('/data/patientGroupList', cors())
	app.options('/data/deviceGruopDetailByAreaId', cors())
	app.options('/data/patientGruopDetailByAreaId', cors())

	app
		.route('/data/deviceGroupList')
		.get(deviceGroupListController.getDeviceGroupList)
		.post(deviceGroupListController.addDeviceGroupList)
		.put(deviceGroupListController.modifyDeviceGroupList)
		.delete(deviceGroupListController.deleteDeviceGroup)

	app
		.route('/data/deviceGruopDetailByAreaId')
		.get(deviceGroupListController.getDetailByAreaId)

	app
		.route('/data/patientGroupList')
		.get(patientGroupListController.getPatientGroupList)
		.post(patientGroupListController.addPatientGroupList)
		.put(patientGroupListController.modifyPatientGroupList)
		.delete(patientGroupListController.deletePatientGroup)

	app
		.route('/data/patientGruopDetailByAreaId')
		.get(patientGroupListController.getDetailByAreaId)
}
