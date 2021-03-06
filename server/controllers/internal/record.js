import 'dotenv/config'
import dbQueries from '../../db/recordQueries'
import pool from '../../db/connection'
import pdf from 'html-pdf'
import path from 'path'
import fs from 'fs'

export default {
	getEditObjectRecord: (request, response) => {
		pool
			.query(dbQueries.getEditObjectRecord())
			.then((res) => {
				console.log('get object edited record succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`get object edited record failed ${err}`)
			})
	},

	getShiftChangeRecord: async (request, response) => {
		try {
			const res = await pool.query(dbQueries.getShiftChangeRecord())
			response.status(200).json(res)
		} catch (e) {
			console.log(`get shift change record failed ${e}`)
		}
	},

	addShiftChangeRecord: (request, response) => {
		const { userInfo, pdfPackage, shift, list_id } = request.body
		/** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
		pool
			.query(
				dbQueries.addShiftChangeRecord(
					userInfo,
					pdfPackage.path,
					shift,
					list_id
				)
			)
			.then(() => {
				/** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
				pdf
					.create(pdfPackage.pdf, pdfPackage.options)
					.toFile(
						path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path),
						function (err) {
							if (err) {
								console.log(`add shift change record failed ${err}`)
								response.status(500).send('Something broke!')
							}

							console.log('pdf create succeed')
							response.status(200).json(pdfPackage.path)
						}
					)
			})
			.catch((err) => {
				console.log(`pdf create failed: ${err}`)
			})
	},

	addPatientRecord: (request, response) => {
		const { objectPackage } = request.body

		pool
			.query(dbQueries.addPatientRecord(objectPackage))
			.then((res) => {
				console.log('add patient record succeed')
				response.status(200).json(res)
			})
			.catch((err) => {
				console.log(`add patient record failed ${err}`)
			})
	},

	deleteShiftChangeRecord: async (request, response) => {
		const { idPackage } = request.body
		try {
			const res = await pool.query(dbQueries.deleteShiftChangeRecord(idPackage))
			console.log('delete shift change record success')

			if (res.rows.length > 0 && res.rows[0].path) {
				const { file_path: filePath } = res.rows[0]
				fs.promises.unlink(
					path.join(process.env.LOCAL_FILE_PATH, filePath),
					(err) => {
						if (err) {
							console.log('err when deleting files', err)
						}
						response.status(200).json(res)
					}
				)
			} else {
				response.status(200).json(res)
			}
		} catch (e) {
			console.log('deleteShiftChangeRecord error: ', e)
		}
	},

	deleteEditObjectRecord: async (request, response) => {
		const { idPackage } = request.body
		try {
			const res = await pool.query(dbQueries.deleteEditObjectRecord(idPackage))
			console.log('delete shift change record success')

			if (res.rows.length > 0 && res.rows[0].path) {
				fs.promises.unlink(
					path.join(process.env.LOCAL_FILE_PATH, res.rows[0].path),
					(err) => {
						if (err) {
							console.log('err when deleting files', err)
						}
						response.status(200).json(res)
					}
				)
			}
			response.status(200).json(res)
		} catch (e) {
			console.log('deleteEditObjectRecord error: ', e)
		}
	},
}
