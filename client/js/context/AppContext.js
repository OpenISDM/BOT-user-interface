import React from 'react'
import AuthenticationContext from './AuthenticationContext'
import Auth from '../Auth'
import StateReducer from '../reducer/StateReducer'
import PropTypes from 'prop-types'

export const AppContext = React.createContext()

const AppContextProvider = (props) => {
	const auth = React.useContext(AuthenticationContext)
	const { locale, user } = auth
	const { areas_id = [] } = user
	const id = areas_id[0] ? areas_id[0] : null

	const initialState = {
		area: { id },
		shouldUpdateTrackingData: true,
		assignedObject: null,
		tableSelection: [],
		trackingData: {},
		objectFoundResults: {},
		deviceObjectTypeVisible: true,
		personObjectTypeVisible: true,
		openedNotification: {},
	}

	const stateReducer = React.useReducer(StateReducer, initialState)

	const value = {
		auth,
		locale,
		stateReducer,
	}
	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	)
}

const CombinedContext = (props) => {
	return (
		<Auth>
			<AppContextProvider>{props.children}</AppContextProvider>
		</Auth>
	)
}

AppContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

CombinedContext.propTypes = {
	children: PropTypes.node.isRequired,
}

export default CombinedContext
