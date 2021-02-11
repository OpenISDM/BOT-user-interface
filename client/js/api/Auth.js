import { post } from '../utils/request'

const auth = {
	signin: '/data/auth/signin',
	signout: '/data/auth/signout',
	validation: '/data/auth/validation',
	resetPassword: '/data/auth/resetpassword',
	sentResetPwdInstruction: '/data/auth/sentResetPwdInstruction',
}

async function confirmValidation({ username, password, authenticatedRoles }) {
	return await post(auth.validation, {
		username,
		password,
		authenticatedRoles,
	})
}

async function sentResetPwdInstruction({ email }) {
	return await post(auth.sentResetPwdInstruction, {
		email,
	})
}

async function resetPassword({ token, account, password }) {
	return await post(auth.resetPassword, {
		token,
		account,
		password,
	})
}

async function logout() {
	return await post(auth.signout)
}

async function login({ username, password }) {
	return await post(auth.signin, {
		username,
		password,
	})
}

export default {
	confirmValidation,
	sentResetPwdInstruction,
	resetPassword,
	logout,
	login,
}
