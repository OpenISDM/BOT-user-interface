import React from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import config from '../config'
import AccessControl from './AccessControl'
import { AppContext } from '../context/AppContext'
import Select from '../components/Select'
import NavNotification from './NavNotification'
// import SocketNotifciation from './SocketNotifciation'
import { navbarNavList } from '../config/pageModules'
import styleConfig from '../config/styleConfig'
import { BOTNavLink } from '../components/StyleComponents'
import routes from '../config/routes/routes'
import { SET_AREA } from '../reducer/action'
import ImageWebp from '../components/ImageWebp'
import API from '../api'

class NavbarContainer extends React.Component {
	static contextType = AppContext

	state = {
		showShiftChange: false,
		areaOptionsMap: {},
	}

	navList = navbarNavList

	handleClick = () => {
		// Do reload on this method?
	}

	componentDidMount = () => {
		this.getAreaTable()
	}

	componentDidUpdate = () => {
		const { areaOptionsMap } = this.state
		const [{ openedNotification }] = this.context.stateReducer
		if (openedNotification) {
			const { notification } = openedNotification
			const { area_id } = notification // area_id where object be triggered
			this.setCurrentArea(areaOptionsMap[area_id])
		}
	}

	getAreaTable = async () => {
		const { auth } = this.context
		const { user } = auth
		let res = null

		const isBotAdmin = user.roles && user.roles.includes('bot_admin')
		if (isBotAdmin) {
			res = await API.Area.getAreaTable()
		} else {
			res = await API.Area.getAreaTableByUserId({
				userId: user.id,
			})
		}

		if (res) {
			const areaOptionsMap = {}
			res.data.forEach((area) => {
				const bounds = []
				if (area.left_bottom_corner && area.left_bottom_corner) {
					bounds.push([area.left_bottom_corner.y, area.left_bottom_corner.x])
					bounds.push([area.right_upper_corner.y, area.right_upper_corner.x])
				}
				areaOptionsMap[area.id] = {
					...area,
					id: area.id,
					value: area.readable_name,
					label: area.readable_name,
					bounds,
				}
			})

			this.setState({
				areaOptionsMap,
			})
		}
	}

	setCurrentArea = (selectedArea) => {
		const { stateReducer } = this.context
		const [{ area }, dispatch] = stateReducer
		if (area && selectedArea && area.value !== selectedArea.value) {
			dispatch({
				type: SET_AREA,
				value: selectedArea,
			})
		}
	}

	getCurrentArea = () => {
		const [{ area }] = this.context.stateReducer
		const { areaOptionsMap } = this.state
		let currentArea = areaOptionsMap[area.id]

		// If there has no any current area then set first area to default
		if (!currentArea) {
			currentArea = Object.values(areaOptionsMap)[0]
		}

		return currentArea
	}

	render = () => {
		const { locale, auth } = this.context
		const { areaOptionsMap } = this.state
		const areaOptions = Object.values(areaOptionsMap)
		const currentArea = this.getCurrentArea()
		this.setCurrentArea(currentArea)

		return (
			<div>
				<Navbar
					bg="white"
					className="navbar sticky-top navbar-light text-capitalize font-weight-500 px-3"
					expand="lg"
					fixed="top"
					collapseOnSelect
					style={{
						boxShadow: '0 1px 6px 0 rgba(32,33,36,0.28)',
					}}
				>
					<Navbar.Brand className="p-0 mx-0">
						<Nav.Item className="nav-link nav-brand d-flex align-items-center color-black">
							<ImageWebp
								alt="LOGO"
								src={config.LOGO}
								srcWebp={config.LOGO_WEBP}
								width={40}
								className="d-inline-block align-top px-1"
							/>
							<Select
								placeholder={locale.texts.SELECT_LOCATION}
								name="select"
								value={currentArea}
								options={areaOptions}
								onChange={this.setCurrentArea}
								styles={styleConfig.reactSelectNavbar}
								isSearchable={false}
								components={{
									IndicatorSeparator: () => null,
									DropdownIndicator: () => null,
								}}
							/>
						</Nav.Item>
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="responisve-navbar-nav" />
					<Navbar.Collapse
						id="responsive-navbar-nav"
						style={{
							height: 'inherit',
						}}
					>
						<Nav
							className="mr-auto"
							style={{
								height: 'inherit',
							}}
						>
							{this.navList.map((nav) => {
								return (
									<AccessControl
										permission={nav.permission}
										platform={nav.platform}
										key={nav.alias}
									>
										{nav.module ? (
											<Dropdown className="d-flex align-items-center menu mx-1">
												<Dropdown.Toggle
													variant="light"
													className="font-weight-500 px-2"
													bsPrefix="bot-dropdown-toggle"
												>
													{
														locale.texts[
															nav.name.toUpperCase().replace(/ /g, '_')
														]
													}
												</Dropdown.Toggle>
												<Dropdown.Menu bsPrefix="bot-dropdown-menu-right dropdown-menu ">
													{nav.module &&
														nav.module.tabList.map((tab) => {
															return (
																<AccessControl
																	permission={tab.permission}
																	platform={tab.platform}
																	key={tab.name}
																>
																	<LinkContainer
																		to={{
																			pathname: nav.path,
																			state: {
																				key: tab.name.replace(/ /g, '_'),
																			},
																		}}
																		className="nav-link nav-route sub-nav-menu white-space-nowrap"
																		key={tab.name}
																	>
																		<BOTNavLink
																			primary
																			className="sub-nav-menu"
																		>
																			{
																				locale.texts[
																					tab.name
																						.toUpperCase()
																						.replace(/ /g, '_')
																				]
																			}
																		</BOTNavLink>
																	</LinkContainer>
																</AccessControl>
															)
														})}
												</Dropdown.Menu>
											</Dropdown>
										) : (
											<Nav.Item className="d-flex align-items-center menu mx-1 text-center">
												<Link
													onClick={nav.hasEvent && this.handleClick}
													to={nav.path}
													className="nav-link nav-route menu px-2"
													name={nav.alias}
												>
													{
														locale.texts[
															nav.name.toUpperCase().replace(/ /g, '_')
														]
													}
												</Link>
											</Nav.Item>
										)}
									</AccessControl>
								)
							})}
						</Nav>

						<Nav>
							<AccessControl
								permission="user:batteryNotice"
								platform={['browser', 'tablet']}
							>
								<NavNotification />
							</AccessControl>
							<Dropdown
								className="mx-1 font-weight-500"
								onSelect={(e) => {
									auth.setLocale(e)
								}}
							>
								<Dropdown.Toggle
									variant="light"
									bsPrefix="bot-dropdown-toggle"
									className="px-1 font-weight-500"
								>
									{locale.name}
								</Dropdown.Toggle>
								<Dropdown.Menu bsPrefix="bot-dropdown-menu-right dropdown-menu">
									{Object.values(locale.supportedLocale).map((lang) => {
										return (
											<BOTNavLink eventKey={lang.abbr} key={lang.abbr}>
												{lang.name}
											</BOTNavLink>
										)
									})}
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown className="mx-1">
								<Dropdown.Toggle
									variant="light"
									bsPrefix="bot-dropdown-toggle font-weight-500"
									className="px-1"
								>
									{auth.user.name}
								</Dropdown.Toggle>
								<Dropdown.Menu bsPrefix="bot-dropdown-menu-right dropdown-menu ">
									<div className="dropdownWrapper">
										<LinkContainer to={routes.ABOUT} className="bg-white">
											<Dropdown.Item className="lang-select">
												{locale.texts.ABOUT}
											</Dropdown.Item>
										</LinkContainer>
										<Dropdown.Divider />
										<LinkContainer to={routes.HOME} className="bg-white">
											<Dropdown.Item
												className="lang-select"
												onClick={auth.logout}
											>
												{locale.texts.SIGN_OUT}
											</Dropdown.Item>
										</LinkContainer>
									</div>
								</Dropdown.Menu>
							</Dropdown>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</div>
		)
	}
}

export default NavbarContainer
