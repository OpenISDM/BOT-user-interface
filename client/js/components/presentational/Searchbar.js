/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Searchbar.js

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
import searchIcon from '../../../img/icon/search.png'
import { Form, Button } from 'react-bootstrap'
import { isMobileOnly } from 'react-device-detect'
import { SEARCH_BAR } from '../../config/wordMap'

class Searchbar extends React.Component {
	state = {
		value: '',
	}

	componentDidUpdate = (prepProps) => {
		if (
			prepProps.clearSearchResult != this.props.clearSearchResult &&
			!prepProps.clearSearchResult
		) {
			this.setState({
				value: '',
			})
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const searchKey = {
			type: SEARCH_BAR,
			value: this.state.value,
		}
		this.props.getSearchKey(searchKey)
		if (isMobileOnly) this.props.handleShowResultListForMobile()
	}

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		})
	}

	render() {
		const style = {
			form: {
				border: '2px solid rgba(227, 222, 222, 0.447)',
				borderRadius: '25px',
				fontSize: '0.8rem',
				width: 450,
				minHeight: '1.2rem',
				position: 'relative',
			},
			input: {
				background: 'rgba(0,0,0,0)',
				fontSize: '1rem',
			},
		}

		const { value } = this.state
		return (
			<Form className="d-flex justify-content-around" style={style.form}>
				<Form.Group className="flex-grow-1 mb-0" style={{ maxWidth: 250 }}>
					<Form.Control
						id="searchbarText"
						type="text"
						style={style.input}
						className="border-0 pl-3 w-90 pb-0"
						value={value}
						onChange={this.handleChange}
					/>
				</Form.Group>
				<Button
					type="submit"
					variant="link"
					className="btn btn-link btn-sm bd-highlight"
					onClick={this.handleSubmit}
					style={{
						left: '100px',
					}}
				>
					<img src={searchIcon} width="23px" />
				</Button>
			</Form>
		)
	}
}

export default Searchbar
