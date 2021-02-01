import 'dotenv/config'
import session from 'express-session'
import ConnectPgSimple from 'connect-pg-simple'
import pool from '../db/connection'

const pgSession = ConnectPgSimple(session)

const sessionOptions = {
	store: new pgSession({
		pool,
		tableName: process.env.SESSION_TABLE_NAME,
	}),
	secret: process.env.KEY,
	resave: true,
	saveUninitialized: true,
	cookie: {
		// maxAge: 1000
	},
}

export default sessionOptions
