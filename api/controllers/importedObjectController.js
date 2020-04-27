require('dotenv').config();
require('moment-timezone');
const exec = require('child_process').execFile;
const moment = require('moment');
const dbQueries = require('../db/dbQueries/importedObjectQueries');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

const pool = new pg.Pool(config)

const getImportedObject = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(dbQueries.getImportedObject())       
        .then(res => {
            console.log(`get imported object`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get imported object failed ${err}`)
        })     
}

const deleteImportedObject = (request, response) => {
    const { idPackage } = request.body 
        pool.query(dbQueries.deleteImporedtObject(idPackage))
        .then(res => {
            console.log('delete imported object succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete imported object failed ${err}`)
        })
}

module.exports = {
    getImportedObject,
    deleteImportedObject
}
