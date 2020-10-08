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

import 'dotenv/config'
import moment from 'moment-timezone'
import dbQueries from '../db/dbQueries/objectQueries'
import recordQueries from '../db/dbQueries/recordQueries'
import pool from '../db/dev/connection'
import pdf from 'html-pdf'
import path from 'path'
import { reloadGeofenceConfig } from '../service/IPCService'

export default {
    getObject: (request, response) => {
        const { locale, areas_id, objectType } = request.query

        pool.query(dbQueries.getObject(objectType, areas_id))
            .then((res) => {
                console.log('get object table succeed')
                res.rows.map((item) => {
                    item.registered_timestamp = moment
                        .tz(item.registered_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT)
                })
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`get object table failed ${err}`)
            })
    },

    addDevice: (request, response) => {
        const { formOption, mode } = request.body

        pool.query(dbQueries.addObject(formOption))
            .then((res) => {
                console.log('add device succeed')

                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`add device failed ${err}`)
            })
    },

    addPerson: (request, response) => {
        const { formOption, mode } = request.body

        pool.query(dbQueries.addPersona(formOption))
            .then((res) => {
                console.log('add person succeed')

                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`add person failed ${err}`)
            })
    },

    /** Controller for editing device
     *  If the
     */
    editDevice: (request, response) => {
        const { formOption, mode } = request.body

        const { area_id } = formOption

        pool.query(dbQueries.editDevice(formOption))
            .then((res) => {
                console.log(`edit ${mode} succeed`)

                reloadGeofenceConfig(area_id)

                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`edit ${mode} failed ${err}`)
            })
    },

    editPerson: (request, response) => {
        const { formOption, mode } = request.body

        const { area_id } = formOption

        pool.query(dbQueries.editPersona(formOption))
            .then((res) => {
                console.log(`edit ${mode} succeed`)

                reloadGeofenceConfig(area_id)

                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`edit ${mode} failed ${err}`)
            })
    },

    deleteObject: (request, response) => {
        const { formOption } = request.body

        pool.query(dbQueries.deleteObject(formOption))
            .then((res) => {
                console.log('delete object succeed')

                const mac_address_original_arr = formOption
                    .filter((item) => item.mac_address)
                    .map((item) => item.mac_address)

                if (mac_address_original_arr.length != 0) {
                    pool.query(
                        dbQueries.deleteObjectSummaryRecord(
                            mac_address_original_arr
                        )
                    )
                        .then((res) => {
                            response.status(200).json(res)
                        })
                        .catch((err) => {
                            console.log(
                                `delete object summary record failed ${err}`
                            )
                        })
                } else {
                    response.status(200).json(res)
                }
            })
            .catch((err) => {
                console.log(`delete object failed ${err}`)
            })
    },

    disassociate: (request, response) => {
        const { formOption } = request.body
        pool.query(dbQueries.disassociate(formOption))
            .then((res) => {
                const mac_address_original_arr = res.rows.map(
                    (item) => item.mac_address
                )

                pool.query(
                    dbQueries.deleteObjectSummaryRecord(
                        mac_address_original_arr
                    )
                )
                    .then((res) => {
                        console.log('disassociate succeed')
                        response.status(200).json(res)
                    })
                    .catch((err) => {
                        console.log(
                            `delete object summary record failed ${err}`
                        )
                    })
            })
            .catch((err) => {
                console.log(`disassociate failed ${err}`)
            })
    },

    editObjectPackage: (request, response) => {
        const {
            formOption,
            username,
            pdfPackage,
            reservedTimestamp,
            locale,
        } = request.body
        console.log(formOption)
        pool.query(
            recordQueries.addEditObjectRecord(
                formOption,
                username,
                pdfPackage.path
            )
        )
            .then((res) => {
                const record_id = res.rows[0].id
                console.log('add edited object record succeed')

                pool.query(
                    dbQueries.editObjectPackage(
                        formOption,
                        username,
                        record_id,
                        reservedTimestamp
                    )
                )
                    .then((res) => {
                        console.log('edit object package succeed')
                        if (pdfPackage) {
                            pdf.create(
                                pdfPackage.pdf,
                                pdfPackage.options
                            ).toFile(
                                path.join(
                                    process.env.LOCAL_FILE_PATH,
                                    pdfPackage.path
                                ),
                                function (err, result) {
                                    if (err)
                                        return console.log(
                                            `edit object package error ${err}`
                                        )

                                    console.log('pdf create succeed')
                                    response.status(200).json(pdfPackage.path)
                                }
                            )
                        } else {
                            response.status(200).json()
                        }
                    })
                    .catch((err) => {
                        console.log(`edit object package failed ${err}`)
                    })
            })
            .catch((err) => {
                console.log(`edit object package failed ${err}`)
            })
    },

    getIdleMacaddr: (request, response) => {
        pool.query(dbQueries.getIdleMacaddr())
            .then((res) => {
                console.log('get idle mac address succeed')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`get idle mac address failed ${err}`)
            })
    },

    getAlias: (request, response) => {
        pool.query(dbQueries.getAlias())
            .then((res) => {
                console.log('get object type alias succeed')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`get object type alias failed ${err}`)
            })
    },

    editAlias: (request, response) => {
        const { objectType, alias } = request.body

        pool.query(dbQueries.editAlias(objectType, alias))
            .then((res) => {
                console.log('edit object type alias succeed')
                response.status(200).json(res)
            })
            .catch((err) => {
                console.log(`edit object type alias failed ${err}`)
            })
    },
}
