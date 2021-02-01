import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import pdf from 'html-pdf'
import pkg from 'json2csv'
const { Parser } = pkg

export default {
	exportCSV: (req, res) => {
		const { fields, data, filePackage } = req.body

		const folderPath = path.join(
			process.env.LOCAL_FILE_PATH,
			filePackage.directory
		)

		if (!fs.existsSync(process.env.LOCAL_FILE_PATH)) {
			fs.mkdirSync(process.env.LOCAL_FILE_PATH)
		}

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath)
		}

		const filePath = path.join(process.env.LOCAL_FILE_PATH, filePackage.path)

		const json2csvParser = new Parser({ fields })
		const csv = json2csvParser.parse(data)
		const options = {
			encoding: 'utf8',
		}

		fs.promises.writeFile(filePath, '\ufeff' + csv, options, function (err) {
			if (err) {
				console.log(err)
			} else {
				res.status(200).json(data)
				console.log('the csv file was written successfully')
			}
		})
	},

	getFile: (req, res) => {
		res.sendFile(
			path.join(
				`${process.env.LOCAL_FILE_PATH}`,
				`${req.params.folder}`,
				req.params.file
			)
		)
	},

	exportPDF: (request, response) => {
		const { pdfPackage } = request.body
		pdf
			.create(pdfPackage.pdf, pdfPackage.options)
			.toFile(
				path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path),
				function (err) {
					if (err) {
						console.log(`generate pdf failed ${err}`)
						response.status(500).send('Something broke!')
					}

					console.log('pdf create succeed')
					response.status(200).json(pdfPackage.path)
				}
			)
	},
}
