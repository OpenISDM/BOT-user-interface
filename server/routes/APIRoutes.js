import db from '../api_query'
export default (app) => {
	/** 給我帳號密碼 給你金鑰 **/
	app.post('/api/1.0/auth/signin', db.getApiKey)

	/** 給我金鑰 我還你屬於這金鑰持有者的地區擁有的物品 **/
	app.post('/api/1.0/tracing/history', db.getPatientDurationData)

	app.post('/api/1.0/tracing/history/people', db.getPeopleHistoryData)
	app.post('/api/1.0/tracing/realtime/people', db.getPeopleRealtimeData)

	app.post('/api/1.0/tracing/history/device', db.getObjectHistoryData)
	app.post('/api/1.0/tracing/realtime/device', db.getObjectRealtimeData)

	app.post('/api/1.0/tracing/id_table', db.getIDTableData)
}
