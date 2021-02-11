import axios from 'axios'

export const baseURL = `https://${window.location.hostname}`

export async function get(url, object) {
	return await request({ method: 'GET', url, object: { params: object } })
}

export async function del(url, object) {
	return await request({ method: 'DELETE', url, object: { data: object } })
}

export async function post(url, object) {
	return await request({ method: 'POST', url, object: { data: object } })
}

export async function put(url, object) {
	return await request({ method: 'PUT', url, object: { data: object } })
}

export async function patch(url, object) {
	return await request({ method: 'PATCH', url, object: { data: object } })
}

async function request({ method, url, object }) {
	try {
		return await axios({
			baseURL,
			method,
			url,
			...object,
		})
	} catch (e) {
		console.log(e)
	}
}
