let lbeaconController = require('../controllers/lbeaconController');
let cors = require('cors')

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/lbeacon', cors()) 

    app.route('/data/lbeacon')
        .get(lbeaconController.getAllLbeacon)
        .delete(lbeaconController.deleteLBeacon)
        .put(lbeaconController.editLbeacon)

    
}