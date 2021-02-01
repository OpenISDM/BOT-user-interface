import { file, pdfUrl } from '../dataSrc'
import { post } from '../helper/httpClient'

export default {
	async getPDF({ userInfo, pdfPackage }) {
		return await post(file.export.pdf, {
			userInfo,
			pdfPackage,
		})
	},

	getFile({ path }) {
		// TODO: put it to utils
		window.open(pdfUrl(path))
	},
}
