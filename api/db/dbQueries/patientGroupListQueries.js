/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectQueries.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

const getDeviceGroup = (pack) => {
    const groupIdSelector = pack.groupId ? `WHERE id = ${pack.groupId}` : ``
    const query = `
        SELECT  * FROM device_group ${groupIdSelector} ORDER BY id
    `
    return query
}

const addDeviceGroup = (name) => {
    const query = `
        INSERT INTO device_group_list (name) VALUES ('${name}')
    `
    return query
}

const modifyPatientGroup = (groupId, mode, option) => {
    var query = null
    if(mode === 0){
        var patientACN = option
        query = `UPDATE patient_group_list SET patients=array_append(patients, '${patientACN}') WHERE id=${groupId}`
    }else if(mode == 1){
        var patientACN = option
        query = `UPDATE patient_group_list SET patients=array_remove(patients, '${patientACN}') WHERE id=${groupId}`
    }else if(mode == 2){
        var newName = option
        query = `UPDATE patient_group_list SET name = ${newName} WHERE id=${groupId}`
    }

    return query
}
const changeDeviceGroup = (device_group_id, user_id) => {
    const query = `UPDATE user_table SET my_device_index = ${device_group_id} WHERE id = ${user_id}`
    return query
}
// INPUT pack = {groupId: [int]}
const getPatientGroup = (pack) => {
    // print('pack', pack)
    const groupIdSelector = pack.groupId ? `WHERE id = ${pack.groupId}` : ``
    const query = `
        SELECT  * FROM patient_group_list ${groupIdSelector} ORDER BY id
    `
    return query
}
// INPUT name = {'name': [text]}
const addPatientGroup = (name) => {
    const query = `
        INSERT INTO patient_group_list (name) VALUES ('${name.name}')
    `
    return query
}



const changePatientGroup = (patient_group_id, user_id) => {
    const query = `UPDATE user_table SET my_patient_index = ${patient_group_id} WHERE id = ${user_id}`
    return query
}




module.exports = {
    addPatientGroup,
    changePatientGroup,
    modifyPatientGroup,
    getPatientGroup
}