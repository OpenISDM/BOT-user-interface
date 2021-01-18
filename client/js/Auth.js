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
import config from './config'
import { SET_AREA } from './reducer/action'
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

	login = async (userInfo, { actions, dispatch, callback }) => {
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
	}

	setUserCookies = async (user) => {
		const toBeStored = {
			name: user.name,
			roles: user.roles,
			permissions: user.permissions,
			freqSearchCount: user.freqSearchCount,
			id: user.id,
			areas_id: user.areas_id,
			main_area: user.main_area,
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
