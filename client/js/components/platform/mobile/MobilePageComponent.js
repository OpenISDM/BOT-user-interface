/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MobilePageComponent.js

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
import { Tab, Nav } from 'react-bootstrap'
import {
	BOTContainer,
	PageTitle,
	BOTNav,
	BOTNavLink,
} from '../../BOTComponent/styleComponent'
import LocaleContext from '../../../context/LocaleContext'
import AccessControl from '../../authentication/AccessControl'

const MobilePageComponent = ({ containerModule, setMessage }) => {
	const locale = React.useContext(LocaleContext)

	const { tabList, title, defaultActiveKey } = containerModule

	return (
		<BOTContainer>
			<PageTitle>
				{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
			</PageTitle>
			<Tab.Container defaultActiveKey={defaultActiveKey}>
				<BOTNav
					style={{
						width: 500,
					}}
				>
					{tabList.map((tab) => {
						return (
							<AccessControl
								renderNoAccess={() => null}
								platform={tab.platform}
								key={tab.name}
							>
								<Nav.Item>
									<BOTNavLink eventKey={tab.name.replace(/ /g, '_')}>
										{locale.texts[tab.name.replace(/ /g, '_').toUpperCase()]}
									</BOTNavLink>
								</Nav.Item>
							</AccessControl>
						)
					})}
				</BOTNav>
				<Tab.Content className="my-3">
					{tabList.map((tab) => {
						const props = {
							type: tab.name,
							setMessage,
						}
						return (
							<AccessControl
								renderNoAccess={() => null}
								platform={tab.platform}
								key={tab.name}
							>
								<Tab.Pane eventKey={tab.name.replace(/ /g, '_')}>
									{tab.component(props)}
								</Tab.Pane>
							</AccessControl>
						)
					})}
				</Tab.Content>
			</Tab.Container>
		</BOTContainer>
	)
}
export default MobilePageComponent
