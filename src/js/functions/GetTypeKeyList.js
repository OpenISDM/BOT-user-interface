

export default function GetResultData(searchableObjectList){
	var set = new Array()
	for(var item of searchableObjectList){
		if(!set.includes(item.type)){
			set.push(item.type)
		}
		
	}
	return set
}