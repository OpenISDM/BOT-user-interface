require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/objectQueries')
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

const getObject = (request, response) => {
    let { 
        locale, 
        areas_id,
        objectType 
    } = request.query

    pool.query(dbQueries.getObject(objectType, areas_id))       
        .then(res => {
            console.log('get object table succeed')
            res.rows.map(item => {
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })

            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get object table failed ${err}`)
        })     
}

module.exports = {
    getObject
}
