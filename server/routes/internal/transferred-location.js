import transferredLocationController from '../../controllers/internal/transferred-location'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/transferredLocation', cors())

	app
		.route('/data/transferredLocation/getAll')
		.get(transferredLocationController.getAll)

	app
		.route('/data/transferredLocation/addOne')
		.post(transferredLocationController.addOne)

	app
		.route('/data/transferredLocation/removeByIds')
		.post(transferredLocationController.removeByIds)
}
