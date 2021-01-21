import api_v1 from '../api_query'
import api_v0 from '../api_v1.0/api_query_v1.0'
export default (app) => {
	/** 給我帳號密碼 給你金鑰 **/
	app.post('/api/1.1/auth/signin', api_v1.getApiKey)
	app.post('/api/1.1/tracing/history/people', api_v1.getPeopleHistoryData)
	app.post('/api/1.1/tracing/realtime/people', api_v1.getPeopleRealtimeData)
	app.post('/api/1.1/tracing/history/device', api_v1.getObjectHistoryData)
	app.post('/api/1.1/tracing/realtime/device', api_v1.getObjectRealtimeData)
	app.post('/api/1.1/tracing/objectlist', api_v1.getIDTableData)

	app.post('/api/1.0/tracing/history', api_v0.get_history_data)
	app.post('/api/1.0/auth/signin', api_v0.get_api_key)
}
