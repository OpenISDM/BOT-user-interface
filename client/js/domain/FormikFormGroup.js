import React from 'react'
import { Field } from 'formik'
import { FormFieldName } from '../components/StyleComponents'
import PropTypes from 'prop-types'

const FormikFormGroup = ({
	name = 'default',
	label,
	centerLabel = false,
	error,
	touched,
	type = 'text',
	disabled,
	placeholder,
	component,
	display = true,
	className,
	value,
	example = null,
	autoComplete = true,
	additionalComponent = () => null,
	tabIndex = 1,
}) => {
	const style = {
		container: {
			display: display ? null : 'none',
		},
		error: {
			color: '#dc3545',
		},
		example: {
			color: 'grey',
		},
	}

	const labelStyle = centerLabel ? { justifyContent: 'center' } : {}

	return (
		<div className={`form-group ${className}`} style={style.container}>
			<FormFieldName className="d-flex" style={labelStyle}>
				<div style={{ textAlign: 'center' }}>{label}</div>
				<div>{additionalComponent()}</div>
			</FormFieldName>
			{component ? (
				component()
			) : value ? (
				<Field
					name={name}
					type={type}
					value={value}
					className={'form-control' + (error && touched ? ' is-invalid' : '')}
					placeholder={placeholder}
					disabled={disabled}
					style={{
						letterSpacing: 1,
					}}
					autoComplete={autoComplete}
					tabIndex={tabIndex}
				/>
			) : (
				<div>
					<Field
						name={name}
						type={type}
						className={'form-control' + (error && touched ? ' is-invalid' : '')}
						placeholder={placeholder}
						disabled={disabled}
						style={{
							letterSpacing: 1,
						}}
						autoComplete={autoComplete}
						tabIndex={tabIndex}
					/>
				</div>
			)}
			{error && touched && (
				<small className="form-text" style={style.error}>
					{error}
				</small>
			)}
			{example && !error && !touched && (
				<small className="form-text" style={style.example}>
					{example}
				</small>
			)}
		</div>
	)
}

FormikFormGroup.propTypes = {
	name: PropTypes.string,
	label: PropTypes.string,
	centerLabel: PropTypes.bool,
	error: PropTypes.object,
	touched: PropTypes.object,
	type: PropTypes.string,
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	component: PropTypes.node,
	display: PropTypes.bool,
	className: PropTypes.string,
	value: PropTypes.object,
	onChange: PropTypes.func,
	example: null,
	autoComplete: true,
	additionalComponent: PropTypes.func,
	tabIndex: PropTypes.number,
}

export default FormikFormGroup
