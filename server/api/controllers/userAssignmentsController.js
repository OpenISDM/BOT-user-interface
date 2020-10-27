/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userAssignmentsController.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import 'dotenv/config'
import { sequelize } from '../db/connection'
import UserAssignments, {
	UserAssignmentEnum,
} from '../db/model/userAssignments'
import DeviceGroupList from '../db/model/deviceGroupList'
import PatientGroupList from '../db/model/patientGroupList'

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
						user_id: userId,
						id: foundIds,
						assignment_type: assignmentType,
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
		const { userId, groupListIds, assignmentType } = request.body
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
						assignment_type: assignmentType,
					},
				}
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
	cancel: async (request, response) => {
		const { userId, groupListIds, assignmentType } = request.body
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
						assignment_type: assignmentType,
					},
				}
			)
			response.status(200).json(res)
		} catch (e) {
			console.log(e)
		}
	},
}
