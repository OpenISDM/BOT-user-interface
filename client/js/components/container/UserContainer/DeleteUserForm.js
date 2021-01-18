/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        DeleteUserForm.js

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
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import Select from 'react-select'
import { object, string } from 'yup'
import FormikFormGroup from '../../presentational/FormikFormGroup'
import styleConfig from '../../../config/styleConfig'
import { AppContext } from '../../../context/AppContext'
import PropTypes from 'prop-types'

const DeleteUserForm = ({ show, title, data, handleClose, handleSubmit }) => {
	const { locale } = React.useContext(AppContext)

	const userOptions = data.map((item) => {
		return {
			value: item.id,
			label: item.name,
		}
	})

	return (
		<Modal show={show} size="sm" onHide={handleClose}>
			<Modal.Header closeButton>{title}</Modal.Header>

			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
					}}
					validationSchema={object().shape({
						name: string().required(locale.texts.NAME_IS_REQUIRED),
					})}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					render={({
						values,
						errors,
						touched,
						isSubmitting,
						setFieldValue,
					}) => (
						<Form>
							<FormikFormGroup
								type="text"
								name="nameName"
								label={locale.texts.DELETE}
								error={errors.nameName}
								touched={touched.nameName}
								placeholder={locale.texts.USERNAME}
								component={() => (
									<Select
										placeholder={locale.texts.SELECT_USER}
										name="name"
										value={values.name}
										onChange={(value) => setFieldValue('name', value)}
										options={userOptions || []}
										styles={styleConfig.reactSelect}
										components={{
											IndicatorSeparator: () => null,
										}}
									/>
								)}
							/>

							<Modal.Footer>
								<Button variant="outline-secondary" onClick={handleClose}>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.DELETE}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

DeleteUserForm.propTypes = {
	show: PropTypes.bool,
	title: PropTypes.string,
	data: PropTypes.array,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
}

export default DeleteUserForm
