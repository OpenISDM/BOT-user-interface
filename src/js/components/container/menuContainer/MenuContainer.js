import React, { Fragment } from 'react'
import { MenuContainerModule } from '../../../config/pageModules'
import {
    isMobileOnly,
    isTablet,
    MobileOnlyView,
    BrowserView,
    TabletView,
} from 'react-device-detect'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import MobilePageComponent from '../../platform/mobile/mobilePageComponent'
import BrowserPageComponent from '../../platform/browser/BrowserPageComponent'
import TabletPageComponent from '../../platform/tablet/TabletPageComponent'

class MenuContainer extends React.Component {
    containerModule = this.props.containerModule

    componentDidMount = () => {
        /** set the scrollability in body disabled */
        if (isMobileOnly || isTablet) {
            let targetElement = document.querySelector('body')
            enableBodyScroll(targetElement)
        }
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement)
    }

    render() {
        let { location } = this.props

        this.containerModule.defaultActiveKey = location.state
            ? location.state.key
            : this.containerModule.defaultActiveKey

        return (
            <Fragment>
                <BrowserView>
                    <BrowserPageComponent
                        containerModule={this.containerModule}
                    />
                </BrowserView>
                <TabletView>
                    <TabletPageComponent
                        containerModule={this.containerModule}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobilePageComponent
                        containerModule={this.containerModule}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default MenuContainer
