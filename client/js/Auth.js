import React from 'react'
import AuthenticationContext from './context/AuthenticationContext'
import config from './config'
import apiHelper from './helper/apiHelper'
import PropTypes from 'prop-types'
import supportedLocale from './locale/supportedLocale'
import {
	getPermissionsByRoles,
	localePackage,
	getCookies,
	setCookies,
	removeCookies,
} from './helper/utilities'

class Auth extends React.Component {
	constructor() {
		super()

		const locale = getCookies('user')
			? localePackage[getCookies('user').locale]
			: localePackage[config.DEFAULT_LOCALE]

		this.state = {
			authenticated: getCookies('authenticated'),
			user: getCookies('user') || {},
			locale: {
				supportedLocale,
				...locale,
			},
		}
	}

	login = async (userInfo, { actions, callback }) => {
		const { username, password } = userInfo
		const res = await apiHelper.authApiAgent.login({
			username,
			password,
		})

		if (!res.data.authentication) {
			actions.setStatus(res.data.message)
			actions.setSubmitting(false)
		} else {
			const { userInfo: user } = res.data
			user.permissions = getPermissionsByRoles({ roles: user.roles })

			setCookies('authenticated', true)

			this.setUserCookies(user)

			this.setState(
				{
					authenticated: true,
					user,
				},
				callback
			)
		}
	}

	logout = async () => {
		const callback = () => {
			removeCookies('authenticated')
			removeCookies('user')
		}

		this.setState(
			{
				authenticated: false,
				user: config.DEFAULT_USER,
				accessToken: '',
			},
			callback
		)

		await apiHelper.authApiAgent.logout()
	}

	setUserCookies = async (user) => {
		const toBeStored = {
			name: user.name,
			roles: user.roles,
			permissions: user.permissions,
			freqSearchCount: user.freqSearchCount,
			id: user.id,
			areas_id: user.areas_id,
			locale: user.locale,
			keyword_type: user.keyword_type,
			list_id: user.list_id,
			searchHistory: user.searchHistory,
		}

		setCookies('user', toBeStored)
	}

	setArea = async (areas_id, callback) => {
		const user = {
			...this.state.user,
			areas_id,
		}

		await apiHelper.userApiAgent.setArea({ user })

		this.setUserCookies(user)

		this.setState(
			{
				...this.state,
				user,
			},
			callback
		)
	}

	handleAuthentication = () => {
		// handleAuthentication
	}

	setSearchHistory = (searchHistory) => {
		const user = {
			...this.state.user,
			searchHistory,
		}

		const callback = () => {
			this.setUserCookies(user)
		}

		this.setState(
			{
				...this.state,
				user: {
					...this.state.user,
					searchHistory,
				},
			},
			callback
		)
	}

	setUserInfo = (status, value) => {
		const callback = () => {
			this.setUserCookies({
				...this.state.user,
				[status]: value,
			})
		}

		this.setState(
			{
				...this.state,
				user: {
					...this.state.user,
					[status]: value,
				},
			},
			callback
		)
	}

	setLocale = async (abbr) => {
		await apiHelper.userApiAgent.setLocale({
			userId: this.state.user.id,
			localeName: abbr,
		})

		const callback = () => {
			const cookie = getCookies('user')
			if (cookie) {
				this.setUserCookies({
					...cookie,
					locale: abbr,
				})
			}
		}

		this.setState(
			{
				locale: {
					supportedLocale,
					...localePackage[abbr],
				},
			},
			callback
		)
	}

	setKeywordType = async (keywordTypeId) => {
		await apiHelper.userApiAgent.editKeywordType({
			userId: this.state.user.id,
			keywordTypeId,
		})

		const callback = () => {
			const cookie = getCookies('user')
			if (cookie) {
				this.setUserCookies({
					...cookie,
					keyword_type: keywordTypeId,
				})
			}
		}

		this.setState(
			{
				...this.state,
				user: {
					...this.state.user,
					keyword_type: keywordTypeId,
				},
			},
			callback
		)
	}

	render() {
		const authProviderValue = {
			...this.state,
			login: this.login,
			logout: this.logout,
			handleAuthentication: this.handleAuthentication,
			setSearchHistory: this.setSearchHistory,
			setUserInfo: this.setUserInfo,
			setLocale: this.setLocale,
			setArea: this.setArea,
			setKeywordType: this.setKeywordType,
		}

		return (
			<AuthenticationContext.Provider value={authProviderValue}>
				{this.props.children}
			</AuthenticationContext.Provider>
		)
	}
}

Auth.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Auth
