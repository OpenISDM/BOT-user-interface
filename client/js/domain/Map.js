import React from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import '../config/leafletAwesomeNumberMarkers'
import { AppContext } from '../context/AppContext'
import { isMobileOnly, isBrowser, isTablet } from 'react-device-detect'
import { macAddressToCoordinate } from '../helper/dataTransfer'
import {
	isEqual,
	isSameValue,
	getIconColor,
	getPopupContent,
	getLbeaconPopupContent,
} from '../helper/utilities'
import { PIN_SELETION } from '../config/wordMap'
import PropTypes from 'prop-types'
import API from '../api'
import config from '../config'
import { baseURL } from '../api/utils/request'

class Map extends React.Component {
	static contextType = AppContext

	state = {
		shouldUpdateTrackingData: true,
		objectInfo: [],
		currentArea: null,
	}

	mapInitiated = false
	mapLayer = null
	previousImageLayer = null
	imageLayerMap = {}
	pathOfDevice = L.layerGroup()
	markersLayer = L.layerGroup()
	errorCircle = L.layerGroup()
	lbeaconsPosition = L.layerGroup()
	geoFenceLayer = L.layerGroup()
	locationMonitorLayer = L.layerGroup()
	currentZoom = 0
	prevZoom = 0
	iconOption = {}
	mapOptions = {}

	componentDidMount = () => {
		this.initMap()
	}

	componentDidUpdate = (prevProps, prevState) => {
		const [{ area }] = this.context.stateReducer

		if (!this.mapInitiated) {
			this.initMap()
		}

		if (!isEqual(prevState.currentArea, area)) {
			this.setMap()
			this.setState({
				currentArea: area,
			})
		}

		if (this.state.shouldUpdateTrackingData) {
			this.handleObjectMarkers()
		}

		if (
			!isEqual(prevProps.lbeaconPosition, this.props.lbeaconPosition) ||
			!isEqual(prevState.currentArea, area) ||
			!isEqual(prevProps.authenticated, this.props.authenticated)
		) {
			this.createLbeaconMarkers(
				this.props.lbeaconPosition,
				this.lbeaconsPosition
			)
		}

		if (
			!isEqual(
				prevProps.locationMonitorConfig,
				this.props.locationMonitorConfig
			)
		) {
			this.createLocationMonitorMarkers()
		}

		if (!isEqual(prevProps.pathMacAddress, this.props.pathMacAddress)) {
			this.drawPolyline()
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		if (
			nextState.shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData
		) {
			return false
		}
		return true
	}

	/** Set the search map configuration establishing in config.js  */
	initMap = () => {
		const { mapConfig } = this.props

		if (isBrowser) {
			this.mapOptions = mapConfig.browserMapOptions
			this.iconOptions = mapConfig.iconOptions
		} else if (isTablet) {
			this.mapOptions = mapConfig.tabletMapOptions
			this.iconOptions = mapConfig.iconOptionsInTablet
		} else if (isMobileOnly) {
			this.mapOptions = mapConfig.mobileMapOptions
			this.iconOptions = mapConfig.iconOptionsInMobile
		}

		if (this.mapLayer !== null) {
			this.mapLayer.remove && this.mapLayer.remove()
		}

		const node = this.node
		this.mapLayer = L.map(node, this.mapOptions)

		/** Close popup while mouse leaving out the map */
		this.mapLayer.on('mouseout', () => {
			this.mapLayer.closePopup()
			this.setState({
				shouldUpdateTrackingData: true,
			})
		})

		this.mapInitiated = true
		console.log('initMap completed!')
		this.setMap()
	}

	/** Set the overlay image when changing area */
	setMap = () => {
		const [{ area }] = this.context.stateReducer
		const { bounds, map_image_path } = area
		const url = map_image_path ? `${baseURL}/map/${map_image_path}` : null

		if (this.previousImageLayer) {
			this.mapLayer.removeLayer(this.previousImageLayer)
		}

		if (bounds && url) {
			if (!this.imageLayerMap[url]) {
				this.imageLayerMap[url] = L.imageOverlay(url, bounds)
			}

			this.mapLayer.addLayer(this.imageLayerMap[url])
			this.mapLayer.fitBounds(bounds)
			this.previousImageLayer = this.imageLayerMap[url]
			console.log(bounds, url)
			console.log(this.mapLayer.hasLayer(this.imageLayerMap[url]))
		}

		console.log('setMap completed!')
	}

	/** Calculate the current scale for creating markers and resizing. */
	calculateScale = () => {
		this.minZoom = this.mapLayer.getMinZoom()
		this.zoomDiff = this.currentZoom - this.minZoom
		this.resizeFactor = Math.pow(2, this.zoomDiff)
		this.resizeConst = Math.floor(this.zoomDiff * 20)

		if (isBrowser) {
			this.scalableIconSize =
				parseInt(this.props.mapConfig.iconOptions.iconSize) + this.resizeConst
			this.scalableCircleRadius =
				parseInt(this.props.mapConfig.iconOptions.circleRadius) *
				this.resizeFactor
			this.scalableNumberSize = this.scalableIconSize / 3
		} else if (isTablet) {
			this.scalableIconSize =
				parseInt(this.props.mapConfig.iconOptions.iconSizeForTablet) +
				this.resizeConst
			this.scalableCircleRadius =
				parseInt(this.props.mapConfig.iconOptions.circleRadiusForTablet) *
				this.resizeFactor
			this.scalableNumberSize = Math.floor(this.scalableIconSize / 3)
		} else if (isMobileOnly) {
			this.scalableIconSize =
				parseInt(this.props.mapConfig.iconOptionsInMobile.iconSize) +
				this.resizeConst
			this.scalableCircleRadius =
				parseInt(this.props.mapConfig.iconOptionsInMobile.circleRadius) *
				this.resizeFactor
			this.scalableNumberSize = this.scalableIconSize / 3
		}
	}

	/** init path */
	drawPolyline = async () => {
		this.pathOfDevice.clearLayers()
		if (this.props.pathMacAddress !== '') {
			const route = []
			const res = await API.Utils.getTrackingTableByMacAddress({
				object_mac_address: this.props.pathMacAddress,
			})
			if (res) {
				let preUUID = ''
				res.data.rows.forEach((item) => {
					if (item.uuid !== preUUID) {
						preUUID = item.uuid
						const latLng = [item.base_y, item.base_x]

						/** Calculate the position of the object  */
						const pos = macAddressToCoordinate(
							item.mac_address,
							latLng,
							item.updated_by_n_lbeacons,
							this.props.mapConfig.iconOptions.markerDispersity
						)
						const marker = L.circleMarker(pos, {
							radius: 3,
							color: 'lightgrey',
						})

						this.pathOfDevice.addLayer(marker)
						route.push(pos)
					}
				})

				const polyline = L.polyline(route, {
					color: 'black',
					dashArray: '1,1',
				})

				const decorator = L.polylineDecorator(polyline, {
					patterns: [
						{
							offset: '100%',
							repeat: 0,
							symbol: L.Symbol.arrowHead({
								weight: 3,
								pixelSize: 10,
								polygon: false,
								pathOptions: {
									color: 'black',
									stroke: true,
								},
							}),
						},
					],
				})
				this.pathOfDevice.addLayer(polyline)
				this.pathOfDevice.addLayer(decorator)
				this.pathOfDevice.addTo(this.mapLayer)
			}
		}
	}

	/** Create the geofence-related lbeacons markers */
	createLocationMonitorMarkers = () => {
		const { locationMonitorConfig } = this.props
		const { stateReducer } = this.context

		const [{ area }] = stateReducer

		this.locationMonitorLayer.clearLayers()
		/** Create the markers of lbeacons of perimeters and fences
		 *  and onto the map  */
		if (
			locationMonitorConfig[area.id] &&
			locationMonitorConfig[area.id].enable &&
			locationMonitorConfig[area.id].rule.is_active
		) {
			this.createLbeaconMarkers(
				locationMonitorConfig[area.id].rule.lbeacons,
				this.locationMonitorLayer
			)
		}
	}

	/** Create the lbeacon and invisibleCircle markers */
	createLbeaconMarkers = (parseUUIDArray, layer) => {
		const { stateReducer, auth } = this.context
		const [{ area }] = stateReducer

		layer.clearLayers()

		if (!auth.user.permissions.includes('view:lbeaconMarker')) {
			return
		}
		/** Creat the marker of all lbeacons onto the map  */
		parseUUIDArray
			.filter(
				(lbeacon) =>
					parseInt(lbeacon.coordinate.split(',')[2]) === parseInt(area.id)
			)
			.forEach((lbeacon) => {
				const latLng = lbeacon.coordinate.split(',')

				const lbeaconMarkerOptions = lbeacon.isInHealthInterval
					? this.iconOptions.lbeaconMarkerOptions
					: this.iconOptions.lbeaconMarkerFailedOptions

				const lbeaconMarker = L.circleMarker(latLng, lbeaconMarkerOptions)
				lbeaconMarker
					.bindPopup(getLbeaconPopupContent(lbeacon))
					.openPopup()
					.addTo(layer)
				// invisibleCircle.on('mouseover', this.handlemenu)
				// invisibleCircle.on('mouseout', function() {this.closePopup();})
			})
		/** Add the new markerslayers to the map */
		layer.addTo(this.mapLayer)
	}

	/**
	 * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
	 * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
	 * @param e the object content of the mouse clicking.
	 */
	handlemenu = (e) => {
		const { objectInfo } = this.state
		const lbeacon_coorinate = Object.values(e.target._latlng).toString()
		const objectList = []
		for (const key in objectInfo) {
			if (objectInfo[key].lbeacon_coordinate.toString() === lbeacon_coorinate) {
				objectList.push(objectInfo[key])
			}
		}
		if (objectList.length !== 0) {
			const popupContent = this.popupContent(objectList)
			e.target
				.bindPopup(popupContent, this.props.mapConfig.popupOptions)
				.openPopup()
		}

		this.props.isObjectListShownProp(true)
		this.props.selectObjectListProp(objectList)
	}

	/**
	 * When handleTrackingData() is executed, handleObjectMarkes() will be called. That is,
	 * once the component is updated, handleObjectMarkers() will be executed.
	 * Clear the old markersLayer.
	 * Add the markers into this.markersLayer.
	 * Create the markers' popup, and add into this.markersLayer.
	 * Create the popup's event.
	 * Create the error circle of markers, and add into this.markersLayer.
	 */
	handleObjectMarkers = () => {
		const { locale, stateReducer } = this.context

		const { searchObjectArray, searchResult } = this.props

		const [
			{ assignedObject, deviceObjectTypeVisible, personObjectTypeVisible },
		] = stateReducer

		/** Clear the old markerslayers. */
		this.prevZoom = this.originalZoom
		this.markersLayer.clearLayers()
		this.errorCircle.clearLayers()

		this.filterTrackingData(searchResult).forEach((item) => {
			const checkToShowDevice =
				parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE &&
				deviceObjectTypeVisible
			const checkToShowPerson =
				parseInt(item.object_type) === config.OBJECT_TYPE.PERSON &&
				personObjectTypeVisible

			if (checkToShowDevice || checkToShowPerson) {
				/** Calculate the position of the object  */
				const position = macAddressToCoordinate(
					item.mac_address,
					item.currentPosition,
					item.updated_by_n_lbeacons,
					this.props.mapConfig.iconOptions.markerDispersity
				)

				/** Set the Marker's popup
				 * popupContent (objectName, objectImg, objectImgWidth)
				 * More Style sheet include in Map.css */
				const popupContent = getPopupContent(
					[item],
					this.collectObjectsByPosition(
						searchResult,
						item.currentPosition,
						item.type,
						item.searchedType
					),
					locale
				)

				/** Set the attribute if the object in search result list is on hover */
				if (item.mac_address === assignedObject) {
					// iconSize = iconSize.map(item => item * 5)

					const errorCircleOptions = this.iconOptions.errorCircleOptions

					const errorCircle = L.circleMarker(position, errorCircleOptions)

					errorCircle.addTo(this.markersLayer)
				}

				const { markerColor } = getIconColor(item, searchObjectArray)

				/** Set the icon option*/
				item.iconOption = {
					...this.iconOptions,

					/** Set the pin color */
					markerColor,

					/** Set the pin size */
					// iconSize,

					/** Insert the object's mac_address to be the data when clicking the object's marker */
					macAddress: item.mac_address,

					lbeacon_coordinate: item.lbeacon_coordinate,

					currentPosition: item.currentPosition,

					/** Set the ordered number on location pin */
					number: item.numberOfSearched ? item.numberOfSearched : '',

					/** Set the color of the ordered number */
					numberColor: this.props.mapConfig.iconColor.number,

					/** Mark the objects onto the map  */
					// iconSize: [this.scalableIconSize, this.scalableIconSize],
					// numberSize: this.scalableNumberSize,
				}

				const option = new L.AwesomeNumberMarkers(item.iconOption)

				const marker = L.marker(position, { icon: option })
					.bindPopup(popupContent, this.props.mapConfig.popupOptions)
					.openPopup()

				/** Set the z-index offset of the object so that
				 * the icon will be on top of all others */
				if (item.emergency || item.forbidden || item.vitalSignAlert) {
					marker.setZIndexOffset(1000)
				}

				/** Set the marker's event. */
				marker.on('mouseover', () => {
					this.mapLayer.flyTo(item.currentPosition)
					marker.openPopup()
					this.setState({
						shouldUpdateTrackingData: false,
					})
				})

				marker.getPopup().on('remove', () => {
					this.setState({
						shouldUpdateTrackingData: true,
					})
				})

				marker.on('click', async () => {
					const objectList = this.collectObjectsByPosition(
						searchResult,
						item.currentPosition,
						item.type,
						item.searchedType
					)
					await this.props.getSearchKey({
						type: PIN_SELETION,
						value: objectList.map((item) => item.mac_address),
					})
					this.props.searchResultListRef.current.handleClick()
				})

				marker.addTo(this.markersLayer)
			}
		})
		/** Add the new markerslayers to the map */
		this.markersLayer.addTo(this.mapLayer)
		this.errorCircle.addTo(this.mapLayer)
	}

	/** Filter out undesired tracking data */
	filterTrackingData = (data = []) => {
		const [{ area }] = this.context.stateReducer
		return data.filter((item) => {
			return item.found && isSameValue(item.updated_by_area, area.id)
		})
	}

	collectObjectsByPosition = (
		collection,
		position,
		itemCurrentType,
		itemCurrentSearchedType
	) => {
		const objectList = collection.filter((item) => {
			if (!item.found) return false
			if (item.currentPosition == null) return false
			if (
				itemCurrentType !== item.type &&
				itemCurrentSearchedType !== item.searchedType
			) {
				return false
			}

			const yDiff = Math.abs(item.currentPosition[0] - position[0])
			const xDiff = Math.abs(item.currentPosition[1] - position[1])
			const distance = Math.sqrt(Math.pow(yDiff, 2) + Math.pow(xDiff, 2))

			return distance < this.props.mapConfig.PIN_SELECTION_RADIUS
		})

		return objectList
	}

	render() {
		return (
			<div
				ref={(node) => {
					this.node = node
				}}
				className="w-100 bg-white sm:height-25 md:height-40 lg:height-60 xl:height-84 xxl:height-85 xxxl:height-90"
			/>
		)
	}
}

Map.propTypes = {
	mapConfig: PropTypes.object.isRequired,
	searchResultListRef: PropTypes.object.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchKey: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	isObjectListShownProp: PropTypes.func.isRequired,
	selectObjectListProp: PropTypes.func.isRequired,
	locationMonitorConfig: PropTypes.object.isRequired,
	pathMacAddress: PropTypes.object.isRequired,
	lbeaconPosition: PropTypes.array.isRequired,
	authenticated: PropTypes.bool.isRequired,
}

export default Map
