import compression from 'compression'
import external from './external'
export const authChecker = (req, res, next) => {
	if (req.session.user) {
		next()
	} else {
		res.redirect('/login')
	}
}

export const pageChecker = (req, res, next) => {
	if (req.session.user) next()
	else {
		res.clearCookie('authenticated')
		res.clearCookie('user')
		res.redirect('/login')
	}
}

export const shouldCompress = (req, res) => {
	if (req.headers['x-no-compression']) {
		return false
	}

	return compression.filter(req, res)
}

export { external }
