/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        FrequentSearch.js

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

	handleClick = (e) => {
		const { name, value } = e.target

		const searchKey = {
			type: name,
			value,
		}
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
							// active={this.state.searchKey == item.name.toLowerCase()}
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
				<Title list className="text-center">
					{locale.texts.FREQUENT_SEARCH}
				</Title>
				<div className="d-inline-flex flex-column overflow-hidden-scroll custom-scrollbar max-height-30">
					<div className="text-center">{this.generateFrequentItems()}</div>

					<hr />
					<Button
						variant="outline-custom"
						onClick={this.handleClick}
						// active={this.state.searchKey == 'all devices'}
						name={ALL_DEVICES}
					>
						{locale.texts.ALL_DEVICES}
					</Button>
					<Button
						variant="outline-custom"
						onClick={this.handleClick}
						// active={this.state.searchKey == 'all devices'}
						name={ALL_PATIENTS}
					>
						{locale.texts.ALL_PATIENTS}
					</Button>
					<AccessControl
						permission={'user:mydevice'}
						renderNoAccess={() => null}
					>
						<Button
							variant="outline-custom"
							onClick={this.handleClick}
							// active={this.state.searchKey == 'my devices'}
							name={MY_DEVICES}
						>
							{locale.texts.MY_DEVICES}
						</Button>
					</AccessControl>
					<AccessControl
						permission={'user:mypatient'}
						renderNoAccess={() => null}
					>
						<Button
							variant="outline-custom"
							onClick={this.handleClick}
							name={MY_PATIENTS}
						>
							{locale.texts.MY_PATIENTS}
						</Button>
					</AccessControl>
				</div>
			</div>
		)
	}
}

FrequentSearch.propTypes = {
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
}

export default FrequentSearch
