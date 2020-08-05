/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectController.js

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


require('dotenv').config();
require('moment-timezone');
const exec = require('child_process').execFile;
const moment = require('moment');
const dbQueries = require('../db/dbQueries/patientGroupListQueries');
const recordQueries = require('../db/dbQueries/recordQueries');
const pool = require('../db/dev/connection');
const pdf = require('html-pdf');
const path = require('path');

module.exports = {

    getPatientGroupList : (request, response) => {
        let query = dbQueries.getPatientGroup(request.body)
        pool.query(query)
        .then(res => {
            response.status(200).json(res.rows)
        })
        .catch(err => {
            console.log('addPatientGroup error: ', err)
        })
    },
    addPatientGroupList : (request, response) => {
        const {name} = request.body
        let query = dbQueries.addPatientGroup(name ? name : 'New Group')
        pool.query(query)
        .then(res => {
            response.status(200).json("ok")
        })
        .catch(err => {
            console.log('addPatientGroup error: ', err)
        })
    },
    modifyPatientGroupList : (request, response) => {
        let {groupId, mode, itemACN, newName} = request.body
        console.log(groupId, mode, itemACN)
        let query = null
        if(mode == 0){
            query = dbQueries.modifyPatientGroup(groupId, 0, itemACN)
        }else if(mode == 1){
            query = dbQueries.modifyPatientGroup(groupId, 1, itemACN)
        }else if(mode == 2){
            query = dbQueries.modifyPatientGroup(groupId, 2, newName)
        }
        pool.query(query)
            .then(res => {
                response.status(200).json('ok')
            }).catch(err => {
                console.log('err when modifyPatientGroup', err)
            })
    },
    changePatientList : (request, response) => {
        const {patient_group_id, user_id} = request.body
        const query = queryType.changePatientGroup(patient_group_id, user_id)
        pool.query(query).then(res => {
            console.log('success')
            response.status(200).json('ok')
        }).catch(err => {
            console.log('error when change patient group,', err)
        })
    },
    deletePatientGroup : (request, response) => {
        const {patient_group_id, user_id} = request.body
        const query = queryType.changePatientGroup(patient_group_id, user_id)
        pool.query(query).then(res => {
            console.log('success')
            response.status(200).json('ok')
        }).catch(err => {
            console.log('error when change patient group,', err)
        })
    }
}