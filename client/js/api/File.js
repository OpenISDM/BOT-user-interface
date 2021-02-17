import { post } from './utils/request'

const pdf = '/data/file/export/pdf'
export const pdfUrl = '/data/file/'

export default {
	async getPDF({ userInfo, pdfPackage }) {
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
