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
import axios from 'axios'
import dataSrc from './dataSrc'
import config from './config'
import permissionsTable from './config/roles'
import { AppContext } from './context/AppContext'
import { SET_AREA } from './reducer/action'
import apiHelper from './helper/apiHelper'

class Auth extends React.Component {
    static contextType = AppContext

    state = {
        authenticated: !!Cookies.get('authenticated'),
        user:
            Cookies.get('authenticated') && Cookies.get('user')
                ? { ...JSON.parse(Cookies.get('user')) }
                : config.DEFAULT_USER,
    }

    login = (userInfo, { actions, dispatch, callback, locale }) => {
        const { username, password } = userInfo

        apiHelper.authApiAgent
            .login({
                username,
                password,
            })
            .then((res) => {
                if (!res.data.authentication) {
                    actions.setStatus(res.data.message)
                    actions.setSubmitting(false)
                } else {
                    const { userInfo } = res.data

                    if (userInfo.roles.includes('dev')) {
                        userInfo.permissions = Object.keys(
                            permissionsTable
                        ).reduce((permissions, role) => {
                            permissionsTable[role].permission.map((item) => {
                                if (!permissions.includes(item)) {
                                    permissions.push(item)
                                }
                            })
                            return permissions
                        }, [])
                    } else {
                        userInfo.permissions = userInfo.roles.reduce(
                            (permissions, role) => {
                                permissionsTable[role].permission.map(
                                    (item) => {
                                        if (!permissions.includes(item)) {
                                            permissions.push(item)
                                        }
                                    }
                                )
                                return permissions
                            },
                            []
                        )
                    }

                    Cookies.set('authenticated', true)
                    Cookies.set('user', userInfo)

                    locale.setLocale(userInfo.locale)

                    dispatch({
                        type: SET_AREA,
                        value: userInfo.main_area,
                    })

                    this.setState(
                        {
                            authenticated: true,
                            user: userInfo,
                        },
                        callback
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    logout = () => {
        apiHelper.authApiAgent
            .logout()
            .then((res) => {
                Cookies.remove('authenticated')
                Cookies.remove('user')
                this.setState({
                    authenticated: false,
                    user: config.DEFAULT_USER,
                    accessToken: '',
                })
            })
            .catch((err) => {
                console.log(`logout failed ${err}`)
            })
    }

    signup = (values, callback) => {
        const { name, email, password, roles, area } = values

        axios
            .post(dataSrc.user, {
                name: name.toLowerCase(),
                email: email.toLowerCase(),
                password,
                roles,
                area_id: area.id,
                ...values,
            })
            .then((res) => {
                callback()
            })
    }

    setUser = (user, callback) => {
        axios
            .put(dataSrc.user, {
                user,
            })
            .then((res) => {
                callback()
            })
            .catch((err) => {
                console.log(`set user info failed ${err}`)
            })
    }

    setArea = (areas_id, callback) => {
        const user = {
            ...this.state.user,
            areas_id,
        }
        axios
            .post(dataSrc.userInfo.area.secondary, {
                user,
            })
            .then((res) => {
                this.setCookies('user', user)
                this.setState(
                    {
                        ...this.state,
                        user,
                    },
                    callback
                )
            })
            .catch((err) => {
                console.log(`set secondary area failed ${err}`)
            })
    }

    handleAuthentication = () => {}

    setSession(authResult) {}

    setCookies(key, value) {
        Cookies.set(key, value)
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

    setLocale = (abbr) => {
        apiHelper.userApiAgent
            .setLocale({
                userId: this.state.user.id,
                localeName: abbr,
            })
            .then((res) => {
                Cookies.set('user', {
                    ...JSON.parse(Cookies.get('user')),
                    locale: abbr,
                })
            })
            .catch((err) => {
                console.log(`set locale failed ${err}`)
            })
    }

    setKeywordType = (keywordTypeId) => {
        apiHelper.userApiAgent
            .editKeywordType({
                userId: this.state.user.id,
                keywordTypeId,
            })
            .then((res) => {
                const callback = () => {
                    Cookies.set('user', {
                        ...JSON.parse(Cookies.get('user')),
                        keyword_type: keywordTypeId,
                    })
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
            })
            .catch((err) => {
                console.log(`edit keyword type failed ${err}`)
            })
    }

    setListId = (id) => {
        apiHelper.userApiAgent
            .editListId({
                userId: this.state.user.id,
                listId: id,
            })
            .then((res) => {
                this.setState({
                    ...this.state,
                    user: {
                        ...this.state.user,
                        list_id: id,
                    },
                })
            })
            .catch((err) => {
                console.log(`edit list id failed ${err}`)
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

export default Auth
