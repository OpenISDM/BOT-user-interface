import React, {Fragment} from 'react';
import messageGenerator from '../../../helper/messageGenerator'
import { toast } from 'react-toastify';
import {
    systemSettingModule
} from '../../../config/pageModules'
import {
    isMobileOnly,
    isTablet,
    MobileOnlyView,
    BrowserView,
    TabletView
} from 'react-device-detect'
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';
import MobilePageComponent from '../../platform/mobile/mobilePageComponent'
import BrowserPageComponent from '../../platform/browser/BrowserPageComponent';
import TabletPageComponent from '../../platform/tablet/TabletPageComponent'
import locale from 'antd/lib/date-picker/locale/en_US';

class SystemSetting extends React.Component{

    containerModule = systemSettingModule

    componentDidMount = () => {

        /** set the scrollability in body disabled */
        if (isMobileOnly || isTablet) {
            let targetElement = document.querySelector('body')
            enableBodyScroll(targetElement);
        }
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }

    setMessage = (type, msg, isSetting) => {

        switch(type) {
            case 'success':
                this.toastId = messageGenerator.setSuccessMessage(msg)
                break;
            case 'error':
                if (isSetting && !this.toastId) {
                    this.toastId = messageGenerator.setErrorMessage(msg)
                } 
                break;
            case 'clear':
                this.toastId = null;
                toast.dismiss(this.toastId)
                break;
        }
    }

    render() {

        let {
            location
        } = this.props

        this.containerModule.defaultActiveKey = location.state ? location.state.key : this.containerModule.defaultActiveKey
        
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