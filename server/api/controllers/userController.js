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
import dbQueries from '../db/userQueries'
import pool from '../db/connection'
import authQueries from '../db/authQueries'
import encrypt from '../service/encrypt'

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
		const { name, password, email, roles, area_id } = user
		const hash = encrypt.createHash(password)
		const signupPackage = {
			name: name.toLowerCase(),
			password: hash,
			email,
			area_id,
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
								dbQueries.insertUserData(name.toLowerCase(), roles, area_id)
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

	setUserInfo: (request, response) => {
		const { user } = request.body

		pool
			.query(dbQueries.setUserInfo(user))
			.then((res) => {
				console.log('edit user info succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`edit user info failed ${err}`)
			})
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

	editMyDevice: (request, response) => {
		const { username, mode, acn } = request.body

		pool
			.query(dbQueries.editMyDevice(username, mode, acn))
			.then(() => {
				console.log('edit mydevice succeed')
				response.status(200).json()
			})
			.catch((err) => {
				console.log(`edit mydevice failed ${err}`)
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

	editListId: (request, response) => {
		const { userId, listId } = request.body

		pool
			.query(dbQueries.editListId(userId, listId))
			.then(() => {
				console.log('edit list id succeed')
				response.status(200).json(200)
			})
			.catch((err) => {
				console.log(`edit list id failed ${err}`)
			})
	},
}
