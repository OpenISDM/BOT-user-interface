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

import { userInfo, user as userPath } from '../dataSrc'
import { get, post, put, del } from '../helper/httpClient'

export default {
	async getAllUser({ locale }) {
		return await get(userPath, {
			locale,
		})
	},

	async deleteUser({ username }) {
		return await del(userPath, {
			username,
		})
	},

	async addUser({ user }) {
		return await post(userPath, {
			user,
		})
	},

	async setUserInfo({ user }) {
		return await put(userPath, {
			user,
		})
	},

	async addSearchHistory({ username, keyType, keyWord }) {
		return await put(userInfo.searchHistory, {
			username,
			keyType,
			keyWord,
		})
	},

	async editMaxSearchHistoryCount({ info, username }) {
		return await post(userInfo.maxSearchHistoryCount, {
			info,
			username,
		})
	},

	async setLocale({ userId, localeName }) {
		return await post(userInfo.locale, {
			userId,
			localeName,
		})
	},

	async editKeywordType({ userId, keywordTypeId }) {
		return await put(userInfo.keywordType, {
			userId,
			keywordTypeId,
		})
	},

	async setArea({ user }) {
		return await put(userInfo.area.secondary, {
			user,
		})
	},

	async password({ user_id, password }) {
		return await post(userInfo.password, {
			user_id,
			password,
		})
	},
}
