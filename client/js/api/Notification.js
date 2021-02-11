import { get, post } from '../utils/request'

const notification = '/data/notification'

export default {
	async getAllNotifications({ areaId }) {
		return await get(notification, { areaId })
	},
	async turnOffNotification({ notificationId }) {
		return await post(notification, { notificationId })
	},
}
