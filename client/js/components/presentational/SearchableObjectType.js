/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SearchableObjectType.js

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
import { Col, Nav } from 'react-bootstrap'
import apiHelper from '../../helper/apiHelper'
import { AppContext } from '../../context/AppContext'
import { OBJECT_TYPE } from '../../config/wordMap'
import { Title } from '../BOTComponent/styleComponent'
import PropTypes from 'prop-types'
/*
    this class contain two components
        1. sectionIndexList : this is the alphabet list for user to search their objects by the first letter of their type
        2. sectionTitleList : when you hover a section Index List letter, the section title list will show a row of object types of same first letter (i.e. bed, bladder scanner, ...)
*/
class SearchableObjectType extends React.Component {
	static contextType = AppContext

	state = {
		sectionIndexList: [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
		],
		IsShowSection: false,
		changeState: 0,
		firstLetterMap: [],
	}

	data = {
		sectionTitleData: [],
		floatUp: false,
	}

	shouldUpdate = false

	onSubmit = null

	API = {
		setOnSubmit: (func) => {
			this.onSubmit = func
		},

		floatUp: () => {
			this.shouldUpdate = true
			this.data.floatUp = true
			this.setState({})
		},

		floatDown: () => {
			this.shouldUpdate = true
			this.data.floatUp = false
			this.setState({})
		},
	}

	componentDidMount = () => {
		this.getData()
	}

	getData = async () => {
		const { auth } = this.context

		const res = await apiHelper.objectApiAgent.getObjectTable({
			areas_id: auth.user.areas_id,
			objectType: [config.OBJECT_TYPE.DEVICE],
		})

		if (res) {
			const objectTypeList = []
			res.data.rows.forEach((item) => {
				if (!objectTypeList.includes(item.type)) {
					objectTypeList.push(item.type)
				}
			})
			const firstLetterMap = this.getObjectIndexList(objectTypeList)

			this.setState({
				firstLetterMap,
			})
		}
	}

	getObjectIndexList = (objectList) => {
		const firstLetterMap = []
		if (objectList.length !== 0) {
			objectList.forEach((name) => {
				firstLetterMap[name[0]]
					? firstLetterMap[name[0]].push(name)
					: (firstLetterMap[name[0]] = [name])
			})
		}
		this.shouldUpdate = true
		return firstLetterMap
	}

	shouldComponentUpdate = (nextProps) => {
		if (this.shouldUpdate) {
			this.shouldUpdate = false
			return true
		}

		if (this.props.floatUp !== nextProps.floatUp) {
			if (nextProps.floatUp) {
				this.API.floatUp()
			} else {
				this.API.floatDown()
			}
		}
		return false
	}

	handleHoverEvent = (e) => {
		location.href = '#' + e.target.parentNode.getAttribute('name')
		this.shouldUpdate = true
		this.setState({
			IsShowSection: true,
		})
	}

	mouseClick = (e) => {
		this.onSubmit(e.target.innerHTML)
		this.shouldUpdate = true
		this.setState({
			IsShowSection: false,
		})
	}

	mouseLeave = () => {
		this.shouldUpdate = true
		this.setState({
			IsShowSection: false,
		})
	}

	sectionIndexHTML = () => {
		const { sectionIndexList } = this.state
		const Data = []
		let data = []
		let index = 0
		// the for loop is to screen out the alphabet without any data, output a html format
		for (const i in sectionIndexList) {
			index++
			data = (
				<Nav.Link
					key={i}
					active={false}
					href={'#' + sectionIndexList[i]}
					className="py-0 pr-0"
					name={sectionIndexList[i]}
					onMouseOver={this.handleHoverEvent}
					style={{ fontSize: '1rem' }}
				>
					{index % 2 ? (
						<div
							style={{
								height: 15,
							}}
						>
							{sectionIndexList[i]}
						</div>
					) : (
						<div
							style={{
								height: 15,
							}}
						>
							&bull;
						</div>
					)}
				</Nav.Link>
			)

			Data.push(data)
		}
		return Data
	}

	sectionTitleListHTML = () => {
		const Data = []
		let first = []
		const { searchObjectArray, pinColorArray } = this.props

		for (const titleData in this.state.firstLetterMap) {
			first = titleData
			Data.push(
				<div id={first} key={first} className="text-right text-dark">
					<h5 className="my-2">{first}</h5>
				</div>
			)

			for (const i in this.state.firstLetterMap[first]) {
				const name = this.state.firstLetterMap[first][i]
				const pinColorIndex = searchObjectArray.indexOf(name)

				Data.push(
					<div
						key={name}
						name={name}
						className="my-0 py-0 w-100 text-right"
						style={{
							cursor: 'pointer',
							color: pinColorIndex > -1 ? pinColorArray[pinColorIndex] : null,
						}}
						onClick={this.handleClick}
					>
						{name}
					</div>
				)
			}
		}
		return Data
	}

	handleClick = (e) => {
		const itemName = e.target.innerText

		const searchKey = {
			type: OBJECT_TYPE,
			value: itemName,
		}

		this.props.getSearchKey(searchKey)
		this.addSearchHistory(searchKey)
		this.shouldUpdate = true

		this.setState({
			IsShowSection: false,
		})
	}

	addSearchHistory = (searchKey) => {
		const { auth } = this.context

		if (!auth.authenticated) return

		const searchHistory = auth.user.searchHistory || []

		let flag = false

		const toReturnSearchHistory = searchHistory.map((item) => {
			if (item.name === searchKey.value) {
				item.value += 1
				flag = true
			}
			return item
		})
		if (!flag) {
			toReturnSearchHistory.push({
				name: searchKey.value,
				value: 1,
			})
		}

		const sortedSearchHistory = this.sortSearchHistory(toReturnSearchHistory)
		auth.setSearchHistory(sortedSearchHistory)
		this.checkInSearchHistory(searchKey.value)
	}

	/** Sort the user search history and limit the history number */
	sortSearchHistory = (history) => {
		const toReturn = history.sort((a, b) => {
			return b.value - a.value
		})
		return toReturn
	}

	/** Insert search history to database */
	checkInSearchHistory = async (itemName) => {
		const { auth } = this.context

		await apiHelper.userApiAgent.addSearchHistory({
			username: auth.user.name,
			keyType: 'object type search',
			keyWord: itemName,
		})

		this.setState({
			searchKey: itemName,
		})
	}

	render() {
		const { locale } = this.context

		const Setting = {
			SectionIndex: {},
			SectionListBackgroundColor: {
				backgroundColor: 'rgba(240, 240, 240, 0.95)',
			},
			SectionList: {
				borderRadius: '10px',
				overflowY: 'scroll',
				height: '70vh',
				display: this.state.IsShowSection ? 'block' : 'none',
			},
		}

		const style = {
			cross: {
				cursor: 'pointer',
				fontSize: '1.3rem',
			},
		}

		return (
			<div
				id="searchableObjectType"
				onMouseLeave={this.mouseLeave}
				className="hideScrollBar mx-2 float-right"
			>
				<Title list>{locale.texts.OBJECT}</Title>
				<Title list>{locale.texts.TYPES}</Title>
				{/** this section shows the layout of sectionIndexList (Alphabet List)*/}
				<Col
					id="SectionIndex"
					className="float-right d-flex flex-column align-items-center"
					style={{
						zIndex: this.data.floatUp ? 1080 : 1,
						right: '20%',
					}}
				>
					{this.sectionIndexHTML()}
				</Col>

				{/** this section shows the layout of sectionTitleList (the search results when you hover the section Index List */}
				<div
					id="SectionList"
					className="hideScrollBar shadow border border-primary float-right mx-0 px-3 py-2 border-secondary"
					style={{
						...Setting.SectionListBackgroundColor,
						...Setting.SectionList,
					}}
				>
					<div
						className="d-flex justify-content-start"
						style={style.cross}
						onClick={this.mouseLeave}
					>
						&#10005;
					</div>
					{this.sectionTitleListHTML(Setting)}
				</div>
			</div>
		)
	}
}

SearchableObjectType.propTypes = {
	getSearchKey: PropTypes.func.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	floatUp: PropTypes.bool.isRequired,
}

export default SearchableObjectType
