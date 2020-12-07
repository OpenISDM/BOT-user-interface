/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TabletMapContainer.js

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
import QRcodeContainer from '../../container/QRcode'
import { AppContext } from '../../../context/AppContext'
import InfoPrompt from '../../presentational/InfoPrompt'
import config from '../../../config'
import { Nav, Button } from 'react-bootstrap'
import AccessControl from '../../authentication/AccessControl'
import Map from '../../presentational/Map'

export default class TabletMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { locale, stateReducer, auth } = this.context

		const {
			hasSearchKey,
			proccessedTrackingData,
			showedObjects,
			showPdfDownloadForm,
			handleClickButton,
			currentAreaId,
		} = this.props
		const [{ area }] = stateReducer
		const style = {
			title: {
				color: 'grey',
				fontSize: '1rem',
				maxWidth: '9rem',
				height: '5rem',
				lineHeight: '3rem',
			},
			MapAndQrcode: {
				height: '42vh',
			},
			qrBlock: {
				width: '10vw',
			},
			mapBlockForTablet: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
				width: '60vw',
			},
			button: {
				fontSize: '0.8rem',
			},
		}

		return (
			<div id="MapContainer" className="w-100 h-100 d-flex flex-column">
				<div className="d-flex w-100 h-100 flex-column">
					<div
						className="w-100 d-flex flex-row align-items justify-content"
						style={style.MapAndQrcode}
					>
						<div
							style={style.qrBlock}
							className="d-flex flex-column align-items"
						>
							<div>
								<QRcodeContainer
									data={proccessedTrackingData.filter((item) => item.searched)}
									userInfo={auth.user}
									searchKey={this.props.searchKey}
									isSearched={this.props.isSearched}
								/>
								<InfoPrompt
									searchKey={this.props.searchKey}
									searchResult={this.props.searchResult}
									title={locale.texts.FOUND}
									title2={locale.texts.NOT_FOUND}
								/>
							</div>
						</div>
						{console.log(currentAreaId)}
						<div style={style.mapBlockForTablet}>
							<Map
								pathMacAddress={this.props.pathMacAddress}
								hasSearchKey={hasSearchKey}
								colorPanel={this.props.colorPanel}
								proccessedTrackingData={this.props.proccessedTrackingData}
								lbeaconPosition={this.props.lbeaconPosition}
								geofenceConfig={this.props.geofenceConfig}
								getSearchKey={this.props.getSearchKey}
								areaId={area.id}
								searchedObjectType={showedObjects}
								mapConfig={config.mapConfig}
								handleClosePath={this.props.handleClosePath}
								handleShowPath={this.props.handleShowPath}
								showPath={this.props.showPath}
								currentAreaId={currentAreaId}
							/>
						</div>
					</div>
					<div>
						<Nav
							style={style.button}
							className="d-flex align-items-start text-capitalize bd-highlight"
						>
							<Nav.Item className="mt-2">
								<Button
									variant="outline-primary"
									className="mr-1 ml-2 text-capitalize"
									onClick={handleClickButton}
									name="clear"
									disabled={!hasSearchKey}
								>
									{locale.texts.CLEAR}
								</Button>
							</Nav.Item>
							<AccessControl permission={'user:saveSearchRecord'}>
								<Nav.Item className="mt-2">
									<Button
										variant="outline-primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={handleClickButton}
										name="save"
										disabled={!this.props.hasSearchKey || showPdfDownloadForm}
									>
										{locale.texts.SAVE}
									</Button>
								</Nav.Item>
							</AccessControl>
							<AccessControl permission={'user:toggleShowDevices'}>
								<Nav.Item className="mt-2">
									<Button
										variant="primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={handleClickButton}
										name="searchedObjectType"
										value={[-1, 0]}
										active={
											this.props.showedObjects.includes(0) ||
											this.props.showedObjects.includes(-1)
										}
										disabled={
											!(
												this.props.searchedObjectType.includes(-1) ||
												this.props.searchedObjectType.includes(0)
											)
										}
									>
										{!(
											this.props.showedObjects.includes(0) ||
											this.props.showedObjects.includes(-1)
										)
											? locale.texts.SHOW_DEVICES
											: locale.texts.HIDE_DEVICES}
									</Button>
								</Nav.Item>
							</AccessControl>
							<AccessControl permission={'user:toggleShowResidents'}>
								<Nav.Item className="mt-2">
									<Button
										variant="primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={handleClickButton}
										name="searchedObjectType"
										value={[-2, 1, 2]}
										active={
											this.props.showedObjects.includes(1) ||
											this.props.showedObjects.includes(2)
										}
										disabled={
											!(
												this.props.searchedObjectType.includes(1) ||
												this.props.searchedObjectType.includes(2)
											)
										}
									>
										{!(
											this.props.showedObjects.includes(1) ||
											this.props.showedObjects.includes(2)
										)
											? locale.texts.SHOW_RESIDENTS
											: locale.texts.HIDE_RESIDENTS}
									</Button>
								</Nav.Item>
							</AccessControl>
							{process.env.IS_TRACKING_PATH_ON == 1 && (
								<AccessControl permission={'user:cleanPath'}>
									<Nav.Item className="mt-2">
										<Button
											variant="primary"
											className="mr-1 ml-2 text-capitalize"
											onClick={handleClickButton}
											name="cleanPath"
											disabled={this.props.pathMacAddress == ''}
										>
											{locale.texts.CLEAN_PATH}
										</Button>
									</Nav.Item>
								</AccessControl>
							)}
						</Nav>
					</div>
				</div>
			</div>
		)
	}
}
