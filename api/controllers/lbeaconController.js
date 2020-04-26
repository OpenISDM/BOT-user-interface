require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/lbeaconQueries')
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

const getAllLbeacon= (request, response) => {

    let { locale } = request.body 
    pool.query(dbQueries.getLbeaconTable)
        .then(res => {
            console.log('get lbeacon table data succeed')
            res.rows.map(item => {
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log(`get lbeacon table failed ${err}`)
        })        
}

const deleteLBeacon = (request, response) => {
    const { 
        idPackage
     } = request.body
    pool.query(dbQueries.deleteLBeacon(idPackage))
        .then(res => {
            console.log('delete LBeacon record succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete LBeacon failed ${err}`)
        })
}

const editLbeacon = (request, response) => {
    const { formOption } = request.body
    pool.query(dbQueries.editLbeacon(formOption))
        .then(res => {
            console.log('edit lbeacon succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`edit lbeacon failed ${err}`)
        })
}

module.exports = {
    getAllLbeacon,
    deleteLBeacon,
    editLbeacon
}