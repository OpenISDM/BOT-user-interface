import userController from '../../controllers/internal/user'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/user', cors())

	app.options('/data/user/searchHistory', cors())

	app.options('/data/user/keywordType', cors())

	app.options('/data/user/sentResetPwdInstruction', cors())

	app
		.route('/data/user')
		.get(userController.getAllUser)
		.delete(userController.deleteUser)
		.post(userController.addUser)
		.put(userController.setUserInfo)

	app.route('/data/user/area/secondary').post(userController.editSecondaryArea)

	app.route('/data/user/password').post(userController.editPassword)

	app.route('/data/user/locale').post(userController.setLocale)

	app.route('/data/user/searchHistory').put(userController.addSearchHistory)

	app
		.route('/data/user/maxSearchHistoryCount')
		.post(userController.editMaxSearchHistoryCount)

	app.route('/data/user/keywordType').put(userController.editKeywordType)
}
