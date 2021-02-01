import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { Button, Row } from 'react-bootstrap'
import axios from 'axios'
import dataSrc from '../../dataSrc'
import QRCode from 'qrcode.react'
import moment from 'moment'
import config from '../../config'
import { AppContext } from '../../context/AppContext'

// need Inputs : search Result
// this component will send json to back end, backend will return a url, and the component generate a qrcode
class QRCodeContainer extends React.Component {
	static contextType = AppContext

	state = {
		show: false,
		savePath: '',
		data: null,
		alreadyUpdate: false,
		hasData: false,
		isDone: false,
		searchKey: '',
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		if (nextProps.show || nextState.show) {
			return true
		}
		return true
	}

	sendSearchResultToBackend = (searchResultInfo, callBack) => {
		// axios
		// 	.post(dataSrc.generatePDF, searchResultInfo)
		// 	.then((res) => {
		// 		callBack(res.data)
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 	})
	}

	componentWillUpdate = (preProps) => {
		if (this.props.isSearched) {
			const data = {
				foundResult: [],
				notFoundResult: [],
			}

			for (const item of this.props.data) {
				item.found
					? data.foundResult.push(item)
					: data.notFoundResult.push(item)
			}

			const { locale, auth, stateReducer } = this.context
			const [{ area }] = stateReducer
			const pdfPackage = config.getPdfPackage(
				'searchResult',
				auth.user,
				data,
				locale,
				area.id
			)
			//console.log(foundResult)
			const searResultInfo = {
				userInfo: auth.user,
				pdfPackage,
			}
			this.sendSearchResultToBackend(searResultInfo, (path) => {
				this.setState({
					savePath: path,
					data: this.props.data,
					searchKey: this.props.searchKey,
					alreadyUpdate: true,
					isDone: true,
					hasData: true,
				})
			})
		}
	}
	handleClose = () => {
		this.props.handleClose()
		this.setState({
			show: false,
			alreadyUpdate: false,
			isDone: false,
		})
	}
	PdfDownloader = () => {
		window.open(this.state.savePath)
	}

	render() {
		const { hasData, show, savePath, isDone } = this.state

		const { locale } = this.context

		return (
			<div id="qrcode" style={style.QRcodeDiv}>
				<QRCode value={dataSrc.pdfUrl(savePath)} style={style.QRcodeSize} />
			</div>
		)
	}
}

const style = {
	QRcodeDiv: {
		margin: 'auto',
	},
	QRcodeSize: {
		marginTop: '5%',
		width: '70%',
		height: '70%',
	},
}

export default QRCodeContainer
