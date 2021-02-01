/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        agentController.js

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
import { AgentTable } from '../../db/models'

export default {
	getAllAgents: async (request, response) => {
		try {
			const res = await AgentTable.findAll()
			console.log('get agent table succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`get agent table failed ${e}`)
		}
	},

	deleteAgent: async (request, response) => {
		const { ids } = request.body
		try {
			const res = await AgentTable.destroy({ where: { id: ids } })
			console.log('delete Agents record succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`delete agents failed ${e}`)
		}
	},

	editAgent: async (request, response) => {
		const { id, comment } = request.body
		try {
			const res = await AgentTable.update({ comment }, { where: { id } })
			console.log('edit Agents succeed')
			response.status(200).json(res)
		} catch (e) {
			console.log(`edit Agents failed ${e}`)
		}
	},
}
