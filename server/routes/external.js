import {history, objectTable, realtime, signIn, tracingHistory} from '../controllers/external/index'
import { external as middleware } from '../middlewares/index'
export default (app) => {
	app.post('/api/1.1/auth/signin', middleware.checkPassword, signIn.getApiKey)
	app.post(
		'/api/1.1/tracing/history/people',
		middleware.checkKey,
		middleware.checkFilter,
		middleware.checkOptionalFilter,
		history.getPeopleHistoryData
	)
	app.post(
		'/api/1.1/tracing/realtime/people',
		middleware.checkKey,
		middleware.checkFilter,
		realtime.getPeopleRealtimeData
	)
	app.post(
		'/api/1.1/tracing/history/device',
		middleware.checkKey,
		middleware.checkFilter,
		middleware.checkOptionalFilter,
		history.getObjectHistoryData
	)
	app.post(
		'/api/1.1/tracing/realtime/device',
		middleware.checkKey,
		middleware.checkFilter,
		realtime.getObjectRealtimeData
	)
	app.post(
		'/api/1.1/tracing/objectlist',
		middleware.checkKey,
		middleware.checkKeyAndAreaidsFilter,
		objectTable.getIDTableData
	)

	app.post(
		'/api/1.0/tracing/history',
		middleware.checkKey,
		middleware.checkUUIDFilter,
		middleware.checkOptionalFilter,
		tracingHistory.getTracingHisotry
	)
	app.post('/api/1.0/auth/signin', middleware.checkPassword, signIn.getApiKey)
}
