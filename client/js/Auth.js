/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Auth.js

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

import React from 'react'
import AuthenticationContext from './context/AuthenticationContext'
import Cookies from 'js-cookie'
import config from './config'
import permissionsTable from './config/roles'
import { AppContext } from './context/AppContext'
import { SET_AREA } from './reducer/action'
import apiHelper from './helper/apiHelper'
import PropTypes from 'prop-types'

class Auth extends React.Component {
	static contextType = AppContext

	state = {
		authenticated: false,
		user: config.DEFAULT_USER,
	}

	componentDidMount = () => {
		this.setState({
			authenticated: !!this.getCookies('authenticated'),
			user:
				this.getCookies('authenticated') && this.getCookies('user')
					? { ...this.getCookies('user') }
					: config.DEFAULT_USER,
		})
	}

	login = async (userInfo, { actions, dispatch, callback, locale }) => {
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
			if (user.roles.includes('dev')) {
				user.permissions = Object.keys(permissionsTable).reduce(
					(permissions, role) => {
						permissionsTable[role].permission.forEach((item) => {
							if (!permissions.includes(item)) {
								permissions.push(item)
							}
						})
						return permissions
					},
					[]
				)
			} else {
				user.permissions = user.roles.reduce((permissions, role) => {
					permissionsTable[role].permission.forEach((item) => {
						if (!permissions.includes(item)) {
							permissions.push(item)
						}
					})
					return permissions
				}, [])
			}

			this.setCookies('authenticated', true)
			this.setCookies('user', user)

			dispatch({
				type: SET_AREA,
				value: { id: user.main_area },
			})

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
		await apiHelper.authApiAgent.logout()
		Cookies.remove('authenticated')
		Cookies.remove('user')
		this.setState({
			authenticated: false,
			user: config.DEFAULT_USER,
			accessToken: '',
		})
	}

	signup = async (values, callback) => {
		const { name, email, password, roles, area } = values

		await apiHelper.userApiAgent.signup({
			name: name.toLowerCase(),
			email: email.toLowerCase(),
			password,
			roles,
			area_id: area.id,
			...values,
		})

		callback()
	}

	setUser = async (user, callback) => {
		await apiHelper.userApiAgent.setUser({ user })
		callback()
	}

	setArea = async (areas_id, callback) => {
		const user = {
			...this.state.user,
			areas_id,
		}
		await apiHelper.userApiAgent.setArea({ user })
		this.setCookies('user', user)
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

	setCookies = (key, value) => {
		Cookies.set(key, JSON.stringify(value))
	}

	getCookies = (key) => {
		const value = Cookies.get(key)
		return value ? JSON.parse(value) : null
	}

	setSearchHistory = (searchHistory) => {
		const userInfo = {
			...this.state.user,
			searchHistory,
		}
		this.setCookies('user', userInfo)
		this.setState({
			...this.state,
			user: {
				...this.state.user,
				searchHistory,
			},
		})
	}

	setMyDevice = (myDevice) => {
		this.setState({
			...this.state,
			user: {
				...this.state.user,
				myDevice,
			},
		})
	}

	setUserInfo = (status, value) => {
		this.setState({
			...this.state,
			user: {
				...this.state.user,
				[status]: value,
			},
		})
		this.setCookies('user', {
			...this.state.user,
			[status]: value,
		})
	}

	setLocale = async (abbr) => {
		await apiHelper.userApiAgent.setLocale({
			userId: this.state.user.id,
			localeName: abbr,
		})
		const cookie = this.getCookies('user')
		if (cookie) {
			this.setCookies('user', {
				...cookie,
				locale: abbr,
			})
		}
	}

	setKeywordType = async (keywordTypeId) => {
		await apiHelper.userApiAgent.editKeywordType({
			userId: this.state.user.id,
			keywordTypeId,
		})
		const callback = () => {
			const cookie = this.getCookies('user')
			if (cookie) {
				this.setCookies('user', {
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

	setListId = async (id) => {
		await apiHelper.userApiAgent.editListId({
			userId: this.state.user.id,
			listId: id,
		})
		this.setState({
			...this.state,
			user: {
				...this.state.user,
				list_id: id,
			},
		})
	}

	render() {
		const authProviderValue = {
			...this.state,
			login: this.login,
			signup: this.signup,
			logout: this.logout,
			handleAuthentication: this.handleAuthentication,
			setSearchHistory: this.setSearchHistory,
			setMyDevice: this.setMyDevice,
			setUserInfo: this.setUserInfo,
			setCookies: this.setCookies,
			setLocale: this.setLocale,
			setUser: this.setUser,
			setArea: this.setArea,
			setKeywordType: this.setKeywordType,
			setListId: this.setListId,
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
