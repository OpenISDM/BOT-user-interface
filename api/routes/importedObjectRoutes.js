let importedObjectController = require('../controllers/importedObjectController');
let cors = require('cors')

module.exports = app => {

    // enable pre-flight request for DELETE request
    app.options('/data/importedObject', cors()) 

    app.route('/data/importedObject')
        .get(importedObjectController.getImportedObject)
        .delete(importedObjectController.deleteImportedObject)


    
}