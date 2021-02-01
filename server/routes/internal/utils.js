import utilsController from '../../controllers/internal/utils'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/utils/searchableKeyword', cors())

	app
		.route('/data/utils/searchableKeyword')
		.post(utilsController.getSearchableKeywords)
}
