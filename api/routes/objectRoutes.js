const objectController = require('../controllers/objectController');
let cors = require('cors');

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/object', cors()) 

    app.route('/data/object')
        .get(objectController.getObject)
        .post(objectController.addObject)
        .put(objectController.editObject)
        .delete(objectController.deleteObject)

}