/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditListForm.js

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
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import FormikFormGroup from '../FormikFormGroup'
import styleConfig from '../../../config/styleConfig'

const EditListForm = ({
	show,
	handleClose,
	handleSubmit,
	title,
	areaOptions,
}) => {
	const { locale } = React.useContext(AppContext)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton className="text-capitalize">
				{title}
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						name: '',
						area: '',
					}}
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
								label={locale.texts.NAME}
								placeholder=""
							/>
							<FormikFormGroup
								type="text"
								name="area"
								label={locale.texts.AUTH_AREA}
								error={errors.area}
								touched={touched.area}
								placeholder=""
								component={() => (
									<Select
										placeholder=""
										name="area"
										value={values.area}
										onChange={(value) => setFieldValue('area', value)}
										options={areaOptions || []}
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

export default EditListForm
