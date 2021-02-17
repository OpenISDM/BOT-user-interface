import React from 'react'
import CombinedContext from './js/context/AppContext'
import PrivateRoutes from './js/domain/PrivateRoutes'
import { ToastContainer } from 'react-toastify'
import config from './js/config'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import publicRoutes from './js/config/routes/publicRoutesConfig'

const App = () => {
	return (
		<CombinedContext>
			<BrowserRouter>
				<Switch>
					{publicRoutes.map((route, index) => {
						return (
							<Route
								path={route.path}
								key={index}
								exact
								component={route.component}
							/>
						)
					})}
					<PrivateRoutes />
				</Switch>
			</BrowserRouter>
			<ToastContainer {...config.TOAST_PROPS} />
		</CombinedContext>
	)
}

export default App
