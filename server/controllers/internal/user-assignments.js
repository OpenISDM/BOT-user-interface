import 'dotenv/config'
import { sequelize } from '../../db/connection'
import {
	UserAssignments,
	DeviceGroupList,
	PatientGroupList,
	UserAssignmentEnum,
} from '../../db/models'

export default {
	getByUserId: async (request, response) => {
		const { userId, areaId } = request.query
		try {
			const res = await UserAssignments.findAll({
				where: { user_id: userId },
				include: [
					{
						model: DeviceGroupList,
						where: { area_id: areaId },
						required: false, // left join
					},
					{
						model: PatientGroupList,
						where: { area_id: areaId },
						required: false, // left join
					},
				],
			})
			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
	getGroupIdListByUserId: async (request, response) => {
		const { userId, areaId } = request.query
		try {
			const res = await UserAssignments.findAll({
				where: {
					user_id: userId,
					status: UserAssignmentEnum.STATUS.ON_GOING,
				},
				include: [
					{
						model: DeviceGroupList,
						where: { area_id: areaId },
						required: false, // left join
					},
					{
						model: PatientGroupList,
						where: { area_id: areaId },
						required: false, // left join
					},
				],
			})
			const data = res.map(({ group_list_id }) => parseInt(group_list_id))
			response.status(200).json(data)
		} catch (e) {
			console.log(e)
		}
	},
	accept: async (request, response) => {
		const { userId, groupListIds, assignmentType } = request.body
		try {
			const findResult = await UserAssignments.findAll({
				attributes: ['id', 'group_list_id'],
				where: {
					user_id: userId,
					group_list_id: groupListIds,
					assignment_type: assignmentType,
				},
				raw: true,
			})
			const foundIds = findResult.map((obj) => parseInt(obj.id))
			await UserAssignments.update(
				{
					assigned_time: sequelize.literal('CURRENT_TIMESTAMP'),
					completed_time: null,
					status: UserAssignmentEnum.STATUS.ON_GOING,
				},
				{
					where: {
						id: foundIds,
					},
				}
			)
			const foundGroupListIds = findResult.map((obj) =>
				parseInt(obj.group_list_id)
			)
			const restGroupListIds = groupListIds.filter(
				(f) => !foundGroupListIds.includes(f)
			)
			if (restGroupListIds.length > 0) {
				const insertRows = restGroupListIds.map((id) => {
					return {
						user_id: userId,
						assignment_type: assignmentType,
						group_list_id: id,
						assigned_time: sequelize.literal('CURRENT_TIMESTAMP'),
						completed_time: null,
						status: UserAssignmentEnum.STATUS.ON_GOING,
					}
				})
				await UserAssignments.bulkCreate(insertRows)
			}
			response.status(200).json('ok')
		} catch (e) {
			console.log(e)
		}
	},
	finish: async (request, response) => {
		const { userId, groupListIds } = request.body
		try {
			const res = await UserAssignments.update(
				{
					completed_time: sequelize.literal('CURRENT_TIMESTAMP'),
					status: UserAssignmentEnum.STATUS.COMPLETED,
				},
				{
					where: {
						user_id: userId,
						group_list_id: groupListIds,
					},
				}
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
	cancel: async (request, response) => {
		const { userId, groupListIds } = request.body
		try {
			const res = await UserAssignments.update(
				{
					completed_time: null,
					status: UserAssignmentEnum.STATUS.CANCEL,
				},
				{
					where: {
						user_id: userId,
						group_list_id: groupListIds,
					},
				}
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
}
