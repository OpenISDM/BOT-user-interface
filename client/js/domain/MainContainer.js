import React, { Fragment } from 'react'
import { BrowserView, MobileOnlyView, TabletView } from 'react-device-detect'
import { keyBy } from 'lodash'
import config from '../config'
import { AppContext } from '../context/AppContext'
import TabletMainContainer from './platform/tablet/TabletMainContainer'
import MobileMainContainer from './platform/mobile/MobileMainContainer'
import BrowserMainContainer from './platform/browser/BrowserMainContainer'
import API from '../api'
import { createLbeaconCoordinate, countNumber } from '../helper/dataTransfer'
import { isEqual, deepClone, isSameValue } from '../helper/utilities'
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
	SEARCH_BAR,
	PIN_SELETION,
	NAMED_LIST,
} from '../config/wordMap'
import { SET_OPENED_NOTIFICATION } from '../reducer/action'
import { number } from 'prop-types'

class MainContainer extends React.Component {
	static contextType = AppContext

	state = {
		trackingData: [],
		trackingDataMap: {},
		proccessedTrackingData: [],
		lbeaconPosition: [],
		locationMonitorConfig: null,
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
		pathObjectAcns: '',
		searchObjectArray: [],
		pinColorArray: config.mapConfig.iconColor.pinColorArray,
		groupIds: [],
		activeActionButtons: [],
	}

	componentDidMount = () => {
		this.getTrackingData()
		this.getKeywords()
		this.getLbeaconPosition()
		this.getLocationMonitorConfig()
		this.getGroupIdList()
		this.interval = setInterval(
			this.getTrackingData,
			config.trackingIntervalTime
		)
	}

	componentDidUpdate = (prevProps, prevState) => {
		const [{ shouldUpdateTrackingData }] = this.context.stateReducer
		const { trackingData } = this.state

		/** stop getTrackingData when editing object status  */
		if (shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData) {
			this.interval = shouldUpdateTrackingData
				? setInterval(this.getTrackingData, config.trackingIntervalTime)
				: clearInterval(this.interval)
			this.setState({
				shouldUpdateTrackingData,
			})
		}

		/** refresh search result if the search results are change */
		const isTrackingDataChange = !isEqual(trackingData, prevState.trackingData)
		if (isTrackingDataChange) {
			const { searchKey } = this.state
			this.getSearchKey(searchKey)
		}
	}

	componentWillUnmount = () => {
		clearInterval(this.interval)
	}

	/** Get tracking data from database.
	 *  Once get the tracking data, violated objects would be collected. */
	getTrackingData = async () => {
		const { locale, stateReducer } = this.context
		const [{ area }] = stateReducer
		const trackingDataPromise = API.Tracking.getTrackingData({
			areaIds: [area.id],
			locale: locale.abbr,
		})

		const namedListPromise = API.NamedList.getNamedListWithoutType({
			areaIds: [area.id],
			isUserDefined: true,
		})

		const [
			{ data: originalTrackingData },
			{ data: namedList },
		] = await Promise.all([trackingDataPromise, namedListPromise])

		if (originalTrackingData && namedList) {
			const namedListMap = {}
			namedList.forEach(({ name, objectIds }) => {
				objectIds.forEach(({ object_id }) => {
					namedListMap[object_id] = name
				})
			})

			const trackingData = originalTrackingData.map((item) => {
				item.named_list_name = namedListMap[item.id]
				return item
			})
			const trackingDataMap = keyBy(trackingData, 'id')

			this.setState({
				trackingData,
				trackingDataMap,
			})
		}
	}

	getKeywords = async () => {
		const [{ area }] = this.context.stateReducer
		const res = await API.Object.getSearchableKeywords({
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

		const res = await API.Lbeacon.getLbeaconTable({
			locale: locale.abbr,
		})

		if (res) {
			const lbeaconPosition = res.data.map((item) => {
				item.coordinate = createLbeaconCoordinate(item.uuid).toString()
				return item
			})
			this.setState({
				lbeaconPosition,
			})
		}
	}

	getGroupIdList = async () => {
		const { auth, stateReducer } = this.context
		const [{ area }] = stateReducer
		const userId = auth.user.id

		const { data: groupIds } = await API.UserAssignments.getGroupIdListByUserId(
			{
				areaId: area.id,
				userId,
			}
		)

		this.setState({
			groupIds,
		})
	}

	/** Retrieve location monitor data from database */
	getLocationMonitorConfig = async () => {
		const { auth } = this.context

		const res = await API.Monitor.getMonitorConfig(
			NOT_STAY_ROOM_MONITOR,
			auth.user.area_ids
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

			this.setState({
				locationMonitorConfig,
			})
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
		const { trackingData, pinColorArray, groupIds } = this.state
		const [{ openedNotification }] = stateReducer

		let searchResult = []
		let suggestions = []
		let { searchObjectArray } = this.state
		const numberSheet = {}

		const activeActionButtons = []
		const proccessedTrackingData = deepClone(trackingData)

		switch (searchKey.type) {
			case ALL_DEVICES:
				searchObjectArray = []
				searchResult = []
				proccessedTrackingData.forEach((item) => {
					if (isSameValue(item.object_type, config.OBJECT_TYPE.DEVICE)) {
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
						isSameValue(item.object_type, config.OBJECT_TYPE.PERSON) &&
						isSameValue(item.type, config.OBJECT_TABLE_SUB_TYPE.PATIENT)
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
						isSameValue(item.object_type, config.OBJECT_TYPE.DEVICE) &&
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
						isSameValue(item.object_type, config.OBJECT_TYPE.PERSON) &&
						isSameValue(item.type, config.OBJECT_TABLE_SUB_TYPE.PATIENT) &&
						groupIds &&
						groupIds.includes(parseInt(item.list_id))

					if (isMyPatient) {
						item.searched = true
						item.searchedType = config.SEARCHED_TYPE.MY_PATIENTS
						searchResult.push(item)
					}
				})
				break

			case NAMED_LIST:
			case OBJECT_TYPE:
			case SEARCH_HISTORY:
				this.setPinColor({ searchKey, searchObjectArray, pinColorArray })
				searchResult = proccessedTrackingData.filter((item) => {
					const result = searchObjectArray.some((keyword) => {
						return this.checkSearchableFields({ item, keyword })
					})
					if (result) {
						this.appendSearchedType(item)
					}
					return result
				})
				break

			case SEARCH_BAR:
				searchObjectArray = []
				suggestions = searchKey.value
				searchResult = proccessedTrackingData.filter((item) => {
					return suggestions.some((keyword) => {
						return this.checkSearchableFields({ item, keyword })
					})
				})
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

		if (openedNotification) {
			const { object, notification } = openedNotification
			if (notification) {
				object.monitor_types = [notification.monitor_type]
			}
			searchResult = [object]
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

		const clearSearchResult = searchKey.value === null

		searchResult = searchResult.map((item) => {
			const monitorTypes = item.monitor_types || []
			if (monitorTypes.includes(config.MONITOR_TYPE.EMERGENCY)) {
				item.emergency = true
			} else if (monitorTypes.includes(config.MONITOR_TYPE.GEO_FENCE)) {
				item.forbidden = true
			} else if (monitorTypes.includes(config.MONITOR_TYPE.VITAL_SIGN)) {
				item.vitalSignAlert = true
			} else if (item.searched) {
				item.numberOfSearched = countNumber(searchKey, item, numberSheet)
			}
			return item
		})

		this.setState({
			proccessedTrackingData,
			searchResult,
			searchKey,
			searchObjectArray,
			pinColorArray,
			activeActionButtons,
			clearSearchResult,
		})
	}

	setPinColor = ({ searchKey, searchObjectArray, pinColorArray }) => {
		if (!searchObjectArray.includes(searchKey.value)) {
			searchObjectArray.push(searchKey.value)
			if (searchObjectArray.length > pinColorArray.length) {
				searchObjectArray.shift()
				pinColorArray.push(pinColorArray.shift())
			}
		}
	}

	checkSearchableFields = ({ item, keyword }) => {
		const searchableField = config.SEARCHABLE_FIELD
		return searchableField.some((field) => {
			if (item[field] && item[field] === keyword) {
				item.keyword = keyword
				item.searched = true
				return true
			}
			return false
		})
	}

	appendSearchedType = (item) => {
		if (isSameValue(item.object_type, config.OBJECT_TYPE.DEVICE)) {
			item.searchedType = config.SEARCHED_TYPE.OBJECT_TYPE_DEVICE
		}
		if (isSameValue(item.object_type, config.OBJECT_TYPE.PERSON)) {
			item.searchedType = config.SEARCHED_TYPE.OBJECT_TYPE_PERSON
		}
	}

	highlightSearchPanel = (boolean) => {
		this.setState({
			isHighlightSearchPanel: boolean,
		})
	}

	handleSearchTypeClick = (searchKey) => {
		if ([MY_PATIENTS, MY_DEVICES].includes(searchKey.type)) {
			this.getGroupIdList()
		}
	}

	handleClick = (e) => {
		const [, dispatch] = this.context.stateReducer
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
					searchKey: {
						type: null,
						value: null,
					},
					searchResult: [],
					colorPanel: null,
					clearSearchResult: true,
					proccessedTrackingData: [],
					searchObjectArray: [],
					activeActionButtons: [],
					pathObjectAcns: [],
				})
				dispatch({
					type: SET_OPENED_NOTIFICATION,
					value: null,
				})
				break
		}
	}
	handleHidePath = () =>{
		this.setState({
			pathObjectAcns: undefined,
			pathTimeLength: 0,
		})
	}
	handleShowPath = (selectedObjectIds, pathTimeLength = 60) =>{
		console.log(selectedObjectIds)
		this.setState({
			pathObjectAcns:selectedObjectIds,
			showPath: true,
			pathTimeLength,
		})
	}

	render() {
		const {
			proccessedTrackingData,
			searchResult,
			searchKey,
			lbeaconPosition,
			clearSearchResult,
			showPath,
			pathObjectAcns,
			pathTimeLength,
			isHighlightSearchPanel,
			locationMonitorConfig,
			searchObjectArray,
			pinColorArray,
			showFoundResult,
			keywords,
			activeActionButtons,
		} = this.state

		const {
			getSearchKey,
			highlightSearchPanel,
			handleClick,
			handleShowPath,
			handleHidePath,
			handleSearchTypeClick,
		} = this

		const propsGroup = {
			getSearchKey,
			lbeaconPosition,
			highlightSearchPanel,
			clearSearchResult,
			searchKey,
			searchResult,
			proccessedTrackingData,
			showPath,
			pathObjectAcns,
			pathTimeLength,
			handleShowPath,
			handleHidePath,
			isHighlightSearchPanel,
			locationMonitorConfig,
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
