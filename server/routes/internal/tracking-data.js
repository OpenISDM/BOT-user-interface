import trackingController from '../../controllers/internal/tracking-data'

export default (app) => {
	app.route('/data/trackingData').post(trackingController.getTrackingData)

	app.route('/data/searchQueue').post(trackingController.getSearchQueue)
}
