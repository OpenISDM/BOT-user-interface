import crypto from 'crypto'

const algorithm = 'aes-192-cbc'

const password = process.argv[3] || ''

const toEncrypt = process.argv[2]

const key = crypto.scryptSync(password, 'salt', 24)

const iv = Buffer.alloc(16, 0)

const cipher = crypto.createCipheriv(algorithm, key, iv)

let encrypted = cipher.update(toEncrypt, 'utf8', 'hex')

encrypted += cipher.final('hex')

console.log(encrypted)
