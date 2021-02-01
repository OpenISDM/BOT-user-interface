import { utils, getTrackingTableByMacAddress, trace } from '../dataSrc'
import { post } from '../helper/httpClient'

export default {
	async getSearchableKeywords({ areaId }) {
		return await post(utils.searchableKeyword, { areaId })
	},

	async getTrackingTableByMacAddress({ object_mac_address }) {
		return await post(getTrackingTableByMacAddress, { object_mac_address })
	},

	async getTraceContactTree({ child, parents, startTime, endTime }) {
		return await post(trace.contactTree, { child, parents, startTime, endTime })
	},
}
