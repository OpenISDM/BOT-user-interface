/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../js/locale';
import { Navbar, Nav, NavDropdown, Image, Dropdown  } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import SigninPage from '../container/SigninPage';
import SignupPage from '../container/SignupPage';
import ShiftChange from '../container/ShiftChange';

import Cookies from 'js-cookie'

import config from '../../config';

class NavbarContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            isShowShiftChange: false,
            isSignin: false,
            isShowSigninForm: false,
            isShowSignupForm: false,
            user: Cookies.get('user') || null,
        }
        this.handleLangSelect = this.handleLangSelect.bind(this);

        this.handleSigninFormShowUp = this.handleSigninFormShowUp.bind(this);
        this.handleSigninFormSubmit = this.handleSigninFormSubmit.bind(this);
        this.handleSignout = this.handleSignout.bind(this);

        this.handleSignupFormShowUp = this.handleSignupFormShowUp.bind(this);
        this.handleSignupFormSubmit = this.handleSignupFormSubmit.bind(this);
        this.handleSignFormClose = this.handleSignFormClose.bind(this);

        this.handleShiftChangeRecordShowUp = this.handleShiftChangeRecordShowUp.bind(this);
        this.handleShiftChangeRecordSubmit = this.handleShiftChangeRecordSubmit.bind(this);
        this.handleShiftChangeRecordClose = this.handleShiftChangeRecordClose.bind(this);


    }

    handleLangSelect(eventKey) {
        this.props.changeLocale(eventKey);
    }

    handleSigninFormShowUp() {
        this.setState({
            isShowSigninForm: true,
            isShowSignupForm: false,
            isShowShiftChange: false
        })
    }

    handleSignupFormShowUp() {
        this.setState({
            isShowSigninForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    isShowSignupForm: true,
                })
            }.bind(this),
            300
        )
    }

    handleShiftChangeRecordShowUp(){

        this.setState({
            isShowShiftChange: true
        })
    }

    handleSigninFormSubmit(username) {
        this.setState({
            isSignin: true,
            isShowSigninForm: false,
        })
    }

    handleSignupFormSubmit() {
        this.setState({
            isShowSignupForm: false,
        })
    }

    handleSignout() {
        Cookies.remove('user')
        Cookies.remove('searchHistory')
        this.setState({
            user: null
        })
        // window.location.reload()
    }

    handleSignFormClose() {
        this.setState({
            isShowSigninForm: false,
            isShowSignupForm: false,
        })
    }


    handleShiftChangeRecordSubmit(){
        
    }


    handleShiftChangeRecordClose(){

        this.setState({
            isShowShiftChange: false
        })
    }

    

    render() {
        const style = {
            navbar: {
                boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
                fontWeight: '450',

            },
            navbarBrand: {
                color: 'black'
            }
        }
        const locale = this.context;
        const { isSignin, isShowSigninForm, isShowSignupForm, isShowShiftChange } = this.state;

        return (
            <Navbar id='navbar' bg="white" className="navbar sticky-top navbar-light" expand='xl' style={style.navbar}>
                <Navbar.Brand className='px-0 mx-0'>  
                    <Link to="/" className="nav-link nav-brand d-flex align-items-center px-0" style={style.navbarBrand}>
                        <Image
                            alt=""
                            src={config.image.logo}
                            width={50}
                            className="d-inline-block align-top px-1"
                        />
                        {config.companyName}
                    </Link>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">  
                    <Nav className="mr-auto" >
                        <Nav.Item><Link to="/" className="nav-link nav-route" >Home</Link></Nav.Item>
                        {!Cookies.get('user') &&
                            <>
                                <Nav.Item><Link to="/page/healthReport" className="nav-link nav-route" >{locale.HEALTH_REPORT}</Link></Nav.Item>
                                <Nav.Item><Link to="/page/geofence" className="nav-link nav-route" >Geofence</Link></Nav.Item>
                                <Nav.Item><Link to="/page/objectManagement" className="nav-link nav-route" >Object Management</Link></Nav.Item>
                            </>
                        }
                    </Nav>
                    <Nav>
                        <NavDropdown className='text-capitalize' title={locale.language} id="collasible-nav-dropdown" alignRight onSelect={this.handleLangSelect}>
                            {Object.values(supportedLocale).map( (locale,index) => {
                                return <NavDropdown.Item key={index} className="lang-select" eventKey={locale.abbr}>{locale.name}</NavDropdown.Item>
                            })}
                        </NavDropdown>          
                        {Cookies.get('user')
                            ? <NavDropdown title={<i className="fas fa-user-alt"></i> }id="collasible-nav-dropdown" alignRight>
                                <NavDropdown.Item className="lang-select" disabled>{Cookies.get('user')}</NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item className="lang-select" onClick={this.handleShiftChangeRecordShowUp}>{locale.SHIFT_CHANGE_RECORD}</NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item className="lang-select" onClick={this.handleSignout}>{locale.SIGN_OUT}</NavDropdown.Item>

                            </NavDropdown> 
                                
                            : <Nav.Item className="nav-link" onClick={this.handleSigninFormShowUp}>{locale.SIGN_IN}</Nav.Item>
                        }
                    </Nav>
                </Navbar.Collapse>

                <SigninPage 
                    show={isShowSigninForm}
                    handleSigninFormSubmit={this.handleSigninFormSubmit}
                    handleSignupFormShowUp={this.handleSignupFormShowUp}
                    handleSignFormClose={this.handleSignFormClose}
                />
                <SignupPage 
                    show={isShowSignupForm}
                    handleSignupFormSubmit={this.handleSignupFormSubmit}
                    handleSignFormClose={this.handleSignFormClose}
                />
                <ShiftChange 
                    show = {isShowShiftChange}

                    handleShiftChangeRecordSubmit = {this.handleShiftChangeRecordSubmit}
                    handleShiftChangeRecordClose={this.handleShiftChangeRecordClose}
                />
            </Navbar>
            
            
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
