const IP = 'https://140.109.22.249';//'bot.iis.sinica.edu.tw'

const trackingData = IP + '/data/trackingData';
const objectTable = IP + '/data/objectTable';
const lbeaconTable = IP + '/data/lbeaconTable';
const gatewayTable = IP + '/data/gatewayTable';
const searchResult = IP + '/data/searchResult';
const geofenceData = IP + '/data/geofenceData';

const editObject = IP + '/data/editObject';
const addObject = IP + '/data/addObject';

const editObjectPackage = IP +'/data/editObjectPackage';
const signin = IP + '/user/signin';
const signup = IP + '/user/signup';
const userInfo = IP + '/user/info';
const userSearchHistory = IP + '/user/searchHistory'
const addUserSearchHistory = IP + '/user/addUserSearchHistory'
const editLbeacon = IP + '/data/editLbeacon'

const pdfUrl = function(path){
    return IP + '/' + path
}

const QRCode = IP + '/data/QRCOde'



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
    editLbeacon,
    pdfUrl,
    QRCode
};
