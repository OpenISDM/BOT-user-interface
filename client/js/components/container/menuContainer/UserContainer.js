import React, { Fragment } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { BrowserView, TabletView, MobileOnlyView } from 'react-device-detect'
import { userContainerModule } from '../../../config/pageModules'
import MobilePageComponent from '../../platform/mobile/MobilePageComponent'
import BrowserPageComponent from '../../platform/browser/BrowserPageComponent'
import TabletPageComponent from '../../platform/tablet/TabletPageComponent'

class UserSettingContainer extends React.Component {
	componentDidMount = () => {
		/** set the scrollability in body disabled */
		const targetElement = document.querySelector('body')
		enableBodyScroll(targetElement)
	}

	componentWillUnmount = () => {
		const targetElement = document.querySelector('body')
		disableBodyScroll(targetElement)
	}

	containerModule = userContainerModule

	render() {
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

export default UserSettingContainer
