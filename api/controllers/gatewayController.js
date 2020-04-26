require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/gatewayQueries');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

const getAllGateway = (request, response) => {

    let { locale } = request.body

    pool.query(dbQueries.getAllGateway)
        .then(res => {
            console.log(`get gateway table succeed`)
            res.rows.map(item => {
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log(`get gateway table failed ${err}`)                

        })
}

const deleteGateway = (request, response) => {
    const { idPackage } = request.body
    pool.query(dbQueries.deleteGateway(idPackage))
        .then(res => {
            console.log('delete Gateway record succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete gateway failed ${err}`)
        })
}

module.exports = {
    getAllGateway,
    deleteGateway,
}