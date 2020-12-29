import db from '../api_query'
export default (app) => {
	/** 給我帳號密碼 給你金鑰 **/
	app.post('/api/1.0/auth/signin', db.get_api_key)

	/** 給我金鑰 我還你屬於這金鑰持有者的地區擁有的物品 **/
	app.post('/api/1.0/tracing/history', db.get_history_data)

	app.post('/api/1.0/tracing/history/people', db.get_people_history_data)
	app.post('/api/1.0/tracing/realtime/people', db.get_people_realtime_data)

	app.post('/api/1.0/tracing/history/object', db.get_object_history_data)
	app.post('/api/1.0/tracing/realtime/object', db.get_object_realtime_data)
}
