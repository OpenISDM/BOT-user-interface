/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChangeCheckList.js

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

import React, { Fragment } from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import { shiftChangeCheckTableColumn } from '../../config/tables'
import BOTSelectTable from '../BOTComponent/BOTSelectTable'
import BOTMap from '../BOTComponent/BOTMap'
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
								<BOTMap objectList={objectList} />
							</Col>
							<Col md={7}>
								<BOTSelectTable
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
