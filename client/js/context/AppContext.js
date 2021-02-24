import React from 'react'
import AuthenticationContext from './AuthenticationContext'
import Auth from '../Auth'
import StateReducer from '../reducer/StateReducer'
import PropTypes from 'prop-types'

export const AppContext = React.createContext()

const AppContextProvider = (props) => {
	const auth = React.useContext(AuthenticationContext)
	const { locale, user } = auth
	const { area_ids = [] } = user
	const id = area_ids[0] ? area_ids[0] : 0 // We don't use 0 to be our area_id, so we set it to default for api work fine

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
