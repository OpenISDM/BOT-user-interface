import React from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

class BOTInput extends React.Component {
	state = {
		value: '',
	}

	componentDidUpdate = (prepProps) => {
		if (
			prepProps.clearSearchResult !== this.props.clearSearchResult &&
			!prepProps.clearSearchResult
		) {
			this.setState({
				value: '',
			})
		}
	}

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		})
		this.props.getSearchKey(e.target.value)
	}

	handleKeyPress = (e) => {
		/* Disable key press 'Enter' event */
		if (parseInt(e.which) === 13) {
			e.preventDefault()
		}
	}

	render() {
		const { value } = this.state
		const { placeholder, error, example, name } = this.props

		return (
			<Form>
				<div className="d-flex">
					<Form.Group
						className="d-flex align-items-center bg-white border-grey height-regular min-height-regular"
						style={{
							padding: '.275rem .75rem',
						}}
					>
						<i className="fas fa-search color-black" />
						<Form.Control
							type="text color-grey bg-unset letter-spacing-1"
							name={name}
							value={value}
							onChange={this.handleChange}
							placeholder={placeholder}
							onKeyPress={this.handleKeyPress}
							style={{
								border: 'none',
								// letterSpacing: '1.5px',
							}}
						/>
					</Form.Group>
				</div>
				{example && <small className="form-text color-grey">{example}</small>}
				{error && (
					<small className="form-text text-capitalize color-red">{error}</small>
				)}
			</Form>
		)
	}
}

BOTInput.propTypes = {
	clearSearchResult: PropTypes.object,
	placeholder: PropTypes.string,
	error: PropTypes.object,
	example: PropTypes.string,
	name: PropTypes.string,
	getSearchKey: PropTypes.func,
}

export default BOTInput
