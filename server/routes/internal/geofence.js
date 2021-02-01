import geofenceController from '../../controllers/internal/geofence'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/geofence', cors())
	app.options('/data/geofence/area', cors())

	app
		.route('/data/geofence')
		.post(geofenceController.getGeofenceConfig)
		.delete(geofenceController.deleteMonitorConfig)
		.patch(geofenceController.addGeofenceConfig)
		.put(geofenceController.setGeofenceConfig)

	app
		.route('/data/geofence/area')
		.get(geofenceController.getGeofenceAreaConfig)
		.post(geofenceController.setGeofenceAreaConfig)
}
