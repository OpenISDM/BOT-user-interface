/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobileSearchResultList.js

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
import { Button, Col, Row } from 'react-bootstrap'
import ScrollArea from 'react-scrollbar'
import AccessControl from '../../authentication/AccessControl'
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import { AppContext } from '../../../context/AppContext'
import { Title } from '../../BOTComponent/styleComponent'

const MobileSearchResultList = ({
	searchKey,
	searchResult,
	title,
	selection,
	handleToggleNotFound,
	showNotFoundResult,
	onSelect,
}) => {
	const { locale } = React.useContext(AppContext)

	const style = {
		noResultDiv: {
			color: 'grey',
			fontSize: '1rem',
		},
		titleText: {
			color: 'rgb(80, 80, 80, 0.9)',
		},

		searchResultListForTablet: {
			maxHeight: '28vh',
			dispaly: searchKey ? null : 'none',
		},
	}

	return (
		<Fragment>
			<Row className="d-flex justify-content-center">
				<Title>{title}</Title>
			</Row>
			<Row>
				{searchResult.length === 0 ? (
					<Col
						className="d-flex justify-content-center font-weight-lighter"
						style={style.noResultDiv}
					>
						<div className="searchResultForDestop">
							{locale.texts.NO_RESULT}
						</div>
					</Col>
				) : (
					<Col className="d-flex justify-content-center overflow-hidden-scroll custom-scrollbar">
						<ScrollArea
							style={style.searchResultListForTablet}
							smoothScrolling={true}
						>
							<AccessControl
								permission={'form:edit'}
								renderNoAccess={() => (
									// TODO: To be refined
									<SearchResultListGroup
										data={searchResult}
										selection={selection}
									/>
								)}
							>
								<SearchResultListGroup
									data={searchResult}
									onSelect={onSelect}
									selection={selection}
									action
								/>
							</AccessControl>
						</ScrollArea>
					</Col>
				)}
			</Row>
			<Row className="d-flex justify-content-center mt-3">
				<Button
					variant="link"
					onClick={handleToggleNotFound}
					size="lg"
					disabled={false}
				>
					{showNotFoundResult
						? locale.texts.SHOW_SEARCH_RESULTS_FOUND
						: locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND}
				</Button>
			</Row>
		</Fragment>
	)
}

export default MobileSearchResultList
