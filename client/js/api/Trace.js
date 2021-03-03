import { post } from './utils/request'

export default {
	async getLocationHistory({ key, startTime, endTime, mode }) {
		return await post('/data/trace/locationHistory', {
			key,
			startTime,
			endTime,
			mode,
		})
	},

	async getContactTree({ child, parents, startTime, endTime }) {
		return await post('/data/trace/contactTree', {
			child,
			parents,
			startTime,
			endTime,
		})
	},
}
