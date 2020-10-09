/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userApiAgent.js

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

import dataSrc from '../dataSrc'
import axios from 'axios'

export default {
    async getAllUser ({ locale }) {
        return await axios.get(dataSrc.user, {
            params: {
                locale,
            },
        })
    },

    async addSearchHistory ({ username, keyType, keyWord }) {
        return await axios.put(dataSrc.userInfo.searchHistory, {
            username,
            keyType,
            keyWord,
        })
    },

    async editMyDevice ({ username, mode, acn }) {
        return await axios.put(dataSrc.userInfo.mydevice, {
            username,
            mode,
            acn,
        })
    },

    async editMaxSearchHistoryCount ({ info, username }) {
        return await axios.post(dataSrc.userInfo.maxSearchHistoryCount, {
            info,
            username,
        })
    },

    async setLocale ({ userId, localeName }) {
        return await axios.post(dataSrc.userInfo.locale, {
            userId,
            localeName,
        })
    },

    async editKeywordType ({ userId, keywordTypeId }) {
        return await axios.put(dataSrc.userInfo.keywordType, {
            userId,
            keywordTypeId,
        })
    },

    async editListId ({ userId, listId }) {
        return await axios.put(dataSrc.userInfo.listId, {
            userId,
            listId,
        })
    },
}
