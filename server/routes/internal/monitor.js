import monitorController from '../../controllers/internal/monitor'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/monitor', cors())

	app
		.route('/data/monitor')
		.post(monitorController.getMonitorConfig)
		.delete(monitorController.deleteMonitorConfig)
		.patch(monitorController.addMonitorConfig)
		.put(monitorController.setMonitorConfig)
}
