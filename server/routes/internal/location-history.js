import locationHistoryController from '../../controllers/internal/location-history'

export default (app) => {
	app
		.route('/data/trace/locationHistory')
		.post(locationHistoryController.getLocationHistory)

	app
		.route('/data/trace/contactTree')
		.post(locationHistoryController.getContactTree)
}
