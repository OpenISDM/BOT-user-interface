/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        authController.js

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
const dbQueries = require('../db/dbQueries/authQueries');
const pool = require('../db/dev/connection');
const encrypt = require('../config/encrypt');

module.exports = {

    signin: (request, response) => {
        let { 
            password,
            username
        } = request.body

        pool.query(dbQueries.signin(username.toLowerCase()))
            .then(res => {
                if (res.rowCount < 1) { 
                    console.log(`signin failed: username or password is incorrect`)
                    response.json({
                        authentication: false,
                        message: "Username or password is incorrect"
                    })
                } else { 
                
                    const hash = encrypt.createHash(password);

                    if (hash == res.rows[0].password) {
                        let { 
                            name, 
                            roles, 
                            permissions,
                            mydevice, 
                            freq_search_count,
                            areas_id,
                            id,
                            main_area,
                            locale_id,
                            locale
                        } = res.rows[0]

                        if (main_area && !areas_id.includes(main_area)) {
                            areas_id.push(main_area.toString())
                        }

                        let userInfo = {
                            name,
                            myDevice: mydevice || [],
                            roles,
                            permissions,
                            freqSearchCount: freq_search_count,
                            id,
                            areas_id,
                            main_area,
                            locale_id,
                            locale
                        }

                        /** Set session */
                        request.session.regenerate(()=>{})
                        request.session.user = name

                        response.status(200).json({
                            authentication: true,
                            userInfo
                        })

                        pool.query(dbQueries.setVisitTimestamp(username))
                            .then(res =>  console.log(`sign in success: ${name}`))
                            .catch(err => console.log(`set visit timestamp fails ${err}`))

                    } else { 
                        response.json({
                            authentication: false,
                            message: "password is incorrect"
                        })
                    }
                }
            })

            .catch(err => {
                console.log(`sigin fails ${err}`)       
            })
    },

    signout: (req, res) => {
        req.session.destroy(() => {
            console.log('session is destroyed')
        })
        res.status(200).json()
    },

    validation: (request, response) => {
        let { 
            username, 
            password 
        } = request.body 
        pool.query(dbQueries.validation(username))
            .then(res => {
                if (res.rowCount < 1) {
                    console.log(`confirm validation failed: incorrect`)
                    response.json({
                        confirmation: false,
                        message: 'incorrect'
                    })
                } else {
    
                    const hash = encrypt.createHash(password);
                    
                    if (hash == res.rows[0].password) {
                        let { 
                            roles, 
                        } = res.rows[0] 
                        /** authenticate if user is care provider */
                        if (roles.includes('3') || roles.includes('4')) {
    
                            console.log(`confirm validation succeed`)
                            response.json({
                                confirmation: true,
                            })
                        } else {
    
                            console.log(`confirm validation failed: authority is not enough`)
                            response.json({
                                confirmation: false,
                                message: 'authority is not enough'
                            })
                        }
                    } else {
                        console.log(`confirm validation failed: password is incorrect`)
                        response.json({
                            confirmation: false,
                            message: 'password incorrect'
                        })
                    }
                }
            })
            .catch(err => {
                console.log(`confirm validation fails ${err}`)
            })
    }
}

