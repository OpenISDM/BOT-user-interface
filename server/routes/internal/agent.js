import agentController from '../../controllers/internal/agent'
import cors from 'cors'

export default (app) => {
	// enable pre-flight request for DELETE request
	app.options('/data/agent', cors())

	app
		.route('/data/agent')
		.get(agentController.getAllAgents)
		.delete(agentController.deleteAgent)
		.put(agentController.editAgent)
}
