require('dotenv').config();
require('moment-timezone');
const bcrypt = require('bcrypt');
const moment = require('moment');
const queryType = require('../../web_server/queryType');
const dbQueries = require('../db/dbQueries/userQueries');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config);

const getAllUser = (request, response) => {
    let { locale } = request.query
    pool.query(dbQueries.getAllUser())
        .then(res => {
            console.log('get all user succeed')
            res.rows.map(item => {
                item.last_visit_timestamp = 
                    item.last_visit_timestamp && 
                    moment.tz(item.last_visit_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT);
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ)
                    .locale(locale)
                    .format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get all user failed ${err}`)
        })
}

const addUser = (request, response) => {

    const { 
        name, 
        password, 
        roles,
        area_id,
    } = request.body;    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const signupPackage = {
        name,
        password: hash,
        area_id
    }

    pool.query(dbQueries.addUser(signupPackage))
        .then(res => {
            pool.query(dbQueries.insertUserData(name, roles, area_id))
                .then(res => {
                    console.log('sign up succeed')
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log(`sinup failed ${err}`)
                })
        })
        .catch(err => {
            console.log(`signup failed ${err}`)
        })
}

const editUserInfo = (request, response) => { 
    var {
        user
    } = request.body
    pool.query(dbQueries.editUserInfo(user))
        .then(res => {
            console.log(`edit user info succeed`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`edit user info failed ${err}`)
        })
}

const deleteUser = (request, response) => {
    var username = request.body.username
    pool.query(dbQueries.deleteUser(username))
        .then(res => {
            console.log('delete user succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete user failed ${err}`)
        })  
}

module.exports = {
    getAllUser,
    addUser,
    editUserInfo,
    deleteUser
}