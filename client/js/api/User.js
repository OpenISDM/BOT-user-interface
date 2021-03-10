import { get, post, put, del } from './utils/request'

const userPath = '/data/user'
const userInfo = {
	area: '/data/user/area',
	password: '/data/user/password',
	locale: '/data/user/locale',
	searchHistory: '/data/user/searchHistory',
	maxSearchHistoryCount: '/data/user/maxSearchHistoryCount',
	keywordType: '/data/user/keywordType',
}

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

	async setLastLoginArea({ areaId, userId }) {
		return await post(userInfo.area, {
			areaId,
			userId,
		})
	},

	async password({ user_id, password }) {
		return await post(userInfo.password, {
			user_id,
			password,
		})
	},
}
