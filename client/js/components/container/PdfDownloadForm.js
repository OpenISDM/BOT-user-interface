/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PdfDownloadForm.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { Button, Row } from 'react-bootstrap'
import axios from 'axios'
import dataSrc from '../../dataSrc'
import QRCode from 'qrcode.react'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import pdfPackageGenerator from '../../helper/pdfPackageGenerator'
import apiHelper from '../../helper/apiHelper'

class PdfDownloadForm extends React.Component {
	static contextType = AppContext

	state = {
		show: false,
		savePath: '',
		data: null,
		alreadyUpdate: false,
		hasData: false,
		isDone: false,
	}

	sendSearchResultToBackend = (searchResultInfo, callBack) => {
		apiHelper.fileApiAgent
			.getPDF({
				...searchResultInfo,
			})
			.then((res) => {
				callBack(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	componentDidUpdate = (preProps) => {
		if (this.props.show && !this.state.show) {
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
			const [{ areaId }] = stateReducer
			// let pdfPackage = config.getPdfPackage('searchResult', auth.user, data, locale, areaId)

			const pdfPackage = pdfPackageGenerator.getPdfPackage({
				option: 'searchResult',
				user: auth.user,
				data,
				locale,
				// signature: authentication,
				// additional: {
				//     shift: values.shift,
				//     area: locale.texts[config.mapConfig.areaOptions[auth.user.areas_id[0]]],
				//     name: auth.user.name
				// }
			})

			const searResultInfo = {
				userInfo: auth.user,
				pdfPackage,
			}

			this.sendSearchResultToBackend(searResultInfo, (path) => {
				this.setState({
					savePath: path,
					data: this.props.data,
					show: this.props.show,
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
		apiHelper.fileApiAgent.getFile({
			path: this.state.savePath,
		})
	}

	render() {
		const { hasData, savePath } = this.state

		const { locale } = this.context

		return (
			<Modal
				show={this.state.show}
				onHide={this.handleClose}
				className="text-capitalize"
				size="sm"
			>
				<Modal.Header closeButton>
					{locale.texts.PRINT_SEARCH_RESULT}
				</Modal.Header>
				<Modal.Body className="d-flex flex-column">
					<Row className="d-flex justify-content-center mb-2">
						{hasData && <QRCode value={dataSrc.pdfUrl(savePath)} size={128} />}
					</Row>
					<Row className="d-flex justify-content-center mb-2">
						<Button
							onClick={this.PdfDownloader}
							variant="outline-secondary"
							className="text-capitalize"
						>
							{locale.texts.DOWNLOAD}
						</Button>
						<a ref="download" download style={{ display: 'none' }}>
							hi
						</a>
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
}

export default PdfDownloadForm
