/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditTransferLocationForm.js

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
import { object, string } from 'yup'
import FormikFormGroup from '../FormikFormGroup'
import Creatable from 'react-select/creatable'
import styleConfig from '../../../config/styleConfig'
import { AppContext } from '../../../context/AppContext'
import PropTypes from 'prop-types'

const validationSchema = object().shape({
	name: string()
		.min(1, 'Must be at least 1 characters')
		.required('Field is required'),
	department: string()
		.min(1, 'Must be at least 1 characters')
		.required('Field is required'),
})

const EditTransferLocationForm = ({
	show,
	actionName,
	handleClose,
	handleSubmit,
	title,
	locationOptions,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header className="text-capitalize">{title}</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						department: '',
					}}
					validationSchema={validationSchema}
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
								name="name"
								label={locale.texts.TRANSFERRED_LOCATION}
								error={errors.name}
								touched={touched.name}
								placeholder=""
								component={() => (
									<Creatable
										placeholder=""
										name="name"
										value={values.area}
										onChange={(value) => setFieldValue('name', value)}
										options={locationOptions}
										styles={styleConfig.reactSelect}
										components={{
											IndicatorSeparator: () => null,
										}}
									/>
								)}
							/>
							<FormikFormGroup
								type="text"
								name="department"
								label={locale.texts.DEPARTMENT}
								placeholder=""
								error={errors.department}
								touched={touched.department}
							/>
							<Modal.Footer>
								<Button
									variant="outline-secondary"
									name={actionName}
									onClick={handleClose}
								>
									{locale.texts.CANCEL}
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{locale.texts.SAVE}
								</Button>
							</Modal.Footer>
						</Form>
					)}
				/>
			</Modal.Body>
		</Modal>
	)
}

EditTransferLocationForm.propTypes = {
	show: PropTypes.bool,
	actionName: PropTypes.string,
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	title: PropTypes.string,
	locationOptions: PropTypes.object,
}

export default EditTransferLocationForm
