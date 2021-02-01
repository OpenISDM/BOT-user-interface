import gatewayController from '../../controllers/internal/gateway'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/gateway', cors())

	app
		.route('/data/gateway')
		.get(gatewayController.getAllGateway)
		.delete(gatewayController.deleteGateway)
		.put(gatewayController.editGateway)
}
