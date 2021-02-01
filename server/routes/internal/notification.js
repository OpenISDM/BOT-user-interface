import notificationController from '../../controllers/internal/notification'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/notification', cors())

	app
		.route('/data/notification')
		.get(notificationController.getAllNotifications)
		.post(notificationController.turnOffNotification)
}
