/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditAreasForm.js

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
import { Modal, Button, ListGroup } from 'react-bootstrap'
import { Formik, Form } from 'formik'

import { AppContext } from '../../../context/AppContext'
import { Title } from '../../BOTComponent/styleComponent'

const EditAreasForm = ({ show, handleClose, handleSubmit, areaTable }) => {
	const { auth, locale } = React.useContext(AppContext)

	return (
		<Modal
			show={show}
			size="md"
			onHide={handleClose}
			className="text-capitalize"
		>
			<Modal.Header closeButton>
				{locale.texts.EDIT_SECONDARY_AREAS}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						areas_id: Array.from(auth.user.areas_id),
					}}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					render={({ values, isSubmitting, setFieldValue }) => (
						<Form>
							<Title sub>{locale.texts.SELECTED_AREAS}</Title>
							<ListGroup>
								{Object.values(areaTable)
									.filter((area) => {
										return (
											auth.user.main_area != area.id &&
											values.areas_id.includes(area.id)
										)
									})
									.map((area, index) => {
										const element = (
											<ListGroup.Item
												as="a"
												key={index}
												action
												name={area.id}
												onClick={(e) => {
													const name = e.target.getAttribute('name')
													const areasId = values.areas_id.filter((area) => {
														return area != name
													})
													setFieldValue('areas_id', areasId)
												}}
											>
												{area.readable_name}
											</ListGroup.Item>
										)
										return element
									})}
							</ListGroup>
							<Title sub>{locale.texts.NOT_SELECTED_AREAS}</Title>
							<ListGroup>
								{Object.values(areaTable)
									.filter((area) => {
										return (
											auth.user.main_area !== area.id &&
											!values.areas_id.includes(area.id)
										)
									})
									.map((area, index) => {
										const element = (
											<ListGroup.Item
												as="a"
												key={index}
												action
												name={area.id}
												onClick={(e) => {
													const name = e.target.getAttribute('name')
													const areasId = values.areas_id
													areasId.push(parseInt(name))
													setFieldValue('areas_id', areasId)
												}}
											>
												{area.readable_name}
											</ListGroup.Item>
										)
										return element
									})}
							</ListGroup>

							<Modal.Footer>
								<Button
									type="button"
									variant="outline-secondary"
									onClick={handleClose}
								>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.CONFIRM}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

export default EditAreasForm
