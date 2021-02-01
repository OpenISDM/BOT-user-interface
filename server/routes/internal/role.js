import roleController from '../../controllers/internal/role'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/role', cors())

	app.route('/data/role').get(roleController.getAllRole)
}
