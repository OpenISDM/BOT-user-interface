/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Locale.js

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

import generalTexts from './text'
import siteModuleTexts from '../../../site_module/locale/text'
import incTexts from '../../inc/doc/locale/text'
import React from 'react'
import LocaleContext from '../context/LocaleContext'
import config from '../config'
import Cookies from 'js-cookie'
import supportedLocale from './supportedLocale'

const localePackage = Object.values(supportedLocale).reduce(
	(localeMap, locale) => {
		localeMap[locale.abbr] = locale
		localeMap[locale.abbr].texts = {
			...generalTexts[locale.abbr],
			...siteModuleTexts[locale.abbr],
			...incTexts[locale.abbr],
		}
		return localeMap
	},
	{}
)

class Locale extends React.Component {
	state = Cookies.get('user')
		? localePackage[JSON.parse(Cookies.get('user')).locale]
		: localePackage[config.DEFAULT_LOCALE]

	setLocale = (abbr, callback) => {
		if (abbr === this.state.abbr) return

		this.setState(
			{
				...localePackage[abbr],
			},
			callback
		)
	}

	render() {
		const localeProviderValue = {
			...this.state,
			supportedLocale,
			setLocale: this.setLocale,
		}

		return (
			<LocaleContext.Provider value={localeProviderValue}>
				{this.props.children}
			</LocaleContext.Provider>
		)
	}
}

export default Locale
