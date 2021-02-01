import recordController from '../../controllers/internal/record'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/record', cors())

	app.options('/data/record/editedObject', cors())
	app.options('/data/record/shiftChange', cors())
	app.options('/data/record/patientRecord', cors())

	app
		.route('/data/record/editedObject')
		.post(recordController.getEditObjectRecord)
		.delete(recordController.deleteEditObjectRecord)

	app
		.route('/data/record/shiftChange')
		.post(recordController.getShiftChangeRecord)
		.put(recordController.addShiftChangeRecord)
		.delete(recordController.deleteShiftChangeRecord)

	app
		.route('/data/record/patientRecord')
		.post(recordController.addPatientRecord)
}
