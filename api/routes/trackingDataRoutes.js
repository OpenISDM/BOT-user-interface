let trackingController = require('../controllers/trackingDataController');

module.exports = app => {
    app.route('/data/trackingData')
        .post(trackingController.getTrackingData)
}