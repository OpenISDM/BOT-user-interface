import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { pdfUrl } from '../../../api/File'
import { AppContext } from '../../../context/AppContext'
import PropTypes from 'prop-types'

const style = {
	modal: {
		top: '10%',
		zIndex: 6000,
		padding: 0,
	},
	deviceList: {
		maxHeight: '20rem',
		overflow: 'hidden scroll',
	},
}

const DownloadPdfRequestForm = ({ handleClose, pdfPath, show }) => {
	const { locale } = React.useContext(AppContext)

	const handleClickButton = (e) => {
		const { name } = e.target
		const link = document.createElement('a')
		switch (name) {
			case 'view':
				window.open(`${pdfUrl}${pdfPath}`)
				break
			case 'download':
				link.href = `${pdfUrl}${pdfPath}`
				link.download = ''
				link.click()
				break
			case 'close':
				handleClose()
				break
		}
	}

	return (
		<Modal
			centered={true}
			show={show}
			onHide={handleClose}
			size="md"
			style={style.modal}
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{locale.texts.PROCESS_IS_COMPLETED}
			</Modal.Header>
			<Modal.Body className="py-2">
				<Formik
					render={() => (
						<Form>
							<div className="mb-5">
								{locale.texts.NOW_YOU_CAN_DO_THE_FOllOWING_ACTION}
							</div>
							<Modal.Footer>
								<Button
									variant="outline-secondary"
									className="text-capitalize"
									onClick={handleClickButton}
									name="close"
								>
									{locale.texts.CLOSE}
								</Button>
								<Button
									variant="primary"
									className="text-capitalize mx-3"
									onClick={handleClickButton}
									name="view"
								>
									{locale.texts.VIEW}
								</Button>
								<Button
									variant="primary"
									className="text-capitalize"
									onClick={handleClickButton}
									name="download"
								>
									{locale.texts.DOWNLOAD}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

DownloadPdfRequestForm.propTypes = {
	handleClose: PropTypes.func,
	pdfPath: PropTypes.string,
	show: PropTypes.bool,
}

export default DownloadPdfRequestForm
