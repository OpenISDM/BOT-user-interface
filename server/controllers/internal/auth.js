import 'dotenv/config'
import 'moment-timezone'
import dbQueries from '../../db/authQueries'
import pool from '../../db/connection'
import encrypt from '../../helpers/encrypt'
import mailer, { resetPasswordInstruction } from '../../helpers/mailer'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

export const signin = (request, response) => {
	const { password, username } = request.body

	pool
		.query(dbQueries.signin(username.toLowerCase()))
		.then((res) => {
			if (res.rowCount < 1) {
				console.log('signin failed: username or password is incorrect')
				response.json({
					authentication: false,
					message: 'Username or password is incorrect',
				})
			} else {
				const hash = encrypt.createHash(password)

				if (hash === res.rows[0].password) {
					const {
						name,
						roles,
						permissions,
						freq_search_count,
						search_history,
						area_ids,
						id,
						locale_id,
						locale,
						email,
						keyword_type,
						list_id,
						list_name,
						last_login_area,
					} = res.rows[0]

					const userInfo = {
						name,
						roles,
						permissions,
						freqSearchCount: freq_search_count,
						id,
						area_ids,
						locale_id,
						locale,
						searchHistory: search_history,
						email,
						keyword_type,
						list_id,
						list_name,
						last_login_area,
					}

					/** Set session */
					request.session.regenerate(() => {
						// do nothing
					})
					request.session.user = name

					response.status(200).json({
						authentication: true,
						userInfo,
					})

					pool
						.query(dbQueries.setVisitTimestamp(username))
						.then(() => console.log(`sign in success: ${name}`))
						.catch((err) => console.log(`set visit timestamp fails ${err}`))
				} else {
					response.json({
						authentication: false,
						message: 'password is incorrect',
					})
				}
			}
		})

		.catch((err) => {
			console.log(`sigin failed ${err}`)
		})
}

export const signout = (req, res) => {
	req.session.destroy(() => {
		console.log('session is destroyed')
	})
	res.status(200).json()
}

export const validation = (request, response) => {
	const { username, password } = request.body

	pool
		.query(dbQueries.signin(username.toLowerCase()))
		.then((res) => {
			if (res.rowCount < 1) {
				console.log('confirm validation failed: incorrect')
				response.json({
					confirmation: false,
					message: 'incorrect',
				})
			} else {
				const hash = encrypt.createHash(password)
				const { password: encodedPassword, roles } = res.rows[0]
				if (hash === encodedPassword) {
					/** authenticate if user is care provider */
					// TODO: Should have ENUM to keep the KEYWORD for care_provider
					if (roles.includes('care_provider')) {
						console.log('confirm validation succeed')
						response.json({
							confirmation: true,
						})
					} else {
						console.log('confirm validation failed: authority is not enough')
						response.json({
							confirmation: false,
							message: 'authority is not enough',
						})
					}
				} else {
					console.log('confirm validation failed: password is incorrect')
					response.json({
						confirmation: false,
						message: 'password incorrect',
					})
				}
			}
		})
		.catch((err) => {
			console.log(`confirm validation fails ${err}`)
		})
}

export const sentResetPwdInstruction = (request, response) => {
	const { email } = request.body

	pool
		.query(dbQueries.validateEmail(email))
		.then((res) => {
			if (res.rowCount !== 0) {
				const accountNameList = res.rows.map((item) => item.name)
				const { registered_timestamp } = res.rows[0]
				const token = jwt.sign(
					{
						exp: Math.floor(Date.now() / 1000) + 60 * 60,
						registered_timestamp,
						email,
					},
					encrypt.secret
				)

				const message = {
					from: process.env.EMAIL_SENDER_ADDRESS, // Sender address
					to: email,
					subject: resetPasswordInstruction.subject,
					text: resetPasswordInstruction.content(token, accountNameList),
				}

				mailer
					.sendMail(message)
					.then(() => {
						console.log('send password reset instruction succeed')
						response.status(200).json()
					})
					.catch((err) => {
						console.log(`send password reset instruction failed ${err}`)
					})
			} else {
				console.log('email address does not match')
				response.status(200).json({
					confirmation: false,
					message: 'email failed',
				})
			}
		})
		.catch((err) => {
			console.log(`email validation failed ${err}`)
		})
}

export const verifyResetPwdToken = (request, response) => {
	const token = request.params.token

	jwt.verify(token, encrypt.secret, (err) => {
		if (err) {
			response.redirect('/')
		} else {
			response.sendFile(
				path.join(__dirname, '..', '..', 'public', 'dist', 'index.html')
			)
		}
	})
}

export const resetPassword = (request, response) => {
	const { token, account, password } = request.body

	jwt.verify(token, encrypt.secret, (err, decoded) => {
		if (err) {
			console.log(`reset password failed ${err}`)
		} else {
			const { email } = decoded

			const hash = encrypt.createHash(password)

			pool
				.query(dbQueries.resetPassword(email, account, hash))
				.then(() => {
					console.log('reset password succeed')
					response.status(200).json()
				})
				.catch((err) => {
					console.log(`reset password failed ${err}`)
				})
		}
	})
}

export default {
	signin,
	signout,
	validation,
	sentResetPwdInstruction,
	verifyResetPwdToken,
	resetPassword,
}
