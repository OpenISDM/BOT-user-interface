import lbeaconController from '../../controllers/internal/lbeacon'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/lbeacon', cors())

	app
		.route('/data/lbeacon')
		.get(lbeaconController.getAllLbeacon)
		.delete(lbeaconController.deleteLBeacon)
		.put(lbeaconController.editLbeacon)
}
