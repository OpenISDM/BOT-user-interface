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
import { pdfUrl } from '../../dataSrc'
import QRCode from 'qrcode.react'
import { AppContext } from '../../context/AppContext'
import apiHelper from '../../helper/apiHelper'
import PropTypes from 'prop-types'

class PdfDownloadForm extends React.Component {
	static contextType = AppContext

	state = {
		show: false,
		savePath: '',
	}

	handleClose = () => {
		this.props.handleClose()
		this.setState({
			show: false,
		})
	}

	PdfDownloader = async () => {
		await apiHelper.fileApiAgent.getFile({
			path: this.props.savePath,
		})
	}

	render() {
		const { savePath, show } = this.props
		const { locale } = this.context

		return (
			<Modal
				show={show}
				onHide={this.handleClose}
				className="text-capitalize"
				size="sm"
			>
				<Modal.Header closeButton>
					{locale.texts.PRINT_SEARCH_RESULT}
				</Modal.Header>
				<Modal.Body className="d-flex flex-column">
					<Row className="d-flex justify-content-center mb-2">
						<QRCode value={pdfUrl(savePath)} size={128} />
					</Row>
					<Row className="d-flex justify-content-center mb-2">
						<Button
							onClick={this.PdfDownloader}
							variant="outline-secondary"
							className="text-capitalize"
						>
							{locale.texts.DOWNLOAD}
						</Button>
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
}

PdfDownloadForm.propTypes = {
	handleClose: PropTypes.func,
	show: PropTypes.bool,
	savePath: PropTypes.string,
}

export default PdfDownloadForm
