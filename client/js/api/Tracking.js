import { post } from './utils/request'

const trackingData = '/data/trackingData'

export default {
	async getTrackingData({ areaIds, locale }) {
		return await post(trackingData, {
			areaIds,
			locale,
		})
	},
}
