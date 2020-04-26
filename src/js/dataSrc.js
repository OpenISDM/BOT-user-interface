const dataSrcIP = process.env.DATASRC_IP;
const protocol = process.env.PROTOCOL;
const domain = `${protocol}://${dataSrcIP}`;
const getTrackingData = `${protocol}://${dataSrcIP}/data/getTrackingData`;
const getTrackingTableByMacAddress = `${protocol}://${dataSrcIP}/data/getTrackingTableByMacAddress`;
const getObjectTable = `${protocol}://${dataSrcIP}/data/getObjectTable`;
const getGatewayTable = `${protocol}://${dataSrcIP}/data/getGatewayTable`;
const searchResult = `${protocol}://${dataSrcIP}/data/searchResult`;
const editObject = `${protocol}://${dataSrcIP}/data/editObject`;
const setLocaleID = `${protocol}://${dataSrcIP}/data/setLocaleID`;
const editImport = `${protocol}://${dataSrcIP}/data/editImport`;
const editPatient = `${protocol}://${dataSrcIP}/data/editPatient`;
const addObject = `${protocol}://${dataSrcIP}/data/addObject`;
const addPatient= `${protocol}://${dataSrcIP}/data/addPatient`;
const getImportTable = `${protocol}://${dataSrcIP}/data/getImportTable`;
const getImportData = `${protocol}://${dataSrcIP}/data/getImportData`;
const addAssociation = `${protocol}://${dataSrcIP}/data/addAssociation`;
const addAssociation_Patient = `${protocol}://${dataSrcIP}/data/addAssociation_Patient`;
const cleanBinding = `${protocol}://${dataSrcIP}/data/cleanBinding`;
const editObjectPackage = `${protocol}://${dataSrcIP}/data/editObjectPackage`;
const signin = `${protocol}://${dataSrcIP}/user/signin`;
const editPassword = `${protocol}://${dataSrcIP}/user/editPassword`; 
const getUserInfo = `${protocol}://${dataSrcIP}/user/getUserInfo`;
const addUserSearchHistory = `${protocol}://${dataSrcIP}/user/addUserSearchHistory`;
const modifyMyDevice = `${protocol}://${dataSrcIP}/data/modifyMyDevice`;
const modifyUserInfo = `${protocol}://${dataSrcIP}/data/modifyUserInfo`;
const generatePDF = `${protocol}://${dataSrcIP}/data/generatePDF`;
const getShiftChangeRecord = `${protocol}://${dataSrcIP}/data/PDFInfo`;
const validateUsername = `${protocol}://${dataSrcIP}/validation/username`;
const getEditObjectRecord = `${protocol}://${dataSrcIP}/test/getEditObjectRecord`;
const deleteEditObjectRecord = `${protocol}://${dataSrcIP}/test/deleteEditObjectRecord`
const deleteShiftChangeRecord = `${protocol}://${dataSrcIP}/test/deleteShiftChangeRecord`
const deletePatient = `${protocol}://${dataSrcIP}/test/deletePatient`
const deleteDevice = `${protocol}://${dataSrcIP}/test/deleteDevice`
const deleteImportData = `${protocol}://${dataSrcIP}/test/deleteImportData`
const deleteGateway= `${protocol}://${dataSrcIP}/test/deleteGateway`
const getRoleNameList = `${protocol}://${dataSrcIP}/test/getRoleNameList`
const getAreaTable = `${protocol}://${dataSrcIP}/data/getAreaTable`
const getGeofenceConfig = `${protocol}://${dataSrcIP}/data/getGeofenceConfig`
const setGeofenceConfig = `${protocol}://${dataSrcIP}/data/setGeofenceConfig`
const addShiftChangeRecord = `${protocol}://${dataSrcIP}/data/addShiftChangeRecord`
const checkoutViolation = `${protocol}://${dataSrcIP}/data/checkoutViolation`
const confirmValidation = `${protocol}://${dataSrcIP}/data/confirmValidation`
const getMonitorConfig = `${protocol}://${dataSrcIP}/data/getMonitorConfig`
const setMonitorConfig = `${protocol}://${dataSrcIP}/data/setMonitorConfig`
const addMonitorConfig = `${protocol}://${dataSrcIP}/data/addMonitorConfig`
const addGeofenceConfig = `${protocol}://${dataSrcIP}/data/addGeofenceConfig`
const deleteMonitorConfig = `${protocol}://${dataSrcIP}/data/deleteMonitorConfig`
const backendSearch = `${protocol}://${dataSrcIP}/data/backendSearch`
const getSearchQueue = `${protocol}://${dataSrcIP}/data/getSearchQueue`
const objectImport = `${protocol}://${dataSrcIP}/data/objectImport`
const getImportPatient = `${protocol}://${dataSrcIP}/data/getImportPatient`
const pinImage = `${protocol}://${dataSrcIP}/image/pinImage`
const getTransferredLocation = `${protocol}://${dataSrcIP}/data/getTransferredLocation`
const modifyTransferredLocation= `${protocol}://${dataSrcIP}/data/modifyTransferredLocation`
const setMonitorEnable = `${protocol}://${dataSrcIP}/data/setMonitorEnable`
const getRolesPermission= `${protocol}://${dataSrcIP}/data/getRolesPermission`
const modifyPermission= `${protocol}://${dataSrcIP}/data/modifyPermission`
const modifyRolesPermission= `${protocol}://${dataSrcIP}/data/modifyRolesPermission`
const getLocationHistory = `${protocol}://${dataSrcIP}/data/getLocationHistory`
const setUserSecondaryArea = `${protocol}://${dataSrcIP}/data/setUserSecondaryArea`
const addPatientRecord = `${protocol}://${dataSrcIP}/data/addPatientRecord`
const exportCSV = `${protocol}://${dataSrcIP}/exportCSV`
const exportPDF = `${protocol}://${dataSrcIP}/exportPDF`;

const getUrl = url => {
    return domain + url
}
const trackingData = `${domain}/data/trackingData`;
const lbeacon = `${domain}/data/lbeacon`;
const gateway = `${domain}/data/gateway`;
const user = `${domain}/data/user`;

// const trackingData = `${protocol}://${dataSrcIP}/data/trackingData`;



const pdfUrl = function (path) {
    return `${protocol}://${dataSrcIP}/${path}`
}
module.exports = {
    trackingData,
    lbeacon,
    gateway,
    user,


    domain,
    // getTrackingData,
    getTrackingTableByMacAddress,
    getImportData,
    addAssociation,
    addAssociation_Patient,
    editImport,
    cleanBinding,
    getObjectTable,
    getImportTable,
    getImportPatient,
    getGatewayTable,
    getMonitorConfig,
    getTransferredLocation,
    searchResult,
    editObject,
    setLocaleID,
    deletePatient,
    editPatient,
    addObject,
    addPatient,
    editObjectPackage,
    signin,
    editPassword,
    getUserInfo,
    objectImport,
    addUserSearchHistory,
    pdfUrl,
    generatePDF,
    modifyMyDevice,
    modifyUserInfo,
    deleteDevice,
    deleteImportData,
    deleteGateway,
    getShiftChangeRecord,
    validateUsername,    
    getEditObjectRecord,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    getRoleNameList,
    getAreaTable,
    getGeofenceConfig,
    setGeofenceConfig,
    addShiftChangeRecord,
    checkoutViolation,
    confirmValidation,
    setMonitorConfig,
    backendSearch,
    getSearchQueue, 
    pinImage,
    addGeofenceConfig,
    deleteMonitorConfig,
    addMonitorConfig,
    modifyTransferredLocation,
    setMonitorEnable,
    modifyTransferredLocation, 
    getRolesPermission,
    modifyPermission,
    modifyRolesPermission,
    getLocationHistory,
    setUserSecondaryArea,
    addPatientRecord,
    exportCSV,
    exportPDF
};
