import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { FormFieldName } from '../BOTComponent/styleComponent'

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
	onChange,
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

export default FormikFormGroup
