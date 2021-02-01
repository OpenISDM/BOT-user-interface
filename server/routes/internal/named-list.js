import NamedListController from '../../controllers/internal/named-list'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/namedList', cors())
	app.options('/data/namedList/*', cors())

	app
		.route('/data/namedList')
		.get(NamedListController.getNamedList)
		.post(NamedListController.setNamedList)
		.delete(NamedListController.removeNamedList)

	app
		.route('/data/namedList/without/type')
		.get(NamedListController.getNamedListWithoutType)

	app
		.route('/data/namedList/object')
		.post(NamedListController.addObject)
		.delete(NamedListController.removeObject)
}
