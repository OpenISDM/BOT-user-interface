import vitalSignController from '../../controllers/internal/vital-sign'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/vitalSignConfig', cors())

	app
		.route('/data/vitalSignConfig')
		.get(vitalSignController.getConfig)
		.post(vitalSignController.setConfig)
}
