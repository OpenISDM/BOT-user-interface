import { get, post } from './utils/request'

const userAssignments = {
	getByUserId: '/data/userAssignments/getByUserId',
	getGroupIdListByUserId: '/data/userAssignments/getGroupIdListByUserId',
	accept: '/data/userAssignments/accept',
	finish: '/data/userAssignments/finish',
	cancel: '/data/userAssignments/cancel',
}

async function getByUserId({ areaId, userId }) {
	return await get(userAssignments.getByUserId, {
		areaId,
		userId,
	})
}

async function getGroupIdListByUserId({ areaId, userId }) {
	return await get(userAssignments.getGroupIdListByUserId, {
		areaId,
		userId,
	})
}

async function accept({ userId, groupListIds, assignmentType }) {
	return await post(userAssignments.accept, {
		userId,
		groupListIds,
		assignmentType,
	})
}

async function cancel({ userId, groupListIds }) {
	return await post(userAssignments.cancel, {
		userId,
		groupListIds,
	})
}

async function finish({ userId, groupListIds }) {
	return await post(userAssignments.finish, {
		userId,
		groupListIds,
	})
}

export default {
	getByUserId,
	getGroupIdListByUserId,
	accept,
	cancel,
	finish,
}
