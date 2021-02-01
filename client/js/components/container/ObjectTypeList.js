/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectTypeList.js

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
import { Row, Col, ListGroup } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import apiHelper from '../../helper/apiHelper'
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

	handleNameListClick = (e) => {
		const { deviceNamedListMap, personNamedListMap } = this.props
		const itemName = e.target.getAttribute('name')
		const id = e.target.getAttribute('namedListId')

		const currentNamedList = deviceNamedListMap[id] || personNamedListMap[id]

		const namedListObjectIds = currentNamedList.objectIds.map(
			(item) => item.object_id
		)
		console.log(namedListObjectIds)
		const searchKey = {
			type: NAMED_LIST,
			value: itemName,
			namedListObjectIds,
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

		const res = await apiHelper.userApiAgent.addSearchHistory({
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
			deviceNamedListMap = [],
			personNamedListMap = [],
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

							{Object.values(deviceNamedListMap).map((item, index) => {
								const itemString = `${item.name}`
								const pinColorIndex = searchObjectArray.indexOf(item)
								const element = (
									<ListGroup.Item
										eventKey={`${itemString}:${index}`}
										key={`${itemString}:${index}`}
										onClick={this.handleNameListClick}
										name={itemString}
										namedListId={item.id}
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

							{Object.values(personNamedListMap).map((item, index) => {
								const itemString = `${item.name}`
								const pinColorIndex = searchObjectArray.indexOf(item)
								const element = (
									<ListGroup.Item
										eventKey={`${itemString}:${index}`}
										key={`${itemString}:${index}`}
										onClick={this.handleNameListClick}
										name={itemString}
										namedListId={item.id}
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
	personNamedListMap: PropTypes.array.isRequired,
	deviceNamedListMap: PropTypes.array.isRequired,
}

export default ObjectTypeList
