import 'dotenv/config'
import { sequelize } from '../../db/connection'
import { DeviceGroupList, ObjectTable } from '../../db/models'

export default {
	getDeviceGroupList: async (request, response) => {
		try {
			const res = await DeviceGroupList.findAll()
			response.status(200).json(res)
		} catch (e) {
			console.log('getDeviceGroupList error: ', e)
		}
	},
	addDeviceGroupList: async (request, response) => {
		const { name, areaId } = request.body
		try {
			const res = await DeviceGroupList.create({ name, area_id: areaId })
			response.status(200).json(res)
		} catch (e) {
			response.status(200).json()
			console.log(`add device group list failed ${e}`)
		}
	},
	modifyDeviceGroupList: async (request, response) => {
		const { groupId, mode, newName, itemId } = request.body
		const promises = []
		try {
			const modeIntType = parseInt(mode)
			if (modeIntType === 0) {
				const { items } = await DeviceGroupList.findByPk(groupId)
				if (!items || !items.includes(itemId)) {
					promises.push(
						DeviceGroupList.update(
							{
								items: sequelize.fn(
									'array_append',
									sequelize.col('items'),
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
					DeviceGroupList.update(
						{
							items: sequelize.fn(
								'array_remove',
								sequelize.col('items'),
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
					DeviceGroupList.update(
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
	deleteDeviceGroup: async (request, response) => {
		const { groupId } = request.body
		const { items = [] } = await DeviceGroupList.findByPk(groupId)

		if (items) {
			await ObjectTable.update(
				{ list_id: null },
				{
					where: {
						id: items,
					},
				}
			)
		}

		await DeviceGroupList.destroy({
			where: {
				id: groupId,
			},
		})

		response.status(200).json('ok')
	},
	getDetailByAreaId: async (request, response) => {
		const { areaId } = request.query
		try {
			const gruopList = await DeviceGroupList.findAll({
				where: { area_id: areaId },
			})
			let objectIds = []
			gruopList.forEach(({ items }) => {
				if (items) {
					objectIds = [...objectIds, ...items]
				}
			})
			const objectList = await ObjectTable.findAll({
				where: { id: objectIds },
			})
			response.status(200).json({ gruopList, objectList })
		} catch (e) {
			console.log('get devices group details error: ', e)
		}
	},
}
