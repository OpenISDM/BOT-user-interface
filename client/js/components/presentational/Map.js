/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        Map.js

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

import React from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import '../../config/leafletAwesomeNumberMarkers'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import dataSrc from '../../dataSrc'
import siteConfig from '../../../../site_module/siteConfig'
import polylineDecorator from 'leaflet-polylinedecorator'
import { isMobileOnly, isBrowser, isTablet } from 'react-device-detect'
import { macAddressToCoordinate, countNumber } from '../../helper/dataTransfer'

import { JSONClone, isEqual, isWebpSupported } from '../../helper/utilities'
import { PIN_SELETION } from '../../config/wordMap'

class Map extends React.Component {
	static contextType = AppContext

	state = {
		shouldUpdateTrackingData: true,
		objectInfo: [],
	}

	map = null
	image = null
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
		const { auth } = this.context

		if (this.state.shouldUpdateTrackingData) {
			this.handleObjectMarkers()
		}

		if (
			!isEqual(prevProps.lbeaconPosition, this.props.lbeaconPosition) ||
			!isEqual(prevProps.currentAreaId, this.context.stateReducer[0].areaId) ||
			!isEqual(prevProps.authenticated, this.props.authenticated)
		) {
			this.createLbeaconMarkers(
				this.props.lbeaconPosition,
				this.lbeaconsPosition
			)
		}

		if (!isEqual(prevProps.geofenceConfig, this.props.geofenceConfig)) {
			this.createGeofenceMarkers()
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

		if (prevProps.areaId != this.props.areaId) {
			this.setMap()
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
		const { auth } = this.context

		const [{ areaId }] = this.context.stateReducer

		const { mapConfig } = this.props

		const { areaOptions } = mapConfig

		const { areaModules } = siteConfig

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

		/** Error handler of the user's auth area does not include the group of sites */
		const areaOption = areaOptions[auth.user.main_area]

		/** set the map's config */
		const { bounds, hasMap } = areaModules[areaOption]

		const url =
			isWebpSupported() && areaModules[areaOption].urlWebp
				? areaModules[areaOption].urlWebp
				: areaModules[areaOption].url

		this.mapOptions.maxBounds = bounds.map((latLng, index) =>
			latLng.map((axis) => axis + this.mapOptions.maxBoundsOffset[index])
		)

		if (this.map !== null) {
			this.map.remove && this.map.remove()
		} else {
			const node = this.node
			this.map = L.map(node, this.mapOptions)
		}

		/** Close popup while mouse leaving out the map */
		this.map.on('mouseout', () => {
			this.map.closePopup()
			this.setState({
				shouldUpdateTrackingData: true,
			})
		})

		if (hasMap) {
			const image = L.imageOverlay(url, bounds)
			this.map.addLayer(image)
			this.map.fitBounds(bounds)
			this.image = image
		} else {
			const image = L.imageOverlay(null, null)
			this.image = image
			this.map.addLayer(image)
		}
	}

	/** Set the overlay image when changing area */
	setMap = () => {
		const [{ areaId }] = this.context.stateReducer

		const { areaModules } = siteConfig

		const { areaOptions, mapOptions } = this.props.mapConfig

		/** Error handler of the user's auth area does not include the group of sites */
		const areaOption = areaOptions[areaId]

		/** set the map's config */
		const { bounds, hasMap } = areaModules[areaOption]

		const url =
			isWebpSupported() && areaModules[areaOption].urlWebp
				? areaModules[areaOption].urlWebp
				: areaModules[areaOption].url

		mapOptions.maxBounds = bounds.map((latLng, index) =>
			latLng.map((axis) => axis + mapOptions.maxBoundsOffset[index])
		)

		if (hasMap) {
			this.image.setUrl(url)
			this.image.setBounds(bounds)
			this.map.fitBounds(bounds)
		} else {
			this.image.setUrl(null)
		}
	}

	/** Calculate the current scale for creating markers and resizing. */
	calculateScale = () => {
		this.minZoom = this.map.getMinZoom()
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
	drawPolyline = () => {
		this.pathOfDevice.clearLayers()
		if (this.props.pathMacAddress != '') {
			const route = []

			axios
				.post(dataSrc.getTrackingTableByMacAddress, {
					object_mac_address: this.props.pathMacAddress,
				})
				.then((res) => {
					let preUUID = ''
					res.data.rows.map((item) => {
						if (item.uuid != preUUID) {
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
					this.pathOfDevice.addTo(this.map)
				})
				.catch((err) => {
					console.log(`get tracking table by mac address failed ${err}`)
				})
		}
	}

	/** Create the geofence-related lbeacons markers */
	createGeofenceMarkers = () => {
		const { geofenceConfig } = this.props

		const { stateReducer } = this.context

		// this.calculateScale()

		const [{ areaId }] = stateReducer

		this.geoFenceLayer.clearLayers()

		/** Create the markers of lbeacons of perimeters and fences
		 *  and onto the map  */
		if (geofenceConfig[areaId] && geofenceConfig[areaId].enable) {
			;['parsePerimeters', 'parseFences'].map((type) => {
				geofenceConfig[areaId].rules.map((rule) => {
					if (rule.is_active) {
						rule[type].coordinates.map((item) => {
							L.circleMarker(
								item,
								this.iconOptions.geoFenceMarkerOptions
							).addTo(this.geoFenceLayer)
						})
					}
				})
			})
		}

		/** Add the new markerslayers to the map */
		this.geoFenceLayer.addTo(this.map)
	}

	/** Create the geofence-related lbeacons markers */
	createLocationMonitorMarkers = () => {
		const { locationMonitorConfig } = this.props
		const { stateReducer } = this.context

		const [{ areaId }] = stateReducer

		this.locationMonitorLayer.clearLayers()
		/** Create the markers of lbeacons of perimeters and fences
		 *  and onto the map  */
		if (
			locationMonitorConfig[areaId] &&
			locationMonitorConfig[areaId].enable &&
			locationMonitorConfig[areaId].rule.is_active
		) {
			this.createLbeaconMarkers(
				locationMonitorConfig[areaId].rule.lbeacons,
				this.locationMonitorLayer
			)
		}
	}

	/** Create the lbeacon and invisibleCircle markers */
	createLbeaconMarkers = (parseUUIDArray, layer) => {
		const { stateReducer, auth } = this.context
		const [{ areaId }] = stateReducer

		layer.clearLayers()

		if (!auth.user.permissions.includes('view:lbeaconMarker')) {
			return
		}
		/** Creat the marker of all lbeacons onto the map  */
		parseUUIDArray
			.filter((lbeacon) => parseInt(lbeacon.coordinate.split(',')[2]) == areaId)
			.map((lbeacon) => {
				const latLng = lbeacon.coordinate.split(',')

				const lbeaconMarkerOptions = lbeacon.isInHealthInterval
					? this.iconOptions.lbeaconMarkerOptions
					: this.iconOptions.lbeaconMarkerFailedOptions

				const lbeaconMarker = L.circleMarker(latLng, lbeaconMarkerOptions)
				lbeaconMarker
					.bindPopup(this.props.mapConfig.getLbeaconPopupContent(lbeacon))
					.openPopup()
					.addTo(layer)
				// invisibleCircle.on('mouseover', this.handlemenu)
				// invisibleCircle.on('mouseout', function() {this.closePopup();})
			})
		/** Add the new markerslayers to the map */
		layer.addTo(this.map)
	}

	/**
	 * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
	 * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
	 * @param e the object content of the mouse clicking.
	 */
	handlemenu = (e) => {
		const { objectInfo } = this.state
		const lbeacon_coorinate = Object.values(e.target._latlng).toString()
		let objectList = [],
			key
		for (key in objectInfo) {
			if (objectInfo[key].lbeacon_coordinate.toString() == lbeacon_coorinate) {
				objectList.push(objectInfo[key])
			}
		}
		if (objectList.length != 0) {
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

		const {
			searchObjectArray,
			pinColorArray,
			searchKey,
			proccessedTrackingData,
			showedObjects,
		} = this.props

		const [{ assignedObject }] = stateReducer

		/** Clear the old markerslayers. */
		this.prevZoom = this.originalZoom
		this.markersLayer.clearLayers()
		this.errorCircle.clearLayers()

		/** Mark the objects onto the map  */

		// const iconSize = [this.scalableIconSize, this.scalableIconSize];
		// const numberSize = this.scalableNumberSize;

		const numberSheet = {}

		this.filterTrackingData(JSONClone(this.props.proccessedTrackingData)).map(
			(item, index) => {
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
				const popupContent = this.props.mapConfig.getPopupContent(
					[item],
					this.collectObjectsByPosition(
						proccessedTrackingData,
						item.currentPosition,
						showedObjects
					),
					locale
				)

				const pinColorIndex = searchObjectArray.indexOf(item.keyword)

				if (pinColorIndex > -1) {
					item.searched = true
					item.pinColor = pinColorArray[pinColorIndex]
				}
				const iconSize = this.iconOptions.iconSize

				/** Set the attribute if the object in search result list is on hover */
				if (item.mac_address == assignedObject) {
					// iconSize = iconSize.map(item => item * 5)

					const errorCircleOptions = this.iconOptions.errorCircleOptions

					const errorCircle = L.circleMarker(position, errorCircleOptions)

					errorCircle.addTo(this.markersLayer)
				}

				/** Set the icon option*/
				item.iconOption = {
					...this.iconOptions,

					/** Set the pin color */
					markerColor: this.props.mapConfig.getIconColor(
						item,
						pinColorIndex > -1
					),

					/** Set the pin size */
					// iconSize,

					/** Insert the object's mac_address to be the data when clicking the object's marker */
					macAddress: item.mac_address,

					lbeacon_coordinate: item.lbeacon_coordinate,

					currentPosition: item.currentPosition,

					/** Set the ordered number on location pin */
					number: item.searched
						? countNumber(searchKey, item, numberSheet)
						: '',

					/** Set the color of the ordered number */
					numberColor: this.props.mapConfig.iconColor.number,
				}

				const option = new L.AwesomeNumberMarkers(item.iconOption)

				const marker = L.marker(position, { icon: option })
					.bindPopup(popupContent, this.props.mapConfig.popupOptions)
					.openPopup()

				marker.addTo(this.markersLayer)

				/** Set the z-index offset of the searhed object so that
				 * the searched object icon will be on top of all others */
				if (item.searched || item.panic) marker.setZIndexOffset(1000)

				/** Set the marker's event. */
				marker.on('mouseover', () => {
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
						proccessedTrackingData,
						item.currentPosition,
						showedObjects
					)
					await this.props.getSearchKey({
						type: PIN_SELETION,
						value: objectList.map((item) => item.mac_address),
					})
					this.props.searchResultListRef.current.handleClick()
				})
			}
		)
		/** Add the new markerslayers to the map */
		this.markersLayer.addTo(this.map)
		this.errorCircle.addTo(this.map)
	}

	/** Filter out undesired tracking data */
	filterTrackingData = (proccessedTrackingData) => {
		return proccessedTrackingData.filter((item) => {
			return (
				item.found &&
				item.isMatchedObject &&
				(this.props.searchedObjectType.includes(parseInt(item.object_type)) ||
					this.props.searchedObjectType.includes(parseInt(item.searchedType)))
			)
		})
	}

	collectObjectsByLatLng = (lbPosition) => {
		const objectList = []
		this.filterTrackingData(this.props.proccessedTrackingData).map((item) => {
			item.lbeacon_coordinate &&
			item.lbeacon_coordinate.toString() == lbPosition.toString() &&
			item.isMatchedObject
				? objectList.push(item)
				: null
		})

		return objectList
	}

	collectObjectsByPosition = (collection, position, showedObjects) => {
		const objectList = collection.filter((item) => {
			if (!item.found) return false
			if (item.currentPosition == null) return false
			/* if (!showedObjects.includes(parseInt(item.object_type)))
					return false;*/
			if (
				!showedObjects.includes(parseInt(item.object_type)) &&
				!showedObjects.includes(parseInt(item.searchedType))
			)
				return false

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

export default Map
