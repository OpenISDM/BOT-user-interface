import userAssignmentsController from '../../controllers/internal/user-assignments'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/userAssignments/*', cors())

	app
		.route('/data/userAssignments/getByUserId')
		.get(userAssignmentsController.getByUserId)

	app
		.route('/data/userAssignments/getGroupIdListByUserId')
		.get(userAssignmentsController.getGroupIdListByUserId)

	app
		.route('/data/userAssignments/accept')
		.post(userAssignmentsController.accept)

	app
		.route('/data/userAssignments/finish')
		.post(userAssignmentsController.finish)

	app
		.route('/data/userAssignments/cancel')
		.post(userAssignmentsController.cancel)
}
