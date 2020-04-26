const objectController = require('../controllers/objectController');

module.exports = app => {

    app.route('/data/object')
        .get(objectController.getObject);

}