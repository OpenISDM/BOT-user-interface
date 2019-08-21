const IP = 'http://140.109.22.249:3000';//'bot.iis.sinica.edu.tw'

const trackingData = IP + '/data/trackingData';
const branches = IP + '/data/branches'
const objectTable = IP + '/data/objectTable';
const lbeaconTable = IP + '/data/lbeaconTable';
const gatewayTable = IP + '/data/gatewayTable';
const searchResult = IP + '/data/searchResult';
const geofenceData = IP + '/data/geofenceData';

const editObject = IP + '/data/editObject';
const addObject = IP + '/data/addObject';

const editObjectPackage = IP +'/data/editObjectPackage';
const signin = IP + '/test/signin';
const signup = IP + '/test/signup';
const modifyUserDevice = IP + '/test/modifyUserDevices';
const userInfo = IP + '/test/userInfo';
const userSearchHistory = IP + '/test/userSearchHistory'
const addUserSearchHistory = IP + '/user/addUserSearchHistory'
const editLbeacon = IP + '/data/editLbeacon'
const getUserRole = IP + '/test/getUserRole'
const setUserRole = IP + '/test/setUserRole'
const getRoleNameList = IP + '/test/getRoleNameList'
const getUserList = IP + '/test/getUserList'
const removeUser = IP + '/test/removeUser'

const pdfUrl = function(path){
    return IP + '/' + path
}

const QRCode = IP + '/data/QRCOde'
const PDFInfo = IP + '/test/getShiftChangeRecord'



module.exports = {
    IP,
    trackingData,
    branches,
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
    modifyUserDevice,
    userInfo,
    userSearchHistory,
    addUserSearchHistory,
    editLbeacon,
    pdfUrl,
    QRCode,
    PDFInfo,
    getUserRole,
    setUserRole,
    getRoleNameList,
    getUserList,
    removeUser
};
