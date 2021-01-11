/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        template.js

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
const hostname = process.env.HOSTNAME
const dataSrcProtocol = process.env.DATASRC_PROTOCOL || 'https'
const domain = `${dataSrcProtocol}://${hostname}`

const resetPasswordInstruction = {
	subject: 'BiDaE Object Tracker Password Assistance',

	content: (token, accountNameList) => {
		const hasMultipleAccount = accountNameList && accountNameList.length > 1
		const botAccountText = hasMultipleAccount ? 'BOT accounts' : 'BOT account'

		return `
        Dear User,

        Greetings from BiDaE Object Tracker Service.
        We received a request to reset the password for the ${botAccountText} associated with this e-mail address.

        Your ${botAccountText}: [${accountNameList.join(', ')}]

        Click the link below to reset your password using our secure server:
		${domain}/resetpassword/new/${token}

        Sincerely,
        The BiDaE Service Team
        `
	},
}

export default resetPasswordInstruction
