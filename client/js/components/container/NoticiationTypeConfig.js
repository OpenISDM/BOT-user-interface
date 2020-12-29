/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        NoticiationTypeConfig.js

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

import React, { useContext, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Select from 'react-select'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { AppContext } from '../../context/AppContext'
import FormikFormGroup from '../presentational/FormikFormGroup'
import BOTTimePicker from '../BOTComponent/BOTTimePicker'
import styleConfig from '../../config/styleConfig'
import PropTypes from 'prop-types'

const NoticiationTypeConfig = ({ name = '' }) => {
	const { locale } = useContext(AppContext)

	return (
		<Formik
			initialValues={{
				aaaa: 'aaaa',
			}}
			validationSchema={object().shape({
				aaaa: string().required(locale.texts.REQUIRED),
			})}
			onChange={(e) => {
				cosnole.log('notify', e)
			}}
			onSubmit={(e) => {
				debugger
			}}
			render={({ errors, touched, isSubmitting, setFieldValue }) => (
				<Col>
					<div className="font-size-80-percent color-black d-flex justify-content-center">
						{name}
					</div>
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
								value={'values.area'}
								onChange={(value) => setFieldValue('area', value)}
								options={['aaa']}
								styles={styleConfig.reactSelect}
								components={{
									IndicatorSeparator: () => null,
								}}
							/>
						)}
					/>
					<FormikFormGroup
						type="text"
						name="aaaa"
						className="my-4"
						label={locale.texts.EMAIL}
					/>
					<Row noGutters className="mb-3">
						<Col>
							<small className="form-text text-muted">
								{locale.texts.ENABLE_START_TIME}
							</small>
							<BOTTimePicker
								name="start_time"
								style={{ width: '100%' }}
								value={'values.start_time'}
								onChange={(value) => {
									setFieldValue('start_time', value)
								}}
							/>
						</Col>
						<Col>
							<small className="form-text text-muted">
								{locale.texts.ENABLE_END_TIME}
							</small>
							<BOTTimePicker
								name="end_time"
								style={{ width: '100%' }}
								value={'values.end_time'}
								onChange={(value) => {
									setFieldValue('end_time', value)
								}}
							/>
						</Col>
					</Row>
					<Form.Group controlId="exampleForm.ControlSelect2">
						<Form.Label>Reset</Form.Label>
						<Form.Control as="select">
							<option>Manually</option>
						</Form.Control>
					</Form.Group>
					<Form.Check
						custom
						type={'switch'}
						id={'night-shift-1'}
						label={'Message on GUI'}
					/>
					<Form.Check
						custom
						type={'switch'}
						id={'night-shift-2'}
						label={'Flashing Lights'}
					/>
					<Form.Check
						custom
						type={'switch'}
						id={'night-shift-3'}
						label={'Alert bells'}
					/>
					<Form.Check
						custom
						type={'switch'}
						id={'night-shift-4'}
						label={'Others'}
					/>
				</Col>
			)}
		/>
	)
}

NoticiationTypeConfig.propTypes = {
	name: PropTypes.string,
}

export default NoticiationTypeConfig
