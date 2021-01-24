/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        connection.js

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

import pkg from 'sequelize'
import pg from 'pg'
import { decrypt } from '../helpers/encrypt'

const { Sequelize } = pkg

export const { Op } = pkg

export const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USER,
	decrypt(process.env.DB_PASS),
	{
		host: process.env.DB_HOST,
		dialect: 'postgres',
		logging: process.env.DB_LOGGING === 'true',
	}
)

export const pgClient = new pg.Client(
	`postgres://${process.env.DB_USER}:${decrypt(process.env.DB_PASS)}@${
		process.env.DB_HOST
	}:5432/${process.env.DB_DATABASE}`
)

const config = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: decrypt(process.env.DB_PASS),
	port: process.env.DB_PORT,
}

export const updateOrCreate = async ({ model, where, newItem }) => {
	// First try to find the record
	const foundItem = await model.findOne({ where })
	if (!foundItem) {
		// Item not found, create a new one
		const item = await model.create(newItem)
		return { item, created: true }
	}
	// Found an item, update it
	const [, [item]] = await model.update(newItem, { where, returning: true })
	return { item, created: false }
}

export default new pg.Pool(config)
