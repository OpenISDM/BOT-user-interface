const gatewayController = require('../../controllers/gatewayController');
const cors = require('cors');

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/gateway', cors()) 

    app.route('/data/gateway')
        .get(gatewayController.getAllGateway)
        .delete(gatewayController.deleteGateway)
        .put(gatewayController.editGateway)

}