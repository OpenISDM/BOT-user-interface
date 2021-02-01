import React, { Fragment } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import {
	BrowserView,
	TabletView,
	MobileOnlyView,
	CustomView,
	isMobile,
	isTablet,
} from 'react-device-detect'
import BrowserContactTree from '../../platform/browser/BrowserContactTree'

class ContactTree extends React.Component {
	componentDidMount = () => {
		/** set the scrollability in body disabled */
		// const targetElement = document.querySelector('body')
		// enableBodyScroll(targetElement)
	}

	componentWillUnmount = () => {
		// const targetElement = document.querySelector('body')
		// disableBodyScroll(targetElement)
	}

	render() {
		return (
			<Fragment>
				<CustomView condition={isTablet != true && isMobile != true}>
					<BrowserContactTree location={this.props.location} />
				</CustomView>
			</Fragment>
		)
	}
}

export default ContactTree
