import query from '../controllers/external/querymethod'
import middleware from '../controllers/external/middleware'
export default (app) => {
	app.post('/api/1.1/auth/signin', query.getApiKey)
	app.post(
		'/api/1.1/tracing/history/people',
		middleware.checkKey,
		middleware.checkFilter,
		middleware.checkAdditionalFilter,
		query.getPeopleHistoryData
	)
	app.post(
		'/api/1.1/tracing/realtime/people',
		middleware.checkKey,
		middleware.checkFilter,
		query.getPeopleRealtimeData
	)
	app.post(
		'/api/1.1/tracing/history/device',
		middleware.checkKey,
		middleware.checkFilter,
		middleware.checkAdditionalFilter,
		query.getObjectHistoryData
	)
	app.post(
		'/api/1.1/tracing/realtime/device',
		middleware.checkKey,
		middleware.checkFilter,
		query.getObjectRealtimeData
	)
	app.post(
		'/api/1.1/tracing/objectlist',
		middleware.checkKey,
		middleware.checkAreaIDFilter,
		query.getIDTableData
	)

	app.post('/api/1.0/tracing/history', query.getTracingHisotry)
	app.post('/api/1.0/auth/signin', query.getApiKeyV0)
}
