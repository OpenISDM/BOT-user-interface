import nodemailer from 'nodemailer'
import 'dotenv/config'
const hostname = process.env.HOSTNAME
const dataSrcProtocol = process.env.DATASRC_PROTOCOL || 'https'
const domain = `${dataSrcProtocol}://${hostname}`

export const resetPasswordInstruction = {
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

let config = {}
if (process.env.EMAIL_HOST || process.env.EMAIL_PORT) {
	config = {
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	}
} else {
	config = {
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	}
}

const mailer = nodemailer.createTransport(config)

export default mailer
