import 'dotenv/config'
import { execFile } from 'child_process'

const BOT_SERVER_IP = process.env.DB_HOST

export const reloadGeofenceConfig = (area_id) => {
	if (process.env.IPC_EXECUTION_FILE) {
		execFile(
			process.env.IPC_EXECUTION_FILE,
			[
				'-s',
				BOT_SERVER_IP,
				'-p',
				'9999',
				'-c',
				'cmd_reload_geo_fence_setting',
				'-r',
				'geofence_object',
				'-f',
				'area_one',
				'-a',
				area_id,
			],
			{ cwd: process.env.IPC_FOLDER_PATH },
			function (err, data) {
				if (err) {
					console.log(`execute reload geofence setting failed ${err}`)
				} else {
					console.log('execute reload geofence setting succeed')
				}
			}
		)
	} else {
		console.log('IPC has not set')
	}
}

export const stopLightAlarm = ({ notificationId }) => {
	console.log(`stopLightAlarm notificationId:${notificationId}`)
	if (process.env.IPC_EXECUTION_FILE) {
		execFile(
			process.env.IPC_EXECUTION_FILE,
			[
				'-s',
				BOT_SERVER_IP,
				'-p',
				'9999',
				'-c',
				'cmd_stop_light_alarm',
				'-n',
				notificationId,
			],
			{ cwd: process.env.IPC_FOLDER_PATH },
			function (err, data) {
				if (err) {
					console.log(`execute stop light alram failed ${err}`)
				} else {
					console.log('execute stop light alram succeed')
				}
			}
		)
	} else {
		console.log('IPC has not set')
	}
}

export default {
	reloadGeofenceConfig,
	stopLightAlarm,
}
