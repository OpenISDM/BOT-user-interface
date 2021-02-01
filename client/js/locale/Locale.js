import generalTexts from './text'
import React from 'react'
import LocaleContext from '../context/LocaleContext'
import config from '../config'
import Cookies from 'js-cookie'
import supportedLocale from './supportedLocale'
import PropTypes from 'prop-types'

const localePackage = Object.values(supportedLocale).reduce(
	(localeMap, locale) => {
		localeMap[locale.abbr] = locale
		localeMap[locale.abbr].texts = {
			...generalTexts[locale.abbr],
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

Locale.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Locale
