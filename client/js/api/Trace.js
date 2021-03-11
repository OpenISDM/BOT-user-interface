import { post } from './utils/request'

export default {
	async getLocationHistory({ key, startTime, endTime, mode, locale }) {
		return await post('/data/trace/locationHistory', {
			key,
			startTime,
			endTime,
			mode,
			locale,
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
	async getTracePathByObjectIds({pathObjectAcns, startTime, endTime}){
		return await post ('/data/trace/path',{
			pathObjectAcns,
			startTime,
			endTime,
		})
	}
}
