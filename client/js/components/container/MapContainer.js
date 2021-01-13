/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MapContainer.js

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

import React, { Fragment } from 'react'
import PdfDownloadForm from './PdfDownloadForm'
import { AppContext } from '../../context/AppContext'
import { BrowserView, TabletView, MobileOnlyView } from 'react-device-detect'
import GeneralConfirmForm from '../presentational/form/GeneralConfirmForm'
import TabletMapContainer from '../platform/tablet/TabletMapContainer'
import MobileMapContainer from '../platform/mobile/MobileMapContainer'
import BrowserMapContainer from '../platform/browser/BrowserMapContainer'
import { CLEAR_SEARCH_RESULT } from '../../config/wordMap'
import PropTypes from 'prop-types'

class MapContainer extends React.Component {
	static contextType = AppContext

	state = {
		showPdfDownloadForm: false,
		showConfirmForm: false,
	}

	handleSubmit = () => {
		// do nothing
	}

	handleClickButton = (e) => {
		const { name } = e.target

		switch (name) {
			case CLEAR_SEARCH_RESULT:
				this.props.handleClick(e)
				break
			case 'save':
				this.setState({
					showPdfDownloadForm: true,
				})
				break
			case 'geofence':
				this.setState({
					showConfirmForm: true,
					type: name,
				})
				break
			case 'location':
				this.setState({
					showConfirmForm: true,
					type: name,
				})
				break
		}
	}

	handleCloseModal = () => {
		this.setState({
			showPdfDownloadForm: false,
			showConfirmForm: false,
		})
	}

	render() {
		const { handleClickButton } = this
		const { pathData, showPdfDownloadForm } = this.state
		const {
			geofenceConfig,
			locationMonitorConfig,
			proccessedTrackingData,
			handleClearButton,
			pathMacAddress,
			searchResult,
			lbeaconPosition,
			searchObjectArray,
			pinColorArray,
			searchKey,
			getSearchKey,
			searchResultListRef,
			activeActionButtons,
		} = this.props

		const propsGroup = {
			proccessedTrackingData,
			pathData,
			showPdfDownloadForm,
			handleClickButton,
			pathMacAddress,
			searchResult,
			handleClearButton,
			geofenceConfig,
			locationMonitorConfig,
			lbeaconPosition,
			searchObjectArray,
			pinColorArray,
			searchKey,
			getSearchKey,
			searchResultListRef,
			activeActionButtons,
		}

		return (
			<Fragment>
				<BrowserView>
					<BrowserMapContainer {...propsGroup} />
				</BrowserView>
				<TabletView>
					<TabletMapContainer {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileMapContainer {...propsGroup} />
				</MobileOnlyView>
				<PdfDownloadForm
					show={this.state.showPdfDownloadForm}
					data={searchResult}
					handleClose={this.handleCloseModal}
				/>
				<GeneralConfirmForm
					show={this.state.showConfirmForm}
					handleSubmit={this.handleSubmit}
					handleClose={this.handleCloseModal}
				/>
			</Fragment>
		)
	}
}

MapContainer.propTypes = {
	geofenceConfig: PropTypes.object,
	locationMonitorConfig: PropTypes.object,
	proccessedTrackingData: PropTypes.array,
	handleClearButton: PropTypes.func,
	pathMacAddress: PropTypes.array,
	searchResult: PropTypes.array,
	lbeaconPosition: PropTypes.array,
	searchObjectArray: PropTypes.array,
	pinColorArray: PropTypes.array,
	searchKey: PropTypes.object,
	getSearchKey: PropTypes.func.isRequired,
	searchResultListRef: PropTypes.node,
	activeActionButtons: PropTypes.array,
	handleClick: PropTypes.func,
}

export default MapContainer
