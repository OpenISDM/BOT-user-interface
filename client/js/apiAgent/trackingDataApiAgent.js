import { trackingData } from '../dataSrc'
import { post } from '../helper/httpClient'

export default {
	async getTrackingData({ areaIds, locale }) {
		return await post(trackingData, {
			areaIds,
			locale,
		})
	},
}
