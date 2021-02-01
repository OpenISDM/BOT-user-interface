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
