import { trackingData } from '../dataSrc'
import { post } from '../helper/httpClient'

export default {
	async getTrackingData({ areaIds }) {
		return await post(trackingData, {
			areaIds,
		})
	},
}
