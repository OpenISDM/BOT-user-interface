import {
	signin,
	signout,
	validation,
	sentResetPwdInstruction,
	resetPassword,
} from '../../controllers/internal/auth'

export default (app) => {
	app.route('/data/auth/signin').post(signin)
	app.route('/data/auth/signout').post(signout)
	app.route('/data/auth/validation').post(validation)
	app.route('/data/auth/sentResetPwdInstruction').post(sentResetPwdInstruction)
	app.route('/data/auth/resetpassword').post(resetPassword)
}
