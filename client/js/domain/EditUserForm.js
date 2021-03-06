import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import { object, string } from 'yup'
import CheckboxGroup from './CheckboxGroup'
import Checkbox from './Checkbox'
import FormikFormGroup from './FormikFormGroup'
import { AppContext } from '../context/AppContext'
import { emailValidation } from '../helper/validation'
import PropTypes from 'prop-types'

const EditUserForm = ({
	show,
	title,
	selectedUser,
	handleSubmit,
	handleClose,
	filteredRoleList,
	data,
	areaTable,
}) => {
	const { locale } = React.useContext(AppContext)
	const areaOptions = areaTable.map((area) => {
		return {
			name: area.readable_name,
			id: `${area.id}`,
		}
	})

	return (
		<Modal show={show} size="sm" onHide={handleClose}>
			<Modal.Header closeButton className="text-capitalize">
				{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
			</Modal.Header>

			<Modal.Body>
				<Formik
					initialValues={{
						name: selectedUser ? selectedUser.name : '',
						password: '',
						email: selectedUser ? selectedUser.email : '',
						roleIds: selectedUser ? selectedUser.role_ids : '',
						areaIds: selectedUser ? selectedUser.areaIds : '',
					}}
					validationSchema={object().shape({
						name: string()
							.required(locale.texts.REQUIRED)
							.test({
								name: 'name',
								message: locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
								test: (value) => {
									let reapeatFlag = true
									if (value) {
										data.forEach((item) => {
											if (item.name.toUpperCase() === value.toUpperCase()) {
												reapeatFlag = false
											}
										})
										if (
											title === 'edit user' &&
											selectedUser.name.toUpperCase() === value.toUpperCase()
										) {
											reapeatFlag = true
										}
									}
									return reapeatFlag
								},
							})
							.test('name', locale.texts.NOT_ALLOW_PUNCTUATION, (value) => {
								if (
									value &&
									// eslint-disable-next-line quotes
									(value.indexOf("'") !== -1 || value.indexOf('"') !== -1)
								) {
									return false
								}
								return true
							})
							.max(20, locale.texts.LIMIT_IN_TWENTY_CHARACTER),
						password: selectedUser
							? ''
							: string()
									.required(locale.texts.REQUIRED)
									.test(
										'password',
										locale.texts.NOT_ALLOW_PUNCTUATION,
										(value) => {
											if (
												value &&
												// eslint-disable-next-line quotes
												(value.indexOf("'") !== -1 || value.indexOf('"') !== -1)
											) {
												return false
											}
											return true
										}
									)
									.max(20, locale.texts.LIMIT_IN_TWENTY_CHARACTER),
						email: string()
							.required(locale.texts.REQUIRED)
							.test(
								'email',
								locale.texts.EMAIL_ADDRESS_FORMAT_IS_INCORRECT,
								emailValidation
							),
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
								name="name"
								label={locale.texts.NAME}
								error={errors.name}
								touched={touched.name}
								autoComplete="off"
							/>
							<FormikFormGroup
								type="text"
								name="email"
								label={locale.texts.EMAIL}
								error={errors.email}
								touched={touched.email}
								autoComplete="off"
							/>
							<FormikFormGroup
								type="password"
								name="password"
								label={locale.texts.PASSWORD}
								error={errors.password}
								touched={touched.password}
								display={!selectedUser}
								autoComplete="off"
							/>
							<hr />
							<FormikFormGroup
								name="roleIds"
								className="text-capitalize"
								label={locale.texts.ROLES}
								error={errors.roleIds}
								touched={touched.roleIds}
								component={() => (
									<CheckboxGroup
										id="roleIds"
										value={values.roleIds}
										error={errors.roleIds}
										touched={touched.roleIds}
										onChange={setFieldValue}
									>
										{filteredRoleList.map((filteredRoleList, index) => {
											return (
												<Field
													component={Checkbox}
													key={index}
													name="roleIds"
													id={filteredRoleList.id}
													label={
														locale.texts[filteredRoleList.name.toUpperCase()]
													}
												/>
											)
										})}
									</CheckboxGroup>
								)}
							/>
							<hr />
							<FormikFormGroup
								name="areaName"
								className="text-capitalize"
								label={locale.texts.SERVICE_AREAS}
								error={errors.areaIds}
								touched={touched.areaIds}
								component={() => (
									<CheckboxGroup
										id="areaIds"
										value={values.areaIds}
										error={errors.areaIds}
										touched={touched.areaIds}
										onChange={setFieldValue}
									>
										{areaOptions.map((area, index) => {
											return (
												<Field
													component={Checkbox}
													key={index}
													name="areaIds"
													id={area.id}
													label={area.name}
												/>
											)
										})}
									</CheckboxGroup>
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

EditUserForm.propTypes = {
	show: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	selectedUser: PropTypes.object.isRequired,
	areaTable: PropTypes.array.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	filteredRoleList: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired,
}

export default EditUserForm
