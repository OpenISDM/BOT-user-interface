import objectController from '../../controllers/internal/object'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/object', cors())
	app.options('/data/object/:type', cors())
	app.options('/data/objectPackage', cors())
	app.options('/data/object/searchableKeyword', cors())

	app
		.route('/data/object')
		.get(objectController.getObjectList)
		.delete(objectController.deleteObject)
		.patch(objectController.disassociate)

	app
		.route('/data/object/device')
		.post(objectController.addDevice)
		.put(objectController.editDevice)

	app
		.route('/data/object/person')
		.post(objectController.addPerson)
		.put(objectController.editPerson)

	app.route('/data/objectPackage').put(objectController.editObjectPackage)

	app.route('/data/object/mac/idle').post(objectController.getIdleMacaddr)

	app.route('/data/object/acn').get(objectController.getAcnSet)

	app
		.route('/data/object/alias')
		.get(objectController.getAliases)
		.put(objectController.editAlias)

	app.route('/data/object/aliases').put(objectController.editAliases)

	app.route('/data/object/nickname').post(objectController.editNickname)

	app
		.route('/data/object/searchableKeyword')
		.post(objectController.getSearchableKeywords)
}
