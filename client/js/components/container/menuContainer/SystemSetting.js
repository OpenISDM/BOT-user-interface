import React, { Fragment } from 'react'
import messageGenerator from '../../../helper/messageGenerator'
import { toast } from 'react-toastify'
import { settingModule } from '../../../config/pageModules'
import {
	isMobileOnly,
	isTablet,
	MobileOnlyView,
	BrowserView,
	TabletView,
} from 'react-device-detect'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import MobilePageComponent from '../../platform/mobile/MobilePageComponent'
import BrowserPageComponent from '../../platform/browser/BrowserPageComponent'
import TabletPageComponent from '../../platform/tablet/TabletPageComponent'

class SystemSetting extends React.Component {
	containerModule = settingModule

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

	setMessage = (type, msg, isSetting) => {
		switch (type) {
			case 'success':
				this.toastId = messageGenerator.setSuccessMessage(msg)
				break
			case 'error':
				if (isSetting && !this.toastId) {
					this.toastId = messageGenerator.setErrorMessage(msg)
				}
				break
			case 'clear':
				this.toastId = null
				toast.dismiss(this.toastId)
				break
		}
	}

	render() {
		const { location } = this.props

		this.containerModule.defaultActiveKey = location.state
			? location.state.key
			: this.containerModule.defaultActiveKey

		return (
			<Fragment>
				<BrowserView>
					<BrowserPageComponent
						containerModule={this.containerModule}
						setMessage={this.setMessage}
					/>
				</BrowserView>
				<TabletView>
					<TabletPageComponent
						containerModule={this.containerModule}
						setMessage={this.setMessage}
					/>
				</TabletView>
				<MobileOnlyView>
					<MobilePageComponent
						containerModule={this.containerModule}
						setMessage={this.setMessage}
					/>
				</MobileOnlyView>
			</Fragment>
		)
	}
}

export default SystemSetting
