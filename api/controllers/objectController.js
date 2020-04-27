require('dotenv').config();
require('moment-timezone');
const exec = require('child_process').execFile;
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

const addObject = (request, response) => {
    const {
        formOption,
        mode
    } = request.body

    let query;

    switch(mode) {
        case 'PERSONA':
            query = dbQueries.addPersona(formOption);
            break;
        case 'DEVICE':
            query = dbQueries.addObject(formOption);
            break;
    }

    pool.query(query)
        .then(res => {
            console.log(`add ${mode} succeed`);
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`add ${mode} failed ${err}`);
        })
}

const editObject = (request, response) => {
    const {
        formOption,
        mode
    } = request.body

    let {
        area_id
    } = formOption

    switch(mode) {
        case 'PERSONA':
            query = dbQueries.editPersona(formOption);
            break;
        case 'DEVICE':
            query = dbQueries.editObject(formOption);
            break;
    }

    pool.query(query)
        .then(res => {
            console.log(`edit ${mode} succeed`);
            if (process.env.RELOAD_GEO_CONFIG_PATH) {
                exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_object -f area_one -a ${area_id}`.split(' '), function(err, data){
                    if(err){
                        console.log(`execute reload geofence setting fails ${err}`)
                        response.status(200).json(res)
                    }else{
                        console.log(`execute reload geofence setting success`)
                        response.status(200).json(res)
                    }
                })
            } else {
                response.status(200).json(res)
                console.log('IPC has not set')
            }
        })
        .catch(err => {
            console.log(`edit ${mode} failed ${err}`)
        })
}

const deleteObject = (request, response) => {
    const { formOption } = request.body
    pool.query(dbQueries.deleteObject(formOption))
        .then(res => {
            console.log('delete object succeed')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete object failed ${err}`)
        })
}

module.exports = {
    getObject,
    addObject,
    editObject,
    deleteObject
}
