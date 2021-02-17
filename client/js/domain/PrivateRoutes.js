import React, { Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'
import NavbarContainer from './NavbarContainer'
import privateRoutes from '../config/routes/privateRoutesConfig'
import AuthContext from '../context/AuthenticationContext'
import routes from '../config/routes/routes'

const PrivateRoutes = () => {
	const auth = React.useContext(AuthContext)

	const { pathname } = window.location
	if (auth.authenticated && auth.user) {
		return (
			<Fragment>
				<NavbarContainer />
				{privateRoutes.map((route, index) => {
					return (
						<Route
							key={index}
							path={route.path}
							exact
							component={route.component}
						/>
					)
				})}
			</Fragment>
		)
	} else if (pathname !== routes.HOME && pathname.split('/')[1] !== 'page') {
		return <Redirect to={{ pathname: window.location.pathname, state: {} }} />
	}
	return <Redirect to={{ pathname: routes.LOGIN, state: {} }} />
}

export default PrivateRoutes
