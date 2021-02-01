import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import PropTypes from 'prop-types'

const DeleteAlertModal = ({
	show,
	handleClose,
	handleSubmit,
	title,
	actionName = 'DELETE',
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header>{title}</Modal.Header>
			<Modal.Footer>
				<Button variant="primary" name={actionName} onClick={handleClose}>
					{locale.texts.CANCEL}
				</Button>
				<Button variant="secondary" onClick={handleSubmit}>
					{locale.texts.DELETE}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

DeleteAlertModal.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	title: PropTypes.string,
	actionName: PropTypes.string,
}

export default DeleteAlertModal
