import Cookies from 'js-cookie'

import axios from 'axios';

import dataSrc from '../dataSrc';

import AxiosFunction from './AxiosFunction'

// e is the event parameter
// searchableObjectList is the found data list
// viaMethod is the components call this function, such as frequent search and searchableObjectType
export default function GetResultData(SearchKey, searchableObjectList, callBack){
	
	var searchResult = []
	if(typeof SearchKey === 'string'){
		if(SearchKey === 'my devices'){
			if(Cookies.get('user')){

				AxiosFunction.userInfo({username: Cookies.get('user')},
					(err, res) => {
						if(err){
							console.error(err)							
						}else{
							var myDevice = res.mydevice;
				            for(var i in searchableObjectList){

				            	if(myDevice.includes(searchableObjectList[i].access_control_number)){
				            		searchResult.push(searchableObjectList[i])
				            	}
				            }

				            callBack(searchResult)
						}
						
					}, {extract: ['mydevice'], default: []})
			}
	        
			
		}else{
			if(SearchKey === 'all devices'){

				for(var i in searchableObjectList){
					searchResult.push(searchableObjectList[i])
				}
				callBack(searchResult)
			}
			else{
				for(var i in searchableObjectList){
					if (searchableObjectList[i].type.toLowerCase() === SearchKey.toLowerCase()){
						searchResult.push(searchableObjectList[i])
					}
				}
				callBack(searchResult)
			}
		}
	}else if(typeof SearchKey === 'object'){
		if(SearchKey.dataType === 'location_description'){
			for(var i in searchableObjectList){
				if(searchableObjectList[i][SearchKey.dataType] === SearchKey.searchKey){
					searchResult.push(searchableObjectList[i])
				}
			}
			callBack(searchResult)
		}
	}
	AxiosFunction.getSearchHistory({username: Cookies.get('user')},
		(err, res) => {
			if(err){
				console.error(err)							
			}else{
				var searcHistory = res
				var historyList = res.map((historyitem) => {
					return historyitem.name.toLowerCase()
				})
				var index = historyList.indexOf(SearchKey.toLowerCase())
				console.log(index)
	            if(index !== -1){
	            	searcHistory[index].value = searcHistory[index].value + 1
	            }else{

	            	searcHistory.push({
	            		name: SearchKey,
	            		value: 1
	            	})
	            }
	            
	            AxiosFunction.addUserSearchHistory({
	            	username: Cookies.get('user') ,
	            	history: JSON.stringify(searcHistory)
	            }, () => {},)
			}
			
		}, {extract: ['mydevice'], default: []})
	


}