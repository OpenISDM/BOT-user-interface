import 'dotenv/config'
import { sequelize } from '../../db/connection'
import { PatientGroupList, ObjectTable } from '../../db/models'

export default {
	getPatientGroupList: async (request, response) => {
		try {
			const res = await PatientGroupList.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log('getPatientGroupList error: ', e)
		}
	},
	addPatientGroupList: async (request, response) => {
		const { name, areaId } = request.body
		try {
			const res = await PatientGroupList.create({ name, area_id: areaId })
			response.status(200).json(res)
		} catch (e) {
			response.status(200).json()
			console.log(`add device group list failed ${e}`)
		}
	},
	modifyPatientGroupList: async (request, response) => {
		const { groupId, mode, newName, itemId } = request.body
		const promises = []
		try {
			const modeIntType = parseInt(mode)
			if (modeIntType === 0) {
				const { patients } = await PatientGroupList.findByPk(groupId)
				if (!patients || !patients.includes(itemId)) {
					promises.push(
						PatientGroupList.update(
							{
								patients: sequelize.fn(
									'array_append',
									sequelize.col('patients'),
									itemId
								),
							},
							{ where: { id: groupId } }
						)
					)
					promises.push(
						ObjectTable.update(
							{ list_id: groupId },
							{
								where: {
									id: itemId,
								},
							}
						)
					)
				}
			} else if (modeIntType === 1) {
				promises.push(
					PatientGroupList.update(
						{
							patients: sequelize.fn(
								'array_remove',
								sequelize.col('patients'),
								itemId
							),
						},
						{ where: { id: groupId } }
					)
				)
				promises.push(
					ObjectTable.update(
						{ list_id: null },
						{
							where: {
								id: itemId,
							},
						}
					)
				)
			} else if (modeIntType === 2) {
				// not used for now
				promises.push(
					PatientGroupList.update(
						{
							name: newName,
						},
						{ where: { id: groupId } }
					)
				)
			}
			await Promise.all(promises)
			response.status(200).json('ok')
		} catch (err) {
			console.log(`modify device list failed ${err}`)
		}
	},
	deletePatientGroup: async (request, response) => {
		const { groupId } = request.body
		const { patients = [] } = await PatientGroupList.findByPk(groupId)

		if (patients) {
			await ObjectTable.update(
				{ list_id: null },
				{
					where: {
						id: patients,
					},
				}
			)
		}

		await PatientGroupList.destroy({
			where: {
				id: groupId,
			},
		})

		response.status(200).json('ok')
	},
	getDetailByAreaId: async (request, response) => {
		const { areaId } = request.query
		try {
			const gruopList = await PatientGroupList.findAll({
				where: { area_id: areaId },
				attributes: [
					'id',
					'name',
					'patients', // Add this column to correctly do Object Destructuring
					['patients', 'items'],
					'area_id',
				],
			})
			let objectIds = []
			gruopList.forEach(({ patients }) => {
				if (patients) {
					objectIds = [...objectIds, ...patients]
				}
			})
			const objectList = await ObjectTable.findAll({
				where: { id: objectIds },
			})
			response.status(200).json({ gruopList, objectList })
		} catch (e) {
			console.log('get patients group details error: ', e)
		}
	},
}
