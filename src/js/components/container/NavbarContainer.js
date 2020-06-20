/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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


import React from 'react';
import { 
    BrowserRouter as Router, 
    Link, 
} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { 
    Navbar, 
    Nav, 
    Image, 
    Dropdown  
} from 'react-bootstrap'
import SiginForm from '../presentational/SigninForm';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import ShiftChange from './ShiftChange'
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import BatteryLevelNotification from "./BatteryLevelNotification"
import { navbarNavList } from '../../config/pageModules'
import styleConfig from '../../config/styleConfig';

class NavbarContainer extends React.Component {

    static contextType = AppContext

    state = {
        showSignin: false,
        showShiftChange: false,
    }

    navList = navbarNavList

    handleClose = () => {
        this.setState({
            showSignin: false,
            showShiftChange: false
        })
    }

    handleClick = (e) => {
        let name = e.target.getAttribute('name')
        switch(name) {
            case 'shiftChange':
            e.preventDefault()
            this.setState({
                showShiftChange: true
            })
            break;
            case 'signin':
            this.setState({
                showSignin: true,
            })
            break;
        }
    }

    render= () => {
        const style = {
            navbar: {
                boxShadow: '0 1px 6px 0 rgba(32,33,36,0.28)',
                fontWeight: '450',
            },
            navbarBrand: {
                color: 'black',
            },
            nav: {
                padding: '.5rem 1.4rem'
            },
            select: {
                border: 0,
            },
        }

        const { 
            locale, 
            auth, 
            stateReducer 
        } = this.context;

        const [{ areaId }, dispatch] = stateReducer
        const { 
            showSignin, 
            showShiftChange
        } = this.state;

        const {
            areaOptions,
            defaultAreaId,
        } = config.mapConfig

        const options = Object.values(config.mapConfig.areaOptions).map(area => {
            return {
                value: area,
                label: locale.texts[area.toUpperCase().replace(/ /g, '_')],
            }
        })

        let selectedArea = {
            value: areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0],
            label: this.context.locale.texts[areaOptions[areaId]] || 
                this.context.locale.texts[areaOptions[defaultAreaId]] || 
                this.context.locale.texts[Object.values(areaOptions)[0]]
        }

        return (
            <Navbar
                id="navbar"  
                bg="white" 
                className="navbar sticky-top navbar-light text-capitalize" 
                expand="lg"
                fixed="top" 
                collapseOnSelect
                style={style.navbar}
            >
                <Navbar.Brand className='px-0 mx-0'>  
                    <Nav.Item 
                        className="nav-link nav-brand d-flex align-items-center" 
                        style={style.navbarBrand}
                    >
                        <Image
                            alt=""
                            src={config.LOGO}
                            width={50}
                            className="d-inline-block align-top px-1"
                        />
                        <Select
                            placeholder = {locale.texts.SELECT_LOCATION}
                            name="select"
                            value = {selectedArea}
                            options={options}
                            onChange={value => {
                                let { stateReducer } = this.context
                                let [{areaId}, dispatch] = stateReducer
                                dispatch({
                                    type: 'setArea',
                                    value: config.mapConfig.areaModules[value.value].id
                                })
                            }}
                            styles={styleConfig.reactSelectNavbar}
                            isSearchable={false}
                            components={{
                                IndicatorSeparator: () => null,
                                DropdownIndicator:() => null
                            }}
                        />
                    </Nav.Item> 
                </Navbar.Brand>
                
                <Navbar.Toggle 
                    aria-controls='responisve-navbar-nav' 
                />
                <Navbar.Collapse id='responsive-navbar-nav'>  
                    <Nav className='mr-auto my-auto' >
                        {this.navList.map(nav => {
                            return (
                                <AccessControl
                                    permission={nav.permission}
                                    renderNoAccess={() => null}
                                    platform={nav.platform}
                                    key={nav.alias}
                                >
                                    <Nav.Item>
                                        <Link 
                                            to={nav.path} 
                                            className='nav-link nav-route'
                                            name={nav.alias}
                                            onClick={nav.hasEvent && this.handleClick}
                                            key={nav.alias}
                                            style={style.nav}
                                        >
                                            {locale.texts[nav.name.toUpperCase().replace(/ /g, '_')]}
                                        </Link>
                                    </Nav.Item>
                                </AccessControl>
                            )
                        })}
                    </Nav>

                    <Nav>
                        <AccessControl
                            permission={'user:batteryNotice'}
                            renderNoAccess={() => null}
                            platform={['browser', 'tablet']}
                        >
                            <BatteryLevelNotification />
                        </AccessControl>
                        <Nav.Item 
                            className='nav-link nav-route' 
                            name={'en'}
                            onClick={(e) => locale.changeLocale(e, auth)}                         
                        >
                            {locale.toggleLang().nextLangName}
                        </Nav.Item>
                        {auth.authenticated
                            ?   (
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant='light'
                                        id='collasible-nav-dropdown' 
                                    >
                                        <i className='fas fa-user-alt' />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        bsPrefix='bot-dropdown-menu-right  dropdown-menu '
                                    >
                                        <div className='dropdownWrapper'>
                                            <LinkContainer to='/page/userSetting' className='bg-white'>
                                                <Dropdown.Item 
                                                    className='lang-select text-none'
                                                >
                                                    {auth.user.name}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Divider />
                                            <LinkContainer to='/page/about' className='bg-white'>
                                                <Dropdown.Item className='lang-select'>
                                                    {locale.texts.ABOUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Divider />
                                            <LinkContainer to='/' className='bg-white'>
                                                <Dropdown.Item className='lang-select' onClick={auth.signout}>
                                                    {locale.texts.SIGN_OUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown> 
                            )

                            :   (
                                <Nav.Item 
                                    className='nav-link nav-route' 
                                    onClick={this.handleClick}
                                    name='signin'
                                >
                                    {locale.texts.SIGN_IN}
                                </Nav.Item>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>

                <SiginForm 
                    show={showSignin}
                    handleClose={this.handleClose}
                />
                <ShiftChange 
                    show={showShiftChange}
                    handleClose={this.handleClose}
                />
            </Navbar>
        );
    }
}

export default NavbarContainer;