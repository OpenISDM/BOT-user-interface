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
			const res = await UserTable.findOne({
				where: { id: userId },
				include: [
					{
						model: AreaTable,
						as: 'areas',
						required: false, // left join
					},
				],
			})
			response.status(200).json(res)
		} catch (e) {
			console.log('getAreaTableByUserId error: ', e)
		}
	},
}
