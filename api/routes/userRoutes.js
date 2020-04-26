let userController = require('../controllers/userController');
let cors = require('cors');

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/user', cors()) 

    app.route('/data/user')
        .get(userController.getAllUser)
        .delete(userController.deleteUser)
        .post(userController.addUser)


}
