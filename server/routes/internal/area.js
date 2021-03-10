import areaController from '../../controllers/internal/area'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/area', cors())
	app.options('/data/area/*', cors())

	app.route('/data/area').post(areaController.getAreaTable)
	app.route('/data/area/user').get(areaController.getAreaTableByUserId)
}
