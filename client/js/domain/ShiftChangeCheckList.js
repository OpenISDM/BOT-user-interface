import React, { Fragment } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { shiftChangeCheckTableColumn } from '../config/tables'
import SelectTable from '../components/SelectTable'
import Map from '../components/Map'
import PropTypes from 'prop-types'

class ShiftChangeCheckList extends React.Component {
	static contextType = AppContext

	state = {
		currentHoveredObject: null,
	}

	handleOnMouseEnterCallback = (currentHoveredObject) => {
		this.setState({
			currentHoveredObject,
		})
	}

	handleOnMouseLeaveCallback = () => {
		this.setState({
			currentHoveredObject: null,
		})
	}

	render() {
		const { locale, stateReducer } = this.context
		const { show, handleClose, handleSubmit } = this.props
		const [{ objectFoundResults }] = stateReducer
		const { totalResults = [] } = objectFoundResults
		const { currentHoveredObject } = this.state
		const objectList = currentHoveredObject ? [currentHoveredObject] : []

		return (
			<>
				<Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
					<Modal.Header className="d-flex flex-column text-capitalize">
						<div>{locale.texts.SHIFT_CHANGE_CHECK_LIST}</div>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col md={5}>
								<Map objectList={objectList} />
							</Col>
							<Col md={7}>
								<SelectTable
									data={totalResults}
									columns={shiftChangeCheckTableColumn}
									onMouseEnterCallback={this.handleOnMouseEnterCallback}
									onMouseLeaveCallback={this.handleOnMouseLeaveCallback}
								/>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="outline-secondary" onClick={handleClose}>
							{locale.texts.CANCEL}
						</Button>
						<Button type="submit" variant="primary" onClick={handleSubmit}>
							{locale.texts.CONFIRM}
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}

ShiftChangeCheckList.propTypes = {
	data: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
}

export default ShiftChangeCheckList
