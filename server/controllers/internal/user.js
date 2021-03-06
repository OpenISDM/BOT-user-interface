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

	addUser: async (request, response) => {
		const { user } = request.body
		const { name, password, email, roleIds, areaIds } = user
		const hash = encrypt.createHash(password)
		const signupPackage = {
			name: name.toLowerCase(),
			password: hash,
			email,
		}

		request.session.regenerate(() => {
			request.session.user = name
		})

		const authQueried = await pool.query(authQueries.signin(name))
		if (authQueried && authQueried.rowCount < 1) {
			try {
				const addUserQueried = await pool.query(
					dbQueries.addUser(signupPackage)
				)
				if (addUserQueried && addUserQueried.rowCount > 0) {
					const userId = addUserQueried.rows[0].id
					await pool.query(dbQueries.insertUserData(userId, roleIds, areaIds))
				}
			} catch (e) {
				console.log(`addUser failed ${e}`)
			}
		} else {
			console.log('addUser signin failed : repeat username')
		}

		response.status(200).json('OK')
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

	setLastLoginArea: async (request, response) => {
		const { areaId, userId } = request.body
		try {
			await UserTable.update(
				{ last_login_area: areaId },
				{
					where: {
						id: userId,
					},
				}
			)
			response.status(200).json('OK')
		} catch (e) {
			console.log(`setLastLoginArea failed ${e}`)
		}
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
