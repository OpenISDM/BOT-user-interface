import 'dotenv/config'
import { Roles } from '../../db/models'

export default {
	getAllRole: async (request, response) => {
		try {
			const roles = await Roles.findAll()
			response.status(200).json(roles)
		} catch (e) {
			console.log(e)
		}
	},
}
