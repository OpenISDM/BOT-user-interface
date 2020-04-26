const objectController = require('../controllers/objectController');

module.exports = app => {

    app.route('/data/objects')
        .post(objectController.getAllObject);

    app.route('/data/objects:objectType')
        .get(objectController.getObjectType)
}