/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
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
const encrypt = require('../service/encrypt');
const mailTransporter = require('../service/mailTransporter');
const { resetPasswordInstruction } = require('../config/template');
const jwt = require('jsonwebtoken');
const path = require('path');
const { decode } = require('punycode');

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
                            freq_search_count,
                            search_history,
                            areas_id,
                            id,
                            main_area,
                            locale_id,
                            locale,
                            email
                        } = res.rows[0]

                        if (main_area && !areas_id.includes(main_area)) {
                            areas_id.push(main_area.toString())
                        }

                        let userInfo = {
                            name,
                            roles,
                            permissions,
                            freqSearchCount: freq_search_count,
                            id,
                            areas_id,
                            main_area,
                            locale_id,
                            locale,
                            searchHistory: search_history,
                            email
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
                console.log(`sigin failed ${err}`)       
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
            password,
            authenticatedRoles
        } = request.body 

        pool.query(dbQueries.signin(username.toLowerCase()))
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
                        if (!authenticatedRoles || roles.filter(role => authenticatedRoles.includes(role)).length !== 0) {
    
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
    },

    sentResetPwdInstruction: (request, response) => {
        const {
            email
        } = request.body;

        pool.query(dbQueries.validateEmail(email))
            .then(res => {
                if (res.rowCount != 0) {

                    let {
                        id,
                        password,
                        registered_timestamp
                    } = res.rows[0]
                    var token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        registered_timestamp,
                        email,
                    }, encrypt.secret);
            
                    const message = {
                        from: 'BiDaEAssistCenter@gmail', // Sender address
                        to: email,
                        subject: resetPasswordInstruction.subject, 
                        html: resetPasswordInstruction.content(token)
                    };
                    
                    mailTransporter.sendMail(message)
                        .then(res => {
                            console.log('send password reset instruction succeed')
                            response.status(200).json()
                        })
                        .catch(err => {
                            console.log(`send password reset instruction failed ${err}`)
                        })

                } else {
                    console.log(`email address does not match`)
                    response.status(200).json({
                        confirmation: false,
                        message: 'email failed'
                    })
                }
            })
            .catch(err => {
                console.log(`email validation failed ${err}`);
            })
    },
 
    verifyResetPwdToken: (request, response) => {
        let token = request.params.token

        jwt.verify(token, encrypt.secret, (err, decoded) => {
            if (err) {
                response.redirect('/')
            } else {
                response.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
            }
        })
    },
    
    resetPassword: (request, response) => {

        let {
            token,
            password
        } = request.body

        jwt.verify(token, encrypt.secret, (err, decoded) => {
            if (err) {
                console.log(`reset password failed ${err}`)
            } else {

                let {
                    email
                } = decoded

                const hash = encrypt.createHash(password);

                pool.query(dbQueries.resetPassword(email, hash))
                .then(res => {
                    console.log(`reset password succeed`)
                    response.status(200).json();
                })
                .catch(err => {
                    console.log(`reset password failed ${err}`)
                })
            }
        })
    

    }
}

