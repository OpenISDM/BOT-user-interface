/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MainContainer.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/
import React, { Fragment } from 'react'
import 'react-table/react-table.css'
import config from '../../../config'
import { AppContext } from '../../../context/AppContext'
import { toast } from 'react-toastify'
import ToastNotification from '../../presentational/ToastNotification'
import { BrowserView, MobileOnlyView, TabletView } from 'react-device-detect'
import { disableBodyScroll } from 'body-scroll-lock'
import messageGenerator from '../../../helper/messageGenerator'
import TabletMainContainer from '../../platform/tablet/TabletMainContainer'
import MobileMainContainer from '../../platform/mobile/MobileMainContainer'
import BrowserMainContainer from '../../platform/browser/BrowserMainContainer'
import apiHelper from '../../../helper/apiHelper'
import { createLbeaconCoordinate } from '../../../helper/dataTransfer'
import { isEqual, JSONClone } from '../../../helper/utilities'
import {
	SWITCH_SEARCH_LIST,
	CLEAR_SEARCH_RESULT,
	ALL_DEVICES,
	MY_DEVICES,
	ALL_PATIENTS,
	MY_PATIENTS,
	OBJECT_TYPE,
	NOT_STAY_ROOM_MONITOR,
	SEARCH_HISTORY,
	PIN_SELETION,
} from '../../../config/wordMap'

const { MAX_SEARCH_OBJECT_NUM, ACTION_BUTTONS } = config

class MainContainer extends React.Component {
	static contextType = AppContext

	state = {
		trackingData: [],
		proccessedTrackingData: [],
		lbeaconPosition: [],
		geofenceConfig: null,
		locationMonitorConfig: null,
		violatedObjects: {},
		hasSearchKey: false,
		searchKey: {
			type: null,
			value: null,
		},
		showFoundResult: true,
		searchResult: [],
		clearSearchResult: false,
		isHighlightSearchPanel: false,
		shouldUpdateTrackingData: true,
		showPath: false,
		pathMacAddress: '',
		display: true,
		showMobileMap: true,
		searchedObjectType: [],
		showedObjects: [],
		currentAreaId: this.context.stateReducer[0].areaId,
		searchObjectArray: [],
		pinColorArray: config.mapConfig.iconColor.pinColorArray.filter(
			(item, index) => index < MAX_SEARCH_OBJECT_NUM
		),
		groupIds: [],
		activeActionButtons: [],
	}

	errorToast = null

	componentDidMount = () => {
		/** set the scrollability in body disabled */
		disableBodyScroll(document.querySelector('body'))
		this.getTrackingData()
		this.getKeywords()
		this.getLbeaconPosition()
		this.getGeofenceConfig()
		this.getLocationMonitorConfig()
		this.getGroupIdList()
		this.interval = setInterval(
			this.getTrackingData,
			config.mapConfig.intervalTime
		)
	}

	componentDidUpdate = (prevProps, prevState) => {
		const isTrackingDataChange = !isEqual(
			this.state.trackingData,
			prevState.trackingData
		)

		const { stateReducer } = this.context

		/** stop getTrackingData when editing object status  */
		if (
			stateReducer[0].shouldUpdateTrackingData !==
			this.state.shouldUpdateTrackingData
		) {
			const [{ shouldUpdateTrackingData }] = stateReducer
			this.interval = shouldUpdateTrackingData
				? setInterval(this.getTrackingData, config.mapConfig.intervalTime)
				: clearInterval(this.interval)
			this.setState({
				shouldUpdateTrackingData,
			})
		}

		if (!isEqual(prevState.currentAreaId, stateReducer[0].areaId)) {
			this.setState({
				currentAreaId: stateReducer[0].areaId,
			})
		}

		/** refresh search result if the search results are change */
		if (isTrackingDataChange && this.state.hasSearchKey) {
			this.handleRefreshSearchResult()
		}

		/** send toast if there are latest violated notification */
		const newViolatedObject = Object.keys(this.state.violatedObjects).filter(
			(item) => !Object.keys(prevState.violatedObjects).includes(item)
		)
		if (newViolatedObject.length !== 0) {
			newViolatedObject.forEach((item) => {
				this.getToastNotification(this.state.violatedObjects[item])
			})
		}
	}

	getToastNotification = (item) => {
		item.notification.forEach((event) => {
			const toastId = `${item.mac_address}-${event.type}`
			const toastOptions = {
				hideProgressBar: true,
				autoClose: false,
				onClose: this.onCloseToast,
				toastId,
			}
			this.getToastType(event.type, item, toastOptions, event.time)
		})
	}

	getToastType = (type, data, option, time) => {
		return toast[config.toastMonitorMap[type]](
			<ToastNotification data={data} time={time} type={type} />,
			option
		)
	}

	onCloseToast = (toast) => {
		const mac_address = toast.data ? toast.data.mac_address : toast.mac_address
		const monitor_type = toast.type
		const toastId = `${mac_address}-${monitor_type}`
		const violatedObjects = this.state.violatedObjects
		delete violatedObjects[toastId]

		// axios
		// 	.post(dataSrc.checkoutViolation, {
		// 		mac_address,
		// 		monitor_type,
		// 	})
		// 	.then(() => {
		// 		this.setState({
		// 			violatedObjects,
		// 		})
		// 	})
		// 	.catch((err) => {
		// 		console.log(`checkout violation fail: ${err}`)
		// 	})
	}

	/** Clear the recorded violated object */
	clearAlerts = () => {
		Object.values(this.state.violatedObjects).forEach((item) => {
			item.notification.forEach((event) => {
				const dismissedObj = {
					mac_address: item.mac_address,
					type: event.type,
				}

				this.onCloseToast(dismissedObj)
			})
		})
		toast.dismiss()
	}

	componentWillUnmount = () => {
		clearInterval(this.interval)
	}

	/** get the latest search results */
	handleRefreshSearchResult = () => {
		const { searchKey } = this.state

		if (searchKey.type != null) {
			this.getSearchKey(searchKey)
		}
	}

	/** set the geofence and location monitor enable */
	setMonitor = () => {
		// comment
	}
	// setMonitor = (type, callback) => {
	// 	const { stateReducer } = this.context
	// 	const [{ areaId }] = stateReducer
	// 	const configName = `${config.monitor[type].name}Config`
	// 	const triggerMonitorFunctionName = `get${configName.replace(
	// 		/^\w/,
	// 		(chr) => {
	// 			return chr.toUpperCase()
	// 		}
	// 	)}`
	// 	const cloneConfig = JSONClone(this.state[configName])
	// 	const enable = +!cloneConfig[areaId].enable
	// 	retrieveDataHelper.setMonitorEnable(
	// 	    enable,
	// 	    areaId,
	// 	    config.monitor[type].api
	// 	)
	// 	.then(res => {
	// 	    console.log(`set ${type} enable succeed`)
	// 	    setTimeout(() => this[triggerMonitorFunctionName](callback), 1000)
	// 	})
	// 	.catch(err => {
	// 	    console.log(`set ${type} enable failed ${err}`)
	// 	})
	// }

	/** Get tracking data from database.
	 *  Once get the tracking data, violated objects would be collected. */
	getTrackingData = async () => {
		const { auth, locale, stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const {
				data: trackingData,
			} = await apiHelper.trackingDataApiAgent.getTrackingData({
				locale: locale.abbr,
				user: auth.user,
				areaId,
			})

			this.setState({
				trackingData,
			})
			/** dismiss error message when the database is connected */
			if (this.errorToast) {
				this.errorToast = null
				toast.dismiss(this.errorToast)
			}
		} catch (e) {
			console.log(`get tracking data failed ${e}`)

			/** sent error message when database is not connected */
			if (!this.errorToast) {
				this.errorToast = messageGenerator.setErrorMessage()
			}
		}
	}

	getKeywords = async () => {
		const res = await apiHelper.utilsApiAgent.getSearchableKeywords()
		if (res) {
			this.setState({
				keywords: res.data.rows[0].keys,
			})
		}
	}

	/** Retrieve lbeacon data from database */
	getLbeaconPosition = async () => {
		const { locale } = this.context

		const res = await apiHelper.lbeaconApiAgent.getLbeaconTable({
			locale: locale.abbr,
		})
		if (res) {
			const lbeaconPosition = res.data.rows.map((item) => {
				item.coordinate = createLbeaconCoordinate(item.uuid).toString()
				return item
			})
			this.setState({
				lbeaconPosition,
			})
		}
	}

	/** Retrieve geofence data from database */
	getGeofenceConfig = async (callback) => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		const res = await apiHelper.geofenceApis.getGeofenceConfig(areaId)
		if (res) {
			const geofenceConfig = res.data.rows.reduce((config, rule) => {
				if (!config[rule.area_id]) {
					config[rule.area_id] = {
						enable: rule.enable,
						rules: [rule],
					}
				} else config[rule.area_id].rules.push(rule)
				return config
			}, {})
			this.setState(
				{
					geofenceConfig,
				},
				callback
			)
		}
	}

	/** Retrieve location monitor data from database */
	getLocationMonitorConfig = async (callback) => {
		const { auth } = this.context

		const res = await apiHelper.monitor.getMonitorConfig(
			NOT_STAY_ROOM_MONITOR,
			auth.user.areas_id,
			true
		)
		if (res) {
			const locationMonitorConfig = res.data.reduce((config, rule) => {
				config[rule.area_id] = {
					enable: rule.enable,
					rule: {
						...rule,
						lbeacons:
							rule.lbeacons &&
							rule.lbeacons.map((uuid) => {
								return createLbeaconCoordinate(uuid).toString()
							}),
					},
				}
				return config
			}, {})
			this.setState(
				{
					locationMonitorConfig,
				},
				callback
			)
		}
	}

	/** Fired once the user click the item in object type list or in frequent seaerch */
	getSearchKey = (searchKey) => {
		this.getResultBySearchKey(searchKey)
	}

	/** Process the search result by the search key.
	 *  The search key would be:
	 *  1. all devices
	 *  2. my devices
	 *  3. all patients
	 *  4. my patients
	 *  5. specific object term,
	 *  6. coordinate(disable now)
	 *  7. multiple selected object(gridbutton)(disable now)
	 */
	getResultBySearchKey = async (searchKey) => {
		const {
			searchedObjectType,
			showedObjects,
			trackingData,
			pinColorArray,
			groupIds,
		} = this.state
		let searchResult = []

		const hasSearchKey = true

		let { searchObjectArray } = this.state

		const proccessedTrackingData = JSONClone(trackingData)

		const searchableField = config.SEARCHABLE_FIELD

		const activeActionButtons = []

		switch (searchKey.type) {
			case ALL_DEVICES:
				activeActionButtons.push(ACTION_BUTTONS.DEVICE)
				searchObjectArray = []
				searchResult = []
				proccessedTrackingData.forEach((item) => {
					if (parseInt(item.object_type) === 0) {
						item.searchedType = 0
						searchResult.push(item)
					}
				})

				if (!searchedObjectType.includes(0)) {
					searchedObjectType.push(0)
					showedObjects.push(0)
				}
				break

			case ALL_PATIENTS:
				activeActionButtons.push(ACTION_BUTTONS.PATIENT)
				searchObjectArray = []
				searchResult = []
				proccessedTrackingData.forEach((item) => {
					if (parseInt(item.object_type) !== 0) {
						item.searchedType = 1
						searchResult.push(item)
					}
				})

				if (
					!searchedObjectType.includes(1) ||
					!searchedObjectType.includes(2)
				) {
					searchedObjectType.push(1)
					searchedObjectType.push(2)
					showedObjects.push(1)
					showedObjects.push(2)
				}
				break

			case MY_DEVICES:
				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					const isMyDevice =
						parseInt(item.object_type) === 0 &&
						groupIds &&
						groupIds.includes(parseInt(item.list_id))

					if (isMyDevice) {
						item.searched = true
						item.searchedType = -1
						searchResult.push(item)
					}
				})

				if (!searchedObjectType.includes(-1)) {
					searchedObjectType.push(-1)
					showedObjects.push(-1)
				}
				break

			case MY_PATIENTS:
				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					const isMyPatient =
						parseInt(item.object_type) !== 0 &&
						groupIds &&
						groupIds.includes(parseInt(item.list_id))

					if (isMyPatient) {
						item.searched = true
						item.searchedType = -2
						searchResult.push(item)
					}
				})

				if (!searchedObjectType.includes(-2)) {
					searchedObjectType.push(-2)
					showedObjects.push(-2)
				}
				break

			case OBJECT_TYPE:
			case SEARCH_HISTORY:
				searchedObjectType.length = 0
				showedObjects.length = 0
				if (!searchObjectArray.includes(searchKey.value)) {
					searchObjectArray.push(searchKey.value)
					if (searchObjectArray.length > MAX_SEARCH_OBJECT_NUM) {
						searchObjectArray.shift()
						pinColorArray.push(pinColorArray.shift())
					}
				}

				for (let index = searchObjectArray.length - 1; index >= 0; index--) {
					const singleSearchObjectArray = []

					singleSearchObjectArray.push(searchObjectArray[index])

					const moreSearchResult = proccessedTrackingData.filter((item) => {
						return singleSearchObjectArray.some((key) => {
							return searchableField.some((field) => {
								if (item[field] && item[field] === key) {
									item.keyword = key

									item.searched = true
									if (parseInt(item.object_type) === 0) {
										item.searchedType = -1
										if (!searchedObjectType.includes(-1)) {
											searchedObjectType.push(-1)
											showedObjects.push(-1)
										}
									} else if (parseInt(item.object_type) !== 0) {
										item.searchedType = -2
										if (!searchedObjectType.includes(-2)) {
											searchedObjectType.push(-2)
											showedObjects.push(-2)
										}
									}
									return true
								}
								return false
							})
						})
					})

					searchResult = searchResult.concat(moreSearchResult)
				}
				break

			case PIN_SELETION:
				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					if (searchKey.value.includes(item.mac_address)) {
						item.searched = true
						item.searchedType = -1
						searchResult.push(item)
					}
				})

				if (!searchedObjectType.includes(-1)) {
					searchedObjectType.push(-1)
					showedObjects.push(-1)
				}
				break

			default:
				if (/^\s/.test(searchKey.value)) {
					return
				}
				if (searchKey.value === '') {
					return
				}

				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					searchableField.forEach((field) => {
						if (
							item[field] &&
							item[field]
								.toLowerCase()
								.indexOf(searchKey.value.toLowerCase()) >= 0
						) {
							item.searched = true
							item.searchedType = -1
							searchResult.push(item)
						}
					})
				})

				if (!searchedObjectType.includes(-1)) {
					searchedObjectType.push(-1)
					showedObjects.push(-1)
				}
		}

		this.setState({
			proccessedTrackingData,
			searchedObjectType,
			showedObjects,
			searchResult,
			hasSearchKey,
			searchKey,
			searchObjectArray,
			pinColorArray,
			activeActionButtons,
		})
	}

	highlightSearchPanel = (boolean) => {
		this.setState({
			isHighlightSearchPanel: boolean,
		})
	}

	handleShowResultListForMobile = () => {
		this.setState({
			display: false,
		})
	}

	mapButtonHandler = () => {
		this.setState({
			showMobileMap: !this.state.showMobileMap,
		})
	}

	setShowedObjects = (value) => {
		const showedObjects = value.split(',').reduce((showedObjects, number) => {
			number = parseInt(number)
			if (!this.state.searchedObjectType.includes(number)) {
				return showedObjects
			} else if (this.state.showedObjects.includes(number)) {
				const index = showedObjects.indexOf(number)
				showedObjects = [
					...showedObjects.slice(0, index),
					...showedObjects.slice(index + 1),
				]
			} else {
				showedObjects.push(number)
			}
			return showedObjects
		}, Array.from(this.state.showedObjects))
		this.setState({
			showedObjects,
		})
	}

	getGroupIdList = async () => {
		const { auth, stateReducer } = this.context
		const [{ areaId }] = stateReducer
		const userId = auth.user.id

		const {
			data: groupIds,
		} = await apiHelper.userAssignmentsApiAgent.getGroupIdListByUserId({
			areaId,
			userId,
		})

		this.setState({
			groupIds,
		})
	}

	handleSearchTypeClick = (searchKey) => {
		if ([MY_PATIENTS, MY_DEVICES].includes(searchKey.type)) {
			this.getGroupIdList()
		}
	}

	handleClick = (e) => {
		const name = e.target.name || e.target.getAttribute('name')
		const value = e.target.getAttribute('value')

		switch (name) {
			case SWITCH_SEARCH_LIST:
				this.setState({
					showFoundResult: JSON.parse(value),
				})
				break

			case CLEAR_SEARCH_RESULT:
				this.setState({
					hasSearchKey: false,
					searchKey: {
						type: null,
						value: null,
					},
					searchResult: [],
					colorPanel: null,
					clearSearchResult: !!this.state.hasSearchKey,
					proccessedTrackingData: [],
					display: true,
					searchedObjectType: [],
					showedObjects: [],
					searchObjectArray: [],
					showMobileMap: true,
					activeActionButtons: [],
				})
				break
		}
	}

	render() {
		const {
			hasSearchKey,
			trackingData,
			proccessedTrackingData,
			searchResult,
			searchKey,
			lbeaconPosition,
			geofenceConfig,
			searchedObjectType,
			showedObjects,
			showMobileMap,
			clearSearchResult,
			showPath,
			display,
			pathMacAddress,
			isHighlightSearchPanel,
			locationMonitorConfig,
			currentAreaId,
			searchObjectArray,
			pinColorArray,
			showFoundResult,
			keywords,
			activeActionButtons,
		} = this.state

		const {
			getSearchKey,
			setMonitor,
			clearAlerts,
			setShowedObjects,
			handleShowResultListForMobile,
			mapButtonHandler,
			highlightSearchPanel,
			handleClick,
			handleSearchTypeClick,
		} = this

		const propsGroup = {
			hasSearchKey,
			getSearchKey,
			setMonitor,
			clearAlerts,
			lbeaconPosition,
			geofenceConfig,
			searchedObjectType,
			showedObjects,
			highlightSearchPanel,
			showMobileMap,
			clearSearchResult,
			searchKey,
			searchResult,
			trackingData,
			proccessedTrackingData,
			showPath,
			setShowedObjects,
			handleShowResultListForMobile,
			display,
			pathMacAddress,
			mapButtonHandler,
			isHighlightSearchPanel,
			locationMonitorConfig,
			currentAreaId,
			searchObjectArray,
			pinColorArray,
			handleClick,
			showFoundResult,
			keywords,
			activeActionButtons,
			handleSearchTypeClick,
		}

		return (
			/** "page-wrap" the default id named by react-burget-menu */
			<Fragment>
				<BrowserView>
					<BrowserMainContainer {...propsGroup} />
				</BrowserView>
				<TabletView>
					<TabletMainContainer {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileMainContainer {...propsGroup} />
				</MobileOnlyView>
			</Fragment>
		)
	}
}

export default MainContainer
