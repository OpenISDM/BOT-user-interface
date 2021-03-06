import React, { Fragment } from 'react'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import momentLocalizer from 'react-widgets-moment'
import 'react-table/react-table.css'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { Nav, Breadcrumb } from 'react-bootstrap'
import styleConfig from '../../../config/styleConfig'
import moment from 'moment'
import {
	BOTNavLink,
	BOTNav,
	NoDataFoundDiv,
	PrimaryButton,
} from '../../../components/StyleComponents'
import Table from '../../../components/Table'
import Loader from '../../Loader'
import Select from '../../../components/Select'
import IconButton from '../../../components/IconButton'
import styleSheet from '../../../config/styleSheet'
import config from '../../../config'
import { AppContext } from '../../../context/AppContext'
import PropTypes from 'prop-types'

momentLocalizer()

const BrowseTraceContainerView = React.forwardRef(
	(
		{
			getInitialValues,
			breadIndex,
			data,
			histories,
			navList,
			handleClick,
			options,
			columns,
			getLocationHistory,
			onRowClick,
		},
		ref
	) => {
		const { locale } = React.useContext(AppContext)
		const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'
		const initialValues = getInitialValues()

		return (
			<div>
				<div className="d-flex justify-content-between">
					{data.length !== 0 && (
						<div>
							<IconButton
								iconName="fas fa-download"
								name="exportPDF"
								onClick={handleClick}
							>
								{locale.texts.EXPORT_PDF}
							</IconButton>
							<IconButton
								iconName="fas fa-download"
								name="exportCSV"
								onClick={handleClick}
							>
								{locale.texts.EXPORT_CSV}
							</IconButton>
						</div>
					)}
				</div>
				<Formik
					initialValues={initialValues}
					ref={ref}
					initialStatus={config.AJAX_STATUS_MAP.WAIT_FOR_SEARCH}
					validateOnChange={false}
					validateOnBlur={false}
					validationSchema={object().shape({
						key: object().nullable().required(locale.texts.REQUIRED),
						startTime: string()
							.nullable()
							.required(locale.texts.START_TIME_IS_REQUIRED)
							.test(
								'startTime',
								locale.texts.TIME_FORMAT_IS_INCORRECT,
								(value) => {
									const test = moment(value).format(timeValidatedFormat)
									return moment(test, timeValidatedFormat, true).isValid()
								}
							),
						endTime: string()
							.nullable()
							.required(locale.texts.END_TIME_IS_REQUIRED)
							.test(
								'endTime',
								locale.texts.TIME_FORMAT_IS_INCORRECT,
								(value) => {
									const test = moment(value).format(timeValidatedFormat)
									return moment(test, timeValidatedFormat, true).isValid()
								}
							),
					})}
					onSubmit={(values) => {
						getLocationHistory(
							{
								...values,
								description: values.key.description,
							},
							breadIndex + 1
						)
					}}
					render={({ values, errors, status, setFieldValue, submitForm }) => (
						<Fragment>
							<Breadcrumb className="my-2">
								{histories.map((history, index) => {
									return (
										<Breadcrumb.Item key={index}>
											<div
												key={index}
												className="d-inline-block"
												style={{
													color:
														breadIndex === index
															? styleSheet.theme
															: styleSheet.black,
												}}
												name="bread"
												onClick={(e) => {
													const data = JSON.stringify({
														history,
														index,
													})
													handleClick(e, data)
												}}
											>
												{history.description}
											</div>
										</Breadcrumb.Item>
									)
								})}
							</Breadcrumb>
							<BOTNav>
								{navList.map((nav, index) => {
									return (
										<Nav.Item key={index}>
											<BOTNavLink
												eventKey={nav.name}
												active={values.mode === nav.name}
												onClick={handleClick}
												name="nav"
											>
												{
													locale.texts[
														nav.name.toUpperCase().replace(/ /g, '_')
													]
												}
											</BOTNavLink>
										</Nav.Item>
									)
								})}
							</BOTNav>
							<div className="d-flex justify-content-between my-4">
								<div className="d-flex justify-content-start">
									<div
										className="mx-2"
										style={{
											position: 'relative',
										}}
									>
										<Select
											name="key"
											value={values.key}
											className="float-right"
											onChange={(value) => {
												setFieldValue('key', value)
											}}
											isClearable={true}
											isSearchable={true}
											options={options[values.mode] || []}
											styles={styleConfig.reactSelectSearch}
											components={styleConfig.reactSelectSearchComponent}
											placeholder={
												locale.texts[`SEARCH_FOR_${values.mode.toUpperCase()}`]
											}
										/>
										{errors.key && (
											<div
												className="text-left"
												style={{
													fontSize: '0.6rem',
													color: styleSheet.warning,
													position: 'absolute',
													left: 0,
													bottom: -18,
												}}
											>
												{errors.key}
											</div>
										)}
									</div>

									<div
										className="mx-2"
										style={{
											position: 'relative',
										}}
									>
										<DateTimePicker
											name="startTime"
											className="mx-2"
											value={values.startTime}
											onkeydown="return false"
											onChange={(value) => {
												value != null
													? setFieldValue('startTime', moment(value).toDate())
													: setFieldValue('startTime', undefined)
											}}
											defaultCurrentDate={moment().startOf('day').toDate()}
											placeholder={locale.texts.START_TIME}
										/>

										{errors.startTime && (
											<div
												className="text-left"
												style={{
													fontSize: '0.6rem',
													color: styleSheet.warning,
													position: 'absolute',
													left: 10,
													bottom: -18,
												}}
											>
												{errors.startTime}
											</div>
										)}
									</div>
									<div
										className="mx-2"
										style={{
											position: 'relative',
										}}
									>
										<DateTimePicker
											name="endTime"
											className="mx-2"
											value={
												values.endTime != null ? values.endTime : undefined
											}
											onChange={(value) => {
												value != null
													? setFieldValue('endTime', moment(value).toDate())
													: setFieldValue('endTime', undefined)
											}}
											placeholder={locale.texts.END_TIME}
										/>
										{errors.endTime && (
											<div
												className="text-left"
												style={{
													fontSize: '0.6rem',
													color: styleSheet.warning,
													position: 'absolute',
													left: 10,
													bottom: -18,
												}}
											>
												{errors.endTime}
											</div>
										)}
									</div>
								</div>
								<div className="d-flex align-items-center">
									<PrimaryButton type="button" onClick={submitForm}>
										{locale.texts.SEARCH}
									</PrimaryButton>
								</div>
							</div>

							{status === config.AJAX_STATUS_MAP.LOADING && <Loader />}

							<hr />
							{data.length !== 0 ? (
								<Table
									data={data}
									columns={columns}
									style={{ maxHeight: '65vh' }}
									onClickCallback={onRowClick}
								/>
							) : (
								<NoDataFoundDiv>
									{locale.texts[status.toUpperCase().replace(/ /g, '_')]}
								</NoDataFoundDiv>
							)}
						</Fragment>
					)}
				/>
			</div>
		)
	}
)

BrowseTraceContainerView.propTypes = {
	getInitialValues: PropTypes.object,
	breadIndex: PropTypes.number,
	data: PropTypes.array,
	histories: PropTypes.array,
	navList: PropTypes.array,
	handleClick: PropTypes.func,
	options: PropTypes.array,
	columns: PropTypes.array,
	getLocationHistory: PropTypes.array,
	onRowClick: PropTypes.func,
}

export default BrowseTraceContainerView
