import api_query from '../controllers/external/api_query'


export default (app) => {
	app.post('/api/1.1/auth/signin', api_query.getApiKey)
	app.post('/api/1.1/tracing/history/people', api_query.checkKey, api_query.checkFilter, api_query.getPeopleHistoryData)
	app.post('/api/1.1/tracing/realtime/people', api_query.checkKey, api_query.checkFilter, api_query.getPeopleRealtimeData)
	app.post('/api/1.1/tracing/history/device', api_query.checkKey, api_query.checkFilter, api_query.getObjectHistoryData)
	app.post('/api/1.1/tracing/realtime/device',api_query.checkKey, api_query.checkFilter, api_query.getObjectRealtimeData)
	app.post('/api/1.1/tracing/objectlist',api_query.checkKey, api_query.getIDTableData)

	app.post('/api/1.0/tracing/history', api_query.get_history_data)
	app.post('/api/1.0/auth/signin', api_query.get_api_key_v0)
}
