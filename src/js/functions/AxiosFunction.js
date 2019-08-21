import dataSrc from '../dataSrc'
import axios from 'axios'
const AxiosFunction = {
	// this function is connected to generatePDF at backend
	// Input => searchInfo: {
	// 	username: string,
	// 	foundResult: Array[item],
	// 	notFoundResult: Array[item]
	// }
	sendSearchResultToBackend: (searchResultInfo, callBack) => {
		axios.post(dataSrc.QRCode,searchResultInfo).then(res => {
			callBack(res.data)
        })
	},
	// input => {
    //     newStatus: newStatus.status,
    //     newLocation: newStatus.transferred_location,
    //     notes: newStatus.notes,
    //     macAddresses: macAddresses
    // }
	editObjectPackage: (Info, callBack) => {
		axios.post(dataSrc.editObjectPackage, Info).then(res => {
			callBack(null, 'success')
        }).catch( error => {
        	callBack(error, null)
        })
	},
	// input => null
	getShiftChangeRecord: (Info, callBack) => {
		axios.post(dataSrc.PDFInfo,{}).then((res) => {
            callBack(null, res.data)
        }).catch(err => {
        	callBack(err, null)
        })
	},
	modifyUserDevice: (Info, callBack) => {
		axios.post(dataSrc.modifyUserDevice, Info).then((res) => {
            callBack(null, res.data)
        }).catch(err => {
        	callBack(err, null)
        })
	},
	// Info:{
	// 	username
	// }
	// output: Object
	userInfo: (Info, callBack, option) => {
		axios.post(dataSrc.userInfo, Info).then((res) => {
			var data = res.data[0];

			if(option){
				if(option.filter){
					for(var i of option.filter){
						delete data[i]
					}
				}
				if(option.extract){
					var buff = {}
					for(var i of option.extract){
						buff[i] = data[i]
					}
					data = buff
				}
				if(option.default){
					data = data || option.default
				}
			}

            callBack(null, data)
        }).catch(err => {
        	callBack(err, null)
        })
		
		
	},
	getSearchHistory: (Info, callBack, option) => {
		axios.post(dataSrc.userSearchHistory, Info).then((res) => {
			var data = res.data[0];
			if(option){
				if(option.default){
					data = data || option.default
				}
			}
            callBack(null, data)
        }).catch(err => {
        	callBack(err, null)
        })
	}
}
export default AxiosFunction