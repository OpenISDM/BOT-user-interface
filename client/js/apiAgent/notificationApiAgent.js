import { notification } from '../dataSrc'
import { get, post } from '../helper/httpClient'

export default {
	async getAllNotifications({ areaId }) {
		return await get(notification, { areaId })
	},
	async turnOffNotification({ notificationId }) {
		return await post(notification, { notificationId })
	},
}
