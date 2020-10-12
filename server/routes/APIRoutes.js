import db from '../api_query'

export default (app) => {
	/** 給我帳號密碼 給你金鑰 **/
	app.post('/api/1.0/auth/signin', db.get_api_key)

	/** 給我金鑰 我還你屬於這金鑰持有者的地區擁有的物品 **/
	app.post('/api/1.0/tracing/history', db.get_history_data)
}
