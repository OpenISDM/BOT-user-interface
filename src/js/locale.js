/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        locale.js

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


import generalTexts from '../locale/text';
import siteModuleTexts from '../../site_module/locale/text';
import incTexts from '../../inc/doc/locale/text';
import React from 'react';
import LocaleContext from './context/LocaleContext';
import config from './config';
import dataSrc from '../js/dataSrc';
import axios from 'axios';
import Cookies from 'js-cookie';
import supportedLocale from '../locale/supportedLocale';


const localePackage = Object.values(supportedLocale).reduce((localeMap, locale) => {
    localeMap[locale.abbr] = locale
    localeMap[locale.abbr].texts = {
       ...generalTexts[locale.abbr],
       ...siteModuleTexts[locale.abbr],
       ...incTexts[locale.abbr]
    }
    return localeMap
}, {})


class Locale extends React.Component {

    state = {
        ...localePackage['tw']
    }

    changeTexts = (lang) => {
        return localePackage[lang].texts;
    }

    changeAbbr = (lang) => {
        return localePackage[lang].abbr;
    }

    toggleLang = () => {
        const langArray = Object.keys(localePackage)
        const nextLang = langArray.filter(item => item !== this.state.lang).pop()
        return {
            nextLang,
            nextLangName: supportedLocale[nextLang].name
        }
    }

    setLocale = (lang) => {
        if (lang == this.state.lang) return 

        Cookies.set('user', {
            ...JSON.parse(Cookies.get('user')),
            locale: lang
        })

        this.setState({
            ...localePackage[lang]
        })
    }

    changeLocale = (e, auth) => {
        const nextLang = this.toggleLang().nextLang

        axios.post(dataSrc.userInfo.locale, {
            userID: auth.user.id,
            lang: nextLang
        })
        .then(resSet => {
            Cookies.set('user', {
                ...JSON.parse(Cookies.get('user')),
                locale: nextLang
            })
        })
        .catch(err => {
            console.log(`set locale fail ${err}`)
        })

        this.setState({
            lang: nextLang,
            texts: this.changeTexts(nextLang),
            abbr: this.changeAbbr(nextLang),            
        })
    }
    

    reSetState = (lang) => {
        this.setState({
            lang,
            texts: this.changeTexts(lang),
            abbr: this.changeAbbr(lang),            
        })
    }

    render() {

        const localeProviderValue = {
            ...this.state,
            // changeLocale: this.changeLocale,
            // toggleLang: this.toggleLang,
            // reSetState : this.reSetState,
            // localeCollection: Object.values(localeCollection),
            supportedLocale: Object.values(supportedLocale),
            setLocale: this.setLocale
        };

       
        return (
            <LocaleContext.Provider value={localeProviderValue}>
                {this.props.children}
            </LocaleContext.Provider>
        )
    }

}

export default Locale;


