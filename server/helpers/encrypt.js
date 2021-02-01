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
