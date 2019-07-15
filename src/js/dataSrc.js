const IP = 'localhost:3000';//'bot.iis.sinica.edu.tw'

const trackingData = 'http://' + IP + '/data/trackingData';
const objectTable = 'http://' + IP + '/data/objectTable';
const lbeaconTable = 'http://' + IP + '/data/lbeaconTable';
const gatewayTable = 'http://' + IP + '/data/gatewayTable';
const searchResult = 'http://' + IP + '/data/searchResult';
const geofenceData = 'http://' + IP + '/data/geofenceData';

const editObject = 'http://' + IP + '/data/editObject';
const addObject = 'http://' + IP + '/data/addObject';

const editObjectPackage = 'http://' + IP +'/data/editObjectPackage';
const signin = 'http://' + IP + '/user/signin';
const signup = 'http://' + IP + '/user/signup';
const userInfo = 'http://' + IP + '/user/info';
const userSearchHistory = 'http://' + IP + '/user/searchHistory'
const addUserSearchHistory = 'http://' + IP + '/user/addUserSearchHistory'
const editLbeacon = 'http://' + IP + '/data/editLbeacon'

module.exports = {
    trackingData,
    objectTable,
    lbeaconTable,
    gatewayTable,
    searchResult,
    geofenceData,
    editObject,
    addObject,
    editObjectPackage,
    signin,
    signup,
    userInfo,
    userSearchHistory,
    addUserSearchHistory,
    editLbeacon
};
