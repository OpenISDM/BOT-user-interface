/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        NavbarContainer.js

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
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import config from '../../config'
import AccessControl from '../authentication/AccessControl'
import ShiftChange from './ShiftChange'
import { AppContext } from '../../context/AppContext'
import Select from 'react-select'
import BatteryLevelNotification from './BatteryLevelNotification'
import { navbarNavList } from '../../config/pageModules'
import styleConfig from '../../config/styleConfig'
import { BOTNavLink } from '../BOTComponent/styleComponent'
import routes from '../../config/routes/routes'
import { SHIFT_CHANGE } from '../../config/wordMap'
import { SET_AREA } from '../../reducer/action'
import ImageWebp from '../utils/ImageWebp'

class NavbarContainer extends React.Component {
    static contextType = AppContext

    state = {
        showShiftChange: false,
    }

    navList = navbarNavList

    render = () => {
        const style = {
            navbar: {
                boxShadow: '0 1px 6px 0 rgba(32,33,36,0.28)',
            },
        }

        const { locale, auth, stateReducer } = this.context

        const [{ areaId }, dispatch] = stateReducer

        const { showShiftChange } = this.state

        const AREA_MODULE = config.mapConfig.AREA_MODULES

        const options = Object.values(AREA_MODULE)
            .filter((module) => auth.user.areas_id.includes(module.id))
            .map((module) => {
                return {
                    value: module.name,
                    label: locale.texts[module.name],
                    id: module.id,
                }
            })

        const selectedArea = options.filter((module) => module.id == areaId)
        return (
            <div>
                <Navbar
                    bg="white"
                    className="navbar sticky-top navbar-light text-capitalize font-weight-500 px-3"
                    expand="lg"
                    fixed="top"
                    collapseOnSelect
                    style={style.navbar}
                >
                    <Navbar.Brand className="p-0 mx-0">
                        <Nav.Item className="nav-link nav-brand d-flex align-items-center color-black">
                            <ImageWebp
                                alt="LOGO"
                                src={config.LOGO}
                                srcWebp={config.LOGO_WEBP}
                                width={30}
                                className="d-inline-block align-top px-1"
                            />
                            <Select
                                placeholder={locale.texts.SELECT_LOCATION}
                                name="select"
                                value={selectedArea}
                                options={options}
                                onChange={(value) => {
                                    const { stateReducer } = this.context
                                    const [{ areaId }, dispatch] = stateReducer
                                    dispatch({
                                        type: SET_AREA,
                                        value: value.id,
                                    })
                                }}
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
                                        renderNoAccess={() => null}
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
                                                            nav.name
                                                                .toUpperCase()
                                                                .replace(
                                                                    / /g,
                                                                    '_'
                                                                )
                                                        ]
                                                    }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu bsPrefix="bot-dropdown-menu-right dropdown-menu ">
                                                    {nav.module &&
                                                        nav.module.tabList.map(
                                                            (tab) => {
                                                                return (
                                                                    <AccessControl
                                                                        permission={
                                                                            tab.permission
                                                                        }
                                                                        renderNoAccess={() =>
                                                                            null
                                                                        }
                                                                        platform={
                                                                            tab.platform
                                                                        }
                                                                        key={
                                                                            tab.name
                                                                        }
                                                                    >
                                                                        <LinkContainer
                                                                            to={{
                                                                                pathname:
                                                                                    nav.path,
                                                                                state: {
                                                                                    key: tab.name.replace(
                                                                                        / /g,
                                                                                        '_'
                                                                                    ),
                                                                                },
                                                                            }}
                                                                            className="nav-link nav-route sub-nav-menu white-space-nowrap"
                                                                            key={
                                                                                tab.name
                                                                            }
                                                                        >
                                                                            <BOTNavLink
                                                                                primary
                                                                                className="sub-nav-menu"
                                                                            >
                                                                                {
                                                                                    locale
                                                                                        .texts[
                                                                                            tab.name
                                                                                                .toUpperCase()
                                                                                                .replace(
                                                                                                    / /g,
                                                                                                    '_'
                                                                                                )
                                                                                        ]
                                                                                }
                                                                            </BOTNavLink>
                                                                        </LinkContainer>
                                                                    </AccessControl>
                                                                )
                                                            }
                                                        )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        ) : (
                                            <Nav.Item className="d-flex align-items-center menu mx-1 text-center">
                                                <Link
                                                    onClick={
                                                        nav.hasEvent &&
                                                        this.handleClick
                                                    }
                                                    to={nav.path}
                                                    className="nav-link nav-route menu px-2"
                                                    name={nav.alias}
                                                >
                                                    {
                                                        locale.texts[
                                                            nav.name
                                                                .toUpperCase()
                                                                .replace(
                                                                    / /g,
                                                                    '_'
                                                                )
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
                                renderNoAccess={() => null}
                                platform={['browser', 'tablet']}
                            >
                                <BatteryLevelNotification />
                            </AccessControl>
                            <Dropdown
                                className="mx-1 font-weight-500"
                                onSelect={(e) => {
                                    const callback = () => auth.setLocale(e)
                                    locale.setLocale(e, callback)
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
                                    {Object.values(locale.supportedLocale).map(
                                        (lang) => {
                                            return (
                                                <BOTNavLink
                                                    eventKey={lang.abbr}
                                                    key={lang.abbr}
                                                >
                                                    {lang.name}
                                                </BOTNavLink>
                                            )
                                        }
                                    )}
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
                                        <LinkContainer
                                            to={routes.ABOUT}
                                            className="bg-white"
                                        >
                                            <Dropdown.Item className="lang-select">
                                                {locale.texts.ABOUT}
                                            </Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Divider />
                                        <LinkContainer
                                            to={routes.HOME}
                                            className="bg-white"
                                        >
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
