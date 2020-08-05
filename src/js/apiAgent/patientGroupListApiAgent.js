/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        deviceGroupListApiAgent.js

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


import dataSrc from '../dataSrc';
import axios from 'axios';
import config from '../config';

const src = dataSrc.patientGroupList;

const patientGroupListApis = {
    addPatientGroupList: async function(
        name
    ) {
        console.log('add', src)
        return await axios.post(src, {
            name
        })
    },
    getPatientGroupList: async function(
        name
    ) {
        return await axios.get(src, {
            name
        })
    },
    modifyPatientGroupList: async function( pack ) {
        return await axios.put(src, pack)
    },
    deleteGroup: async function( groupId ) {
        return await axios.put(src, groupId)
    },
    // getGeofenceConfig: async function(
    //     type, 
    //     areasId,
    //     isGetLbeaconPosition = false
    // ) {
        
        
    // },

    // delete: async function(
    //     configPackage
    // ) {
    //     return await axios.delete(src, {
    //         data: {
    //             configPackage
    //         }
    //     })
    // },

    // add: async function(
    //     configPackage
    // ) {
    //     return await axios.patch(src, {
    //         configPackage
    //     })
    // },

    // setGeofenceConfig: async function(
    //     configPackage
    // ) {
    //     return await axios.put(src, {
    //         configPackage
    //     })
    // } 

}


export default patientGroupListApis
