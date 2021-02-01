import errorCode from './codes'
import moment from 'moment-timezone'
import queries from '../../db/externalQueries'
import pool from '../../db/connection'
import { encrypt } from '../../helpers'

async function getApiKey(request, response) {
	const { username, password } = request.body
	const user = await pool.query(queries.getUserQuery(username, password))

	if (user.rows.length > 0) {
		const hashToken = encrypt.createHash(password)

		await pool
			.query(queries.setKey(user.rows[0].id, user.rows[0].name, hashToken))
			.catch((err) => {
				console.log(`update data error : ${err}`)
			})
		response.json(errorCode.getApiKeySuccess(hashToken, moment().add(30, 'm')))
	} else {
		response.json(errorCode.accountIncorrect)
	}
}

export default {
    getApiKey
}