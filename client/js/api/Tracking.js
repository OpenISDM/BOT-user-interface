import { post } from './utils/request'

const trackingData = '/data/trackingData'
const getTrackingTableByMacAddress = '/data/getTrackingTableByMacAddress'
const contactTree = '/data/trace/contactTree'

export default {
	async getTrackingData({ areaIds, locale }) {
		return await post(trackingData, {
			areaIds,
			locale,
		})
	},

	async getTrackingTableByMacAddress({ object_mac_address }) {
		return await post(getTrackingTableByMacAddress, { object_mac_address })
	},

	async getTraceContactTree({ child, parents, startTime, endTime }) {
		return await post(contactTree, { child, parents, startTime, endTime })
	},
}
