import React from 'react'
import { Button } from 'react-bootstrap'
import AccessControl from '../authentication/AccessControl'
import { AppContext } from '../../context/AppContext'
import {
	SEARCH_HISTORY,
	ALL_DEVICES,
	ALL_PATIENTS,
	MY_DEVICES,
	MY_PATIENTS,
} from '../../config/wordMap'
import { Title } from '../BOTComponent/styleComponent'
import PropTypes from 'prop-types'

class FrequentSearch extends React.Component {
	static contextType = AppContext

	state = {
		searchKey: '',
	}

	componentDidUpdate = (prepProps) => {
		if (
			prepProps.clearSearchResult !== this.props.clearSearchResult &&
			!prepProps.clearSearchResult
		) {
			this.setState({
				searchKey: '',
			})
		}
	}

	handleClick = async (e) => {
		const { name, value } = e.target

		const searchKey = {
			type: name,
			value,
		}

		await this.props.handleSearchTypeClick(searchKey)
		this.props.getSearchKey(searchKey)

		this.setState({
			searchKey,
		})
	}

	generateFrequentItems = () => {
		let items = null
		const { auth } = this.context
		const { searchObjectArray, pinColorArray } = this.props
		const doGenerate = auth.authenticated && auth.user.searchHistory
		if (doGenerate) {
			items = auth.user.searchHistory
				.filter((item, index) => {
					return item !== '' && index < auth.user.freqSearchCount
				})
				.map((item, index) => {
					const pinColorIndex = searchObjectArray.indexOf(item)

					return (
						<Button
							variant="outline-custom"
							className="text-none"
							onClick={this.handleClick}
							style={{
								color: pinColorIndex > -1 ? pinColorArray[pinColorIndex] : null,
							}}
							key={index}
							name={SEARCH_HISTORY}
							value={item}
						>
							{item}
						</Button>
					)
				})
		}
		return items
	}

	render() {
		const { locale } = this.context

		return (
			<div>
				<div style={{ padding: '2px' }}>
					<Title list className="text-center">
						{locale.texts.FREQUENT_SEARCH}
					</Title>
				</div>
				{this.generateFrequentItems()}
				<Button
					variant="outline-custom"
					onClick={this.handleClick}
					name={ALL_DEVICES}
				>
					{locale.texts.ALL_DEVICES}
				</Button>
				<Button
					variant="outline-custom"
					onClick={this.handleClick}
					name={ALL_PATIENTS}
				>
					{locale.texts.ALL_PATIENTS}
				</Button>
				<AccessControl permission={'user:mydevice'}>
					<Button
						variant="outline-custom"
						onClick={this.handleClick}
						name={MY_DEVICES}
					>
						{locale.texts.MY_DEVICES}
					</Button>
				</AccessControl>
				<AccessControl permission={'user:mypatient'}>
					<Button
						variant="outline-custom"
						onClick={this.handleClick}
						name={MY_PATIENTS}
					>
						{locale.texts.MY_PATIENTS}
					</Button>
				</AccessControl>
			</div>
		)
	}
}

FrequentSearch.propTypes = {
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	handleSearchTypeClick: PropTypes.func.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
}

export default FrequentSearch
