export default function ArrayToDict(array, key) {
	var dict = {}
	array.map((item) => {
		dict[item[key]] = item
	})
	return dict
}