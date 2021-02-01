import { verifyResetPwdToken } from '../controllers/internal/auth'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { pageChecker } from '../middlewares'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default (app) => {
	app.get('/login', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'public', 'dist', 'index.html'))
	})

	app.get(/^\/page\/(.*)/, pageChecker, (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'public', 'dist', 'index.html'))
	})

	app.get('/resetpassword/new/:token', verifyResetPwdToken)

	/** Replace with br file if the browser support br encoding */
	app.get(/\.(js)$/, (req, res, next) => {
		if (req.header('Accept-Encoding').includes('br')) {
			req.url += '.br'
			res.set('Content-Encoding', 'br')
		}
		next()
	})
}
