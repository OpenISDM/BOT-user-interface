/* eslint-disable import/no-commonjs */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
const url = require('url')
const path = require('path')

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const imagePath = path
	.join(__dirname, '..', 'server', 'public', 'map')
	.replace(/\\/g, '/')

;(async () => {
	const files = [`${imagePath}/*.{jpg,png,JPG,PNG}`]
	const config = {
		destination: imagePath,
		plugins: [imageminWebp({ quality: 1, alphaQuality: 1, method: 6 })],
	}

	console.log('coverting image to webp...')
	const output = await imagemin(files, config)
	console.log('output', output)
	console.log('webp coverting complete!')
})()
