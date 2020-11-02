/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserPageComponent.js

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

import React, { useEffect, useState } from 'react'
import { Tab, ListGroup } from 'react-bootstrap'
import { BOTSideNav } from '../../BOTComponent/styleComponent'
import LocaleContext from '../../../context/LocaleContext'
import AccessControl from '../../authentication/AccessControl'
import PropTypes from 'prop-types'

const BrowserPageComponent = ({ containerModule, setMessage }) => {
	const { tabList, title, defaultActiveKey } = containerModule

	const locale = React.useContext(LocaleContext)
	const [key, setKey] = useState(defaultActiveKey)

	useEffect(() => {
		setKey(defaultActiveKey)
	}, [defaultActiveKey])

	return (
		<Tab.Container
			transition={false}
			activeKey={key}
			onSelect={(k) => {
				setKey(k)
			}}
		>
			<div className="BOTsidenav">
				<div className="font-size-120-percent font-weight-bold color-black">
					{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
				</div>
				<ListGroup>
					{tabList.map((tab, index) => {
						return (
							<AccessControl
								key={index}
								permission={tab.permission}
								renderNoAccess={() => null}
							>
								<BOTSideNav
									key={index}
									eventKey={tab.name.replace(/ /g, '_')}
									action
								>
									{locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
								</BOTSideNav>
							</AccessControl>
						)
					})}
				</ListGroup>
			</div>
			<div className="BOTsidemain">
				<Tab.Content>
					{tabList.map((tab) => {
						const props = {
							type: tab.name,
							setMessage,
						}
						return (
							<Tab.Pane
								eventKey={tab.name.replace(/ /g, '_')}
								key={tab.name.replace(/ /g, '_')}
							>
								<div className="font-size-140-percent color-black">
									{locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
								</div>
								<hr />
								{tab.component(props)}
							</Tab.Pane>
						)
					})}
				</Tab.Content>
			</div>
		</Tab.Container>
	)
}

BrowserPageComponent.propTypes = {
	containerModule: PropTypes.object.isRequired,
	setMessage: PropTypes.func.isRequired,
}

export default BrowserPageComponent
