

export default function GetResultData(searchableObjectList){
	var set = new Set()
	for(var i in searchableObjectList){
		set.add(searchableObjectList[i].type.toLowerCase())
	}
	var list = {}
	for(var i of set){
		let first = i[0]
		if (list[first] === undefined){
			list[first] = []
		}
		
		list[first].push(i)
				
	}
	return list
}