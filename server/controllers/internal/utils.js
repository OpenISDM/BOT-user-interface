import 'dotenv/config'
import dbQueries from '../../db/utilsQueries'
import pool from '../../db/connection'

export default {
	getSearchableKeywords: (request, response) => {
		const { areaId } = request.body
		pool
			.query(dbQueries.getSearchableKeyword(areaId))
			.then((res) => {
				console.log('get searchable keywords succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get searchable keywords failed ${err}`)
			})
	},
}
