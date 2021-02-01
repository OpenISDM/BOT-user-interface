import React from 'react'

const AuthenticationContext = React.createContext({
	/** to check if authenticated or not */
	authenticated: false,

	/** store all the user details */
	user: {},

	/** accessToken of user for Auth0 */
	accessToken: '',

	/** to start the signin process */
	signin: () => {
		// do sign in
	},

	/** to start the signup process */
	signout: () => {
		// do sign out
	},

	/** handle Auth login process */
	handleAuthentication: () => {
		// to handle authentication
	},

	/** set the user's search history */
	setSearchHistory: () => {
		// set search history
	},
})

export default AuthenticationContext
