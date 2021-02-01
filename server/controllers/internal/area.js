import 'dotenv/config'
import { AreaTable, UserTable } from '../../db/models'

export default {
	getAreaTable: async (request, response) => {
		try {
			const res = await AreaTable.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log('getAreaTable error: ', e)
		}
	},
	getAreaTableByUserId: async (request, response) => {
		const { userId } = request.query
		try {
			const res = await AreaTable.findAll({
				include: [
					{
						where: { id: userId },
						model: UserTable,
						as: 'users',
						required: true, // true is defalut option meaning inner join
					},
				],
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('getAreaTableByUserId error: ', e)
		}
	},
}
