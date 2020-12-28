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
		currentAreaId: this.context.stateReducer[0].area.id,
		searchObjectArray: [],
		pinColorArray: config.mapConfig.iconColor.pinColorArray.filter(
			(item, index) => index < config.MAX_SEARCH_OBJECT_NUM
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

		if (!isEqual(prevState.currentAreaId, stateReducer[0].area.id)) {
			this.setState({
				currentAreaId: stateReducer[0].area.id,
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
	// 	const [{ area }] = stateReducer
	// 	const configName = `${config.monitor[type].name}Config`
	// 	const triggerMonitorFunctionName = `get${configName.replace(
	// 		/^\w/,
	// 		(chr) => {
	// 			return chr.toUpperCase()
	// 		}
	// 	)}`
	// 	const cloneConfig = JSONClone(this.state[configName])
	// 	const enable = +!cloneConfig[area.id].enable
	// 	retrieveDataHelper.setMonitorEnable(
	// 	    enable,
	// 	    area.id,
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
		const [{ area }] = stateReducer

		try {
			const {
				data: trackingData,
			} = await apiHelper.trackingDataApiAgent.getTrackingData({
				locale: locale.abbr,
				user: auth.user,
				areaId: area.id,
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
		const [{ area }] = this.context.stateReducer
		const res = await apiHelper.utilsApiAgent.getSearchableKeywords({
			areaId: area.id,
		})
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
		const [{ area }] = stateReducer
		const res = await apiHelper.geofenceApis.getGeofenceConfig({
			areaId: area.id,
		})
		if (res) {
			this.setState(
				{
					geofenceConfig: res.data,
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
		const { stateReducer } = this.context
		const [{ area }] = stateReducer
		const { trackingData, pinColorArray, groupIds } = this.state
		let searchResult = []

		const hasSearchKey = true

		let { searchObjectArray } = this.state

		const proccessedTrackingData = JSONClone(trackingData).filter(
			(item) => parseInt(item.area_id) === parseInt(area.id)
		)

		const searchableField = config.SEARCHABLE_FIELD

		const activeActionButtons = []

		switch (searchKey.type) {
			case ALL_DEVICES:
				searchObjectArray = []
				searchResult = []
				proccessedTrackingData.forEach((item) => {
					if (parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE) {
						item.searchedType = config.SEARCHED_TYPE.ALL_DEVICES
						searchResult.push(item)
					}
				})
				break

			case ALL_PATIENTS:
				searchObjectArray = []
				searchResult = []
				proccessedTrackingData.forEach((item) => {
					if (
						parseInt(item.object_type) === config.OBJECT_TYPE.PERSON &&
						item.type === config.OBJECT_TABLE_SUB_TYPE.PATIENT
					) {
						item.searchedType = config.SEARCHED_TYPE.ALL_PATIENTS
						searchResult.push(item)
					}
				})
				break

			case MY_DEVICES:
				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					const isMyDevice =
						parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE &&
						groupIds &&
						groupIds.includes(parseInt(item.list_id))

					if (isMyDevice) {
						item.searched = true
						item.searchedType = config.SEARCHED_TYPE.MY_DEVICES
						searchResult.push(item)
					}
				})
				break

			case MY_PATIENTS:
				searchObjectArray = []
				proccessedTrackingData.forEach((item) => {
					const isMyPatient =
						parseInt(item.object_type) === config.OBJECT_TYPE.PERSON &&
						item.type === config.OBJECT_TABLE_SUB_TYPE.PATIENT &&
						groupIds &&
						groupIds.includes(parseInt(item.list_id))

					if (isMyPatient) {
						item.searched = true
						item.searchedType = config.SEARCHED_TYPE.MY_PATIENTS
						searchResult.push(item)
					}
				})
				break

			case OBJECT_TYPE:
			case SEARCH_HISTORY:
				if (!searchObjectArray.includes(searchKey.value)) {
					searchObjectArray.push(searchKey.value)
					if (searchObjectArray.length > config.MAX_SEARCH_OBJECT_NUM) {
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

									if (
										parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE
									) {
										item.searchedType = config.SEARCHED_TYPE.OBJECT_TYPE_DEVICE
									} else if (
										parseInt(item.object_type) === config.OBJECT_TYPE.PERSON
									) {
										item.searchedType = config.SEARCHED_TYPE.OBJECT_TYPE_PERSON
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
						item.searchedType = config.SEARCHED_TYPE.PIN_SELETION
						searchResult.push(item)
					}
				})

				break

			default:
				if (/^\s/.test(searchKey.value)) {
					return
				}
		}

		const showDeivceObject = searchResult.some(
			(item) => parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE
		)
		if (showDeivceObject) {
			activeActionButtons.push(config.ACTION_BUTTONS.DEVICE)
		}

		const showPersonObject = searchResult.some(
			(item) => parseInt(item.object_type) === config.OBJECT_TYPE.PERSON
		)
		if (showPersonObject) {
			activeActionButtons.push(config.ACTION_BUTTONS.PERSON)
		}

		this.setState({
			proccessedTrackingData,
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

	getGroupIdList = async () => {
		const { auth, stateReducer } = this.context
		const [{ area }] = stateReducer
		const userId = auth.user.id

		const {
			data: groupIds,
		} = await apiHelper.userAssignmentsApiAgent.getGroupIdListByUserId({
			areaId: area.id,
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
			highlightSearchPanel,
			showMobileMap,
			clearSearchResult,
			searchKey,
			searchResult,
			trackingData,
			proccessedTrackingData,
			showPath,
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
