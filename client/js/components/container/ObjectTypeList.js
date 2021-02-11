import React from 'react'
import { Row, Col, ListGroup } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import API from '../../api'
import { OBJECT_TYPE, NAMED_LIST } from '../../config/wordMap'
import { Title } from '../BOTComponent/styleComponent'
import PropTypes from 'prop-types'

class ObjectTypeList extends React.Component {
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

	handleClick = (itemName, searchKey) => {
		this.props.getSearchKey(searchKey)
		this.addSearchHistory(searchKey)
		this.checkInSearchHistory(itemName)
	}

	handleObjectTypeClick = (e) => {
		const itemName = e.target.getAttribute('name')
		const searchKey = {
			type: OBJECT_TYPE,
			value: itemName,
		}

		this.handleClick(itemName, searchKey)
	}

	handleNamedListClick = (e) => {
		const itemName = e.target.getAttribute('name')
		const searchKey = {
			type: NAMED_LIST,
			value: itemName,
		}

		this.handleClick(itemName, searchKey)
	}

	/** Set search history to auth */
	addSearchHistory = (searchKey) => {
		const { auth } = this.context

		if (!auth.authenticated) return

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

		const res = await API.User.addSearchHistory({
			username: auth.user.name,
			keyType: 'object type search',
			keyWord: itemName,
		})

		if (res) {
			this.setState({
				searchKey: itemName,
			})
		}
	}

	render() {
		const { locale } = this.context
		const {
			searchObjectArray,
			pinColorArray,
			deviceObjectTypes = [],
			personObjectTypes = [],
			deviceNamedList = [],
			personNamedList = [],
		} = this.props

		const style = {
			scrollable: {
				maxHeight: '250px',
				overflowY: 'auto',
			},
		}

		return (
			<div>
				<div style={{ padding: '2px' }}>
					<Title list className="text-center">
						{locale.texts.OBJECT_TYPE}
					</Title>
				</div>
				<Row>
					<Col
						xs={6}
						sm={6}
						md={6}
						lg={6}
						xl={6}
						style={{ paddingRight: '0px' }}
					>
						<ListGroup
							style={{
								...style.scrollable,
							}}
						>
							{deviceObjectTypes.map((item, index) => {
								const pinColorIndex = searchObjectArray.indexOf(item)
								const element = (
									<ListGroup.Item
										eventKey={`${item}:${index}`}
										key={`${item}:${index}`}
										onClick={this.handleObjectTypeClick}
										name={item}
										className="d-flex text-right justify-content-end"
										style={{
											cursor: 'pointer',
											color:
												pinColorIndex > -1
													? pinColorArray[pinColorIndex]
													: null,
										}}
									>
										{item}
									</ListGroup.Item>
								)
								return element
							})}

							{deviceNamedList.map((item, index) => {
								const itemString = `${item.name}`
								const pinColorIndex = searchObjectArray.indexOf(item.name)
								const element = (
									<ListGroup.Item
										eventKey={`${itemString}:${index}`}
										key={`${itemString}:${index}`}
										onClick={this.handleNamedListClick}
										name={itemString}
										className="d-flex text-left justify-content-end"
										style={{
											cursor: 'pointer',
											color:
												pinColorIndex > -1
													? pinColorArray[pinColorIndex]
													: null,
										}}
									>
										{itemString}
									</ListGroup.Item>
								)
								return element
							})}
						</ListGroup>
					</Col>
					<Col
						xs={6}
						sm={6}
						md={6}
						lg={6}
						xl={6}
						style={{ paddingLeft: '0px' }}
					>
						<ListGroup
							style={{
								...style.scrollable,
								direction: 'rtl',
							}}
						>
							{personObjectTypes.map((item, index) => {
								const itemString = `${item}`
								const displayedItem = locale.texts[itemString.toUpperCase()]
									? locale.texts[itemString.toUpperCase()]
									: itemString

								const pinColorIndex = searchObjectArray.indexOf(item)
								const element = (
									<ListGroup.Item
										eventKey={`${itemString}:${index}`}
										key={`${itemString}:${index}`}
										onClick={this.handleObjectTypeClick}
										name={item}
										className="d-flex text-left justify-content-end"
										style={{
											cursor: 'pointer',
											color:
												pinColorIndex > -1
													? pinColorArray[pinColorIndex]
													: null,
										}}
									>
										{displayedItem}
									</ListGroup.Item>
								)
								return element
							})}

							{personNamedList.map((item, index) => {
								const itemString = `${item.name}`
								const pinColorIndex = searchObjectArray.indexOf(item.name)
								const element = (
									<ListGroup.Item
										eventKey={`${itemString}:${index}`}
										key={`${itemString}:${index}`}
										onClick={this.handleNamedListClick}
										name={itemString}
										className="d-flex text-left justify-content-end"
										style={{
											cursor: 'pointer',
											color:
												pinColorIndex > -1
													? pinColorArray[pinColorIndex]
													: null,
										}}
									>
										{itemString}
									</ListGroup.Item>
								)
								return element
							})}
						</ListGroup>
					</Col>
				</Row>
			</div>
		)
	}
}

ObjectTypeList.propTypes = {
	getSearchKey: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.func.isRequired,
	pinColorArray: PropTypes.array,
	searchObjectArray: PropTypes.array,
	personObjectTypes: PropTypes.array,
	deviceObjectTypes: PropTypes.array,
	personNamedList: PropTypes.array.isRequired,
	deviceNamedList: PropTypes.array.isRequired,
}

export default ObjectTypeList
