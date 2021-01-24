/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        encrypt.js

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

import crypto from 'crypto'

import 'dotenv/config'

const secret = process.env.KEY

const createHash = (password) => {
	const algorithm = 'sha256'

	return crypto.createHash(algorithm, secret).update(password).digest('hex')
}

export const decrypt = (encrypted) => {
	const algorithm = 'aes-192-cbc'

	const password = process.env.KEY

	const key = crypto.scryptSync(password, 'salt', 24)

	const iv = Buffer.alloc(16, 0) // Initialization vector.

	const decipher = crypto.createDecipheriv(algorithm, key, iv)

	let decrypted = decipher.update(encrypted, 'hex', 'utf8')

	decrypted += decipher.final('utf8')

	return decrypted
}

export default {
	createHash,
	decrypt,
	secret,
}
