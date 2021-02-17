import React, { Fragment } from 'react'
import { BOTAdminModule } from '../config/pageModules'
import {
	isMobileOnly,
	isTablet,
	MobileOnlyView,
	BrowserView,
	TabletView,
} from 'react-device-detect'
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import MobilePageComponent from './platform/mobile/MobilePageComponent'
import BrowserPageComponent from './platform/browser/BrowserPageComponent'
import TabletPageComponent from './platform/tablet/TabletPageComponent'
import PropTypes from 'prop-types'
class BOTAdminContainer extends React.Component {
	containerModule = BOTAdminModule

	componentDidMount = () => {
		/** set the scrollability in body disabled */
		if (isMobileOnly || isTablet) {
			// const targetElement = document.querySelector('body')
			// enableBodyScroll(targetElement)
		}
	}

	componentWillUnmount = () => {
		// const targetElement = document.querySelector('body')
		// disableBodyScroll(targetElement)
	}

	render() {
		const { location } = this.props

		this.containerModule.defaultActiveKey = location.state
			? location.state.key
			: this.containerModule.defaultActiveKey

		return (
			<Fragment>
				<BrowserView>
					<BrowserPageComponent containerModule={this.containerModule} />
				</BrowserView>
				<TabletView>
					<TabletPageComponent containerModule={this.containerModule} />
				</TabletView>
				<MobileOnlyView>
					<MobilePageComponent containerModule={this.containerModule} />
				</MobileOnlyView>
			</Fragment>
		)
	}
}

BOTAdminContainer.propTypes = {
	location: PropTypes.object,
}

export default BOTAdminContainer
