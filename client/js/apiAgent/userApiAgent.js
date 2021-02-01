import { userInfo, user as userPath } from '../dataSrc'
import { get, post, put, del } from '../helper/httpClient'

export default {
	async getAllUser() {
		return await get(userPath)
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
