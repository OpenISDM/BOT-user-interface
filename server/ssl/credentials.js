/** privatekey name: private.key
 *  certificate name: certificate.cert or certificate.crt
 *  ca_bundle name: ca.bundle.crt
 */

/** Create self-signed certificate
 *  >> openssl req -nodes -new -x509 -keyout private.key -out certificate.cert
 * If it is window os, please refer to https://tecadmin.net/install-openssl-on-windows/ install openssl
 * and set the environment variables*/
import 'dotenv/config'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sslPath = path.join(__dirname)

const privateKey =
	process.env.PRIVATE_KEY &&
	fs.readFileSync(path.join(sslPath, process.env.PRIVATE_KEY))
const certificate =
	process.env.CERTIFICATE &&
	fs.readFileSync(path.join(sslPath, process.env.CERTIFICATE))
const ca_bundle =
	process.env.CA_BUNDLE &&
	fs.readFileSync(path.join(sslPath, process.env.CA_BUNDLE))

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca_bundle,
}

export default credentials
