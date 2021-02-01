import React, { useContext, useEffect, useState } from 'react'
import { Tab, ListGroup } from 'react-bootstrap'
import { BOTSideNav } from '../../BOTComponent/styleComponent'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import PropTypes from 'prop-types'

const BrowserPageComponent = ({ containerModule, setMessage }) => {
	const { tabList, title, defaultActiveKey, permission } = containerModule
	const { locale } = useContext(AppContext)
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
				<AccessControl permission={permission}>
					<div className="font-size-120-percent font-weight-bold color-black">
						{locale.texts[title.toUpperCase().replace(/ /g, '_')]}
					</div>
					<ListGroup>
						{tabList.map((tab, index) => {
							return (
								<AccessControl key={index} permission={tab.permission}>
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
				</AccessControl>
			</div>
			<div className="BOTsidemain">
				<Tab.Content>
					{tabList.map((tab, index) => {
						const props = {
							type: tab.name,
							setMessage,
							key,
						}
						return (
							<AccessControl key={index} permission={tab.permission}>
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
							</AccessControl>
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
