import axios from 'axios'

export async function get(url, object) {
	try {
		return await axios.get(url, { params: object })
	} catch (e) {
		console.log(e)
	}
}

export async function post(url, object) {
	try {
		return await axios.post(url, object)
	} catch (e) {
		console.log(e)
	}
}

export async function put(url, object) {
	try {
		return await axios.put(url, object)
	} catch (e) {
		console.log(e)
	}
}

export async function del(url, object) {
	try {
		return await axios.delete(url, { data: object })
	} catch (e) {
		console.log(e)
	}
}

export async function patch(url, object) {
	try {
		return await axios.patch(url, object)
	} catch (e) {
		console.log(e)
	}
}
