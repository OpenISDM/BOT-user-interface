import React from 'react'
import { Tab, Nav } from 'react-bootstrap'
import {
	BOTContainer,
	PageTitle,
	BOTNav,
	BOTNavLink,
} from '../../BOTComponent/styleComponent'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'

const MobilePageComponent = ({ containerModule, setMessage }) => {
	const { locale } = React.useContext(AppContext)

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
							<AccessControl platform={tab.platform} key={tab.name}>
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
							<AccessControl platform={tab.platform} key={tab.name}>
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
