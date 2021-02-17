import React from 'react'
import { Form, Button } from 'react-bootstrap'
import Autosuggest from 'react-autosuggest'
import config from '../config'
import { SEARCH_BAR, SEARCH_HISTORY } from '../config/wordMap'
import API from '../api'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

const { AUTOSUGGEST_NUMBER_LIMIT } = config
let load_suggest = false

const getSuggestionValue = (suggestion) => suggestion

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion || null}</div>

const suggestionFilter = {
	autoComplete: (suggestData, inputValue, inputLength) => {
		return suggestData.filter((term) => {
			return `${term.toLowerCase().slice(0, inputLength)}` === `${inputValue}`
		})
	},

	partialMatch: (suggestData, inputValue) => {
		return suggestData.filter((term) => {
			return term.toLowerCase().indexOf(inputValue) > -1
		})
	},
}

class BOTSearchbar extends React.Component {
	static contextType = AppContext

	state = {
		value: '',
		suggestions: [],
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
		if (!load_suggest) {
			load_suggest = true
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()

		let type
		let searchKey = {}
		const { value, suggestions } = this.state

		if (this.props.suggestData.includes(value)) {
			type = SEARCH_HISTORY
			searchKey = {
				type,
				value,
			}
			this.addSearchHistory(searchKey)
		} else {
			type = SEARCH_BAR
			searchKey = {
				type,
				value: suggestions,
			}
		}

		this.props.getSearchKey(searchKey)
		this.checkInSearchHistory(value)
	}

	/** Set search history to auth */
	addSearchHistory = (searchKey) => {
		const { auth } = this.context

		if (!auth.authenticated) {
			return
		}

		if (!this.props.suggestData.includes(searchKey.value)) {
			return
		}

		let searchHistory = [...auth.user.searchHistory] || []

		const itemIndex = searchHistory.indexOf(searchKey.value)

		if (itemIndex > -1) {
			searchHistory = [
				...searchHistory.slice(0, itemIndex),
				...searchHistory.slice(itemIndex + 1),
			]
		}

		searchHistory.unshift(searchKey.value)
		auth.setSearchHistory(searchHistory)
		this.checkInSearchHistory(searchKey.value)
	}

	/** Insert search history to database */
	checkInSearchHistory = async (itemName) => {
		const { auth } = this.context
		try {
			await API.User.addSearchHistory({
				username: auth.user.name,
				keyType: 'object type search',
				keyWord: itemName,
			})
			this.setState({
				searchKey: itemName,
			})
		} catch (e) {
			console.log(`check in search history failed ${e}`)
		}
	}

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		})
	}

	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue,
		})
	}

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: this.getSuggestions(value),
		})
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		})
	}

	// Teach Autosuggest how to calculate suggestions for any given input value.
	getSuggestions = (value) => {
		const inputValue = value.trim().toLowerCase()
		const inputLength = inputValue.length

		/** limit count by specific number */
		let suggestTemp = []
		if (inputLength === 0) {
			return suggestTemp
		}

		suggestTemp = suggestionFilter.partialMatch(
			this.props.suggestData,
			inputValue,
			inputLength
		)

		return suggestTemp.length <= AUTOSUGGEST_NUMBER_LIMIT
			? suggestTemp
			: suggestTemp.slice(0, AUTOSUGGEST_NUMBER_LIMIT + 1)
	}

	render() {
		const { value, suggestions } = this.state

		const inputProps = {
			placeholder: '',
			value,
			onChange: this.onChange,
		}

		return (
			<Form className="d-flex justify-content-around">
				<Form.Group className="d-flex justify-content-center mb-0 mx-1">
					<Autosuggest
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
						renderInputComponent={(inputProps) => (
							<div className="inputContainer">
								<i
									className="fas fa-search icon font-size-120-percent cursor-pointer"
									onClick={this.handleSubmit}
								/>
								<input {...inputProps} />
							</div>
						)}
					/>
				</Form.Group>
				<Button
					type="submit"
					variant="link"
					className="btn btn-link btn-sm bd-highlight width-0"
					onClick={this.handleSubmit}
				/>
			</Form>
		)
	}
}

BOTSearchbar.propTypes = {
	suggestData: PropTypes.array.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	getSearchKey: PropTypes.func.isRequired,
}

export default BOTSearchbar
