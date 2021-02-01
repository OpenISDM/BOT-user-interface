/** Email format validation */
export const emailValidation = (email) => {
	const req = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
	return req.test(email)
}

/** Mac address format validation */
export const macaddrValidation = ({ macaddr = '' }) => {
	const req = new RegExp('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
	return req.test(macaddr.trim())
}

/** String is empty test */
export const isEmpty = (str) => {
	const req = /^\s*$/
	return req.test(str)
}
