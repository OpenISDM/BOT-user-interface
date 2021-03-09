import { post } from './utils/request'

const trackingData = '/data/trackingData'
const getTrackingTableByMacAddress = '/data/getTrackingTableByMacAddress'

export default {
	async getTrackingData({ areaIds, locale }) {
		return await post(trackingData, {
			areaIds,
			locale,
		})
	},

	async getTrackingTableByMacAddress({ macAddress }) {
		return await post(getTrackingTableByMacAddress, { macAddress })
	},
}
