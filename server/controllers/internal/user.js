/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userController.js

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
import dbQueries from '../../db/userQueries'
import pool, { updateOrCreate } from '../../db/connection'
import { UserTable, UserArea, UserRole } from '../../db/models'
import authQueries from '../../db/authQueries'
import { encrypt } from '../../helpers'

export default {
	getAllUser: (request, response) => {
		pool
			.query(dbQueries.getAllUser())
			.then((res) => {
				console.log('get all user succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get all user failed ${err}`)
			})
	},

	addUser: (request, response) => {
		const { user } = request.body
		const { name, password, email, roles, areaIds } = user
		const hash = encrypt.createHash(password)
		const signupPackage = {
			name: name.toLowerCase(),
			password: hash,
			email,
		}
		request.session.regenerate(() => {
			request.session.user = name
		})

		pool.query(authQueries.signin(name)).then((ress) => {
			if (ress.rowCount < 1) {
				pool
					.query(dbQueries.addUser(signupPackage))
					.then(() => {
						pool
							.query(
								dbQueries.insertUserData(name.toLowerCase(), roles, areaIds)
							)
							.then((res) => {
								console.log('sign up succeed')
								response.status(200).json(res)
							})
							.catch((err) => {
								console.log(`addUser failed ${err}`)
							})
					})
					.catch((err) => {
						console.log(`addUser failed ${err}`)
					})
			} else {
				console.log('addUser failed : repeat username')
			}
		})
	},

	setUserInfo: async (request, response) => {
		const { user } = request.body
		const { name, email, id, roleIds, areaIds } = user

		try {
			let promises = []

			// remove role and area first
			promises.push(
				UserRole.destroy({
					where: { user_id: user.id },
				})
			)
			promises.push(
				UserArea.destroy({
					where: { user_id: user.id },
				})
			)

			await Promise.all(promises)

			// set user info
			promises = []
			promises.push(
				updateOrCreate({
					model: UserTable,
					where: { id },
					newItem: { name, email },
				})
			)

			if (roleIds && roleIds.length > 0) {
				roleIds.forEach((roleId) =>
					promises.push(
						updateOrCreate({
							model: UserRole,
							where: { user_id: id, role_id: roleId },
							newItem: { user_id: id, role_id: roleId },
						})
					)
				)
			}

			if (areaIds && areaIds.length > 0) {
				areaIds.forEach((areaId) =>
					promises.push(
						updateOrCreate({
							model: UserArea,
							where: { user_id: id, area_id: areaId },
							newItem: { user_id: id, area_id: areaId },
						})
					)
				)
			}

			const res = await Promise.all(promises)

			response.status(200).json(res)
		} catch (e) {
			console.log(`setUserInfo failed ${e}`)
		}
	},

	deleteUser: (request, response) => {
		const username = request.body.username

		pool
			.query(dbQueries.deleteUser(username))
			.then((res) => {
				console.log('delete user succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`delete user failed ${err}`)
			})
	},

	editSecondaryArea: (request, response) => {
		const { user } = request.body

		pool
			.query(dbQueries.editSecondaryArea(user))
			.then((res) => {
				console.log('set secondary area succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`set secondary area failed ${err}`)
			})
	},

	editPassword: (request, response) => {
		const { user_id, password } = request.body
		const hash = encrypt.createHash(password)

		pool
			.query(dbQueries.editPassword(user_id, hash))
			.then((res) => {
				console.log('edit password succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`edit password failed ${err}`)
			})
	},

	setLocale: (request, response) => {
		const { userId, localeName } = request.body

		pool
			.query(dbQueries.setLocale(userId, localeName))
			.then((res) => {
				console.log('set locale succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`set locale failed ${err}`)
			})
	},

	addSearchHistory: (request, response) => {
		const { username, keyType, keyWord } = request.body

		pool
			.query(dbQueries.addSearchHistory(username, keyType, keyWord))
			.then((res) => {
				console.log('add user searech history success')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add user search history fails ${err}`)
			})
	},

	editMaxSearchHistoryCount: (request, response) => {
		const { username, info } = request.body

		pool
			.query(dbQueries.editMaxSearchHistoryCount(username, info))
			.then(() => {
				console.log('modify user info success')
				response.status(200).send('ok')
			})
			.catch((err) => {
				console.log(`modify user info fail ${err}`)
			})
	},

	editKeywordType: (request, response) => {
		const { userId, keywordTypeId } = request.body

		pool
			.query(dbQueries.editKeywordType(userId, keywordTypeId))
			.then((res) => {
				console.log('edit keyword type succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`edit keyword type failed ${err}`)
			})
	},
}
