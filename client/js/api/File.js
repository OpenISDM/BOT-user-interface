import { post } from './utils/request'

const pdf = '/data/file/export/pdf'
const csv = '/data/file/export/csv'
export const pdfUrl = '/data/file/'

export default {
	async postCSV({data, fields, filePackage}){
		return await post(csv,{
			data, fields, filePackage
		})
	},
	async getPDF({ userInfo, pdfPackage }) {
		console.log(userInfo)
		console.log(pdfPackage)
		return await post(pdf, {
			userInfo,
			pdfPackage,
		})
	},

	getFile({ path }) {
		// TODO: put it to utils
		window.open(`${pdfUrl}${path}`)
	},
}
