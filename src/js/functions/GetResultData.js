import Cookies from 'js-cookie'

import axios from 'axios';

import dataSrc from '../dataSrc';

// e is the event parameter
// searchableObjectList is the found data list
// viaMethod is the components call this function, such as frequent search and searchableObjectType
export default async function GetResultData(SearchKey, searchableObjectList){
	var searchResult = []
	if(SearchKey === 'my devices'){
        await axios.post(dataSrc.userInfo, {
            username: Cookies.get('user')
        }).then( res => {
            var mydevice = new Set(res.data.rows[0].mydevice);
            for(var i in searchableObjectList){

            	if(mydevice.has(searchableObjectList[i].access_control_number)){
            		searchResult.push(searchableObjectList[i])
            	}

            }
            
        }).catch(error => {
            console.log(error)
        })
		
	}else{
		if(SearchKey === 'all devices'){
			for(var i in searchableObjectList){
				searchResult.push(searchableObjectList[i])
			}
		}
		else{
			for(var i in searchableObjectList){

				if (searchableObjectList[i].type.toLowerCase() === SearchKey.toLowerCase()){
					searchResult.push(searchableObjectList[i])
				}
			}
		}
	}

	return await searchResult
}