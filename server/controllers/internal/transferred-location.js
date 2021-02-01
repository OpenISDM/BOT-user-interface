import { TransferLocations } from '../../db/models'

export default {
	getAll: async (request, response) => {
		try {
			const res = await TransferLocations.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log(`get all transferred Location failed: ${e}`)
		}
	},

	addOne: async (request, response) => {
		const { name, department } = request.body
		try {
			const res = await TransferLocations.upsert(
				{ name, department }, // Record to upsert
				{ returning: true } // Return upserted record
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(`add transferred Location failed: ${e}`)
		}
	},

	removeByIds: async (request, response) => {
		const { transferLocationIds } = request.body
		try {
			const res = await TransferLocations.destroy({
				where: {
					id: transferLocationIds,
				},
			})
			response.status(200).json(res)
		} catch (e) {
			console.log(`remove transferred Locations failed: ${e}`)
		}
	},
}
