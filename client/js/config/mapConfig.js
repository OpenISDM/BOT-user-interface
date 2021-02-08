import { monitorTypeChecker } from '../helper/dataTransfer'
import { NORMAL, RESERVE, RETURNED } from './wordMap'
import L from 'leaflet'

const ACNOmitsymbol = '...'
const MARKER_SIZE_IN_DESKTOP = 50
const MARKER_SIZE_IN_MOBILE = 20
const MARKER_SIZE_IN_TABLET = 20

/** Map configuration.
 *  Refer leaflet.js for more optional setting https://leafletjs.com/reference-1.5.0.html
 */
const mapConfig = {
	mapOptions: {
		crs: L.CRS.Simple,
		zoom: -5.5,
		minZoom: -5.46,
		maxZoom: 0,
		zoomDelta: 1,
		zoomSnap: 0.2,
		zoomControl: true,
		attributionControl: false,
		dragging: true,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		maxBoundsOffset: [-10000, 10000],
		maxBoundsViscosity: 0.0,
	},

	browserMapOptions: {
		crs: L.CRS.Simple,
		zoom: -5.5,
		minZoom: -7.46,
		maxZoom: -1,
		zoomDelta: 0.25,
		zoomSnap: 0.3,
		zoomControl: true,
		attributionControl: false,
		dragging: true,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		maxBoundsOffset: [-10000, 10000],
		maxBoundsViscosity: 0.0,
	},

	tabletMapOptions: {
		crs: L.CRS.Simple,
		zoom: -6.6,
		minZoom: -6.8,
		maxZoom: -6,
		zoomDelta: 0.25,
		zoomSnap: 0.2,
		zoomControl: true,
		attributionControl: false,
		dragging: true,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		maxBoundsOffset: [-10000, 10000],
		maxBoundsViscosity: 0.0,
	},

	mobileMapOptions: {
		crs: L.CRS.Simple,
		zoom: -7.25,
		minZoom: -7.4,
		maxZoom: -7,
		zoomDelta: 0.25,
		zoomSnap: 0.2,
		zoomControl: true,
		attributionControl: false,
		dragging: true,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		maxBoundsOffset: [-10000, 10000],
		maxBoundsViscosity: 0.0,
	},

	/** Set the icon option for browser */
	iconOptions: {
		iconSize: [MARKER_SIZE_IN_DESKTOP, MARKER_SIZE_IN_DESKTOP] || 1,

		iconAnchor: [MARKER_SIZE_IN_DESKTOP / 2, MARKER_SIZE_IN_DESKTOP],

		showNumber: true,

		numberSize: 10,

		numberShiftTop: '',

		numberShiftLeft: '2%',

		specifiedNumberTop: '8%',

		/* Set the Marker dispersity that can be any positive number */
		markerDispersity: 60,

		geoFenceMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'red',

			fillOpacity: 0.1,

			radius: 30,
		},

		lbeaconMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.3,

			radius: 10,
		},

		lbeaconMarkerFailedOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'red',

			fillOpacity: 0.4,

			radius: 10,
		},

		errorCircleOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.5,

			radius: 70,
		},
	},

	/** Set the icon option for mobile */
	iconOptionsInMobile: {
		iconSize: [MARKER_SIZE_IN_MOBILE, MARKER_SIZE_IN_MOBILE] || 1,

		iconAnchor: [MARKER_SIZE_IN_MOBILE / 2, MARKER_SIZE_IN_MOBILE],

		circleRadius: 8,

		circleRadiusForTablet: 15,

		showNumber: true,

		numberShiftTop: '-25%',

		numberShiftLeft: '3%',

		specifiedNumberTop: '-20%',

		numberSize: 8,

		/* Set the Marker dispersity that can be any positive number */
		markerDispersity: 60,

		geoFenceMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.4,

			radius: 8,
		},

		lbeaconMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.4,

			radius: 8,
		},
	},

	/** Set the icon option for tablet */
	iconOptionsInTablet: {
		iconSize: [MARKER_SIZE_IN_TABLET, MARKER_SIZE_IN_TABLET],

		iconAnchor: [MARKER_SIZE_IN_TABLET / 2, MARKER_SIZE_IN_TABLET],

		showNumber: true,

		numberShiftTop: '-25%',

		numberShiftLeft: '3%',

		specifiedNumberTop: '-20%',

		numberSize: 8,

		/* Set the Marker dispersity that can be any positive number */
		markerDispersity: 60,

		geoFenceMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.4,

			radius: 10,
		},

		lbeaconMarkerOptions: {
			color: 'rgba(0, 0, 0, 0)',

			fillColor: 'orange',

			fillOpacity: 0.4,

			radius: 10,
		},
	},

	/** Set the representation of color pin
	 * Icon options for AwesomeNumberMarkers
	 * The process:
	 * 1. Add the declaration of the desired icon option
	 * 2. Add the CSS description in leafletMarker.css */
	iconColorList: [
		'black',
		'red',
		'orange',
		'blue',
		'grey',
		'white',
		'orchid',
		'mistyrose',
		'tan',
		'lightyello',
		'lavender',
		'lightblue',
		'yellowgreen',
		'personSos',
		'forbidden',
		'personAlert',
		'female',
		'male',
		'blackRound',
		'whiteRound',
	],

	iconColor: {
		normal: 'black',
		geofenceF: 'red',
		geofenceP: 'orange',
		searched: 'blue',
		unNormal: 'grey',
		number: 'white',
		female: 'female',
		male: 'male',

		person: 'person',
		personAlert: 'personAlert',
		personSos: 'personSos',
		forbidden: 'forbidden',
		female_1: 'female_2',
		male_1: 'male_1',
		blackBed: 'blackRound',
		whiteBed: 'whiteRound',

		// ["slateblue", "tan", "lightyellow", "lavender", "orange","lightblue", "mistyrose", "yellowgreen", "darkseagreen", "orchid"]
		pinColorArray: ['slateblue', 'orange', 'yellowgreen', 'lightblue', 'tan'],
	},

	/** Set the schema to select the color pin */
	getIconColor: (item, hasColorPanel) => {
		if (item.emergency) {
			return mapConfig.iconColor.personSos
		}

		if (item.alerted) {
			return mapConfig.iconColor.personAlert
		}

		if (item.forbidden) {
			return mapConfig.iconColor.forbidden
		}

		if (parseInt(item.object_type) === 0) {
			if (item.clear_bed) {
				return mapConfig.iconColor.whiteBed
			}
			if (monitorTypeChecker(item.monitor_type, 16)) {
				return mapConfig.iconColor.blackBed
			} else if (hasColorPanel) {
				return item.pinColor
			} else if (item.searched) {
				return mapConfig.iconColor.searched
			} else if (item.status !== NORMAL) {
				return mapConfig.iconColor.unNormal
			}
			return mapConfig.iconColor.normal
		} else if (
			parseInt(item.object_type) === 1 ||
			parseInt(item.object_type) === 2
		) {
			return mapConfig.iconColor.person
		}
	},

	/* For test. To start object tracking*/
	startInteval: true,

	/* Set the tracking query inteval time(ms) */
	intervalTime: 1000,

	/** Radius of circle for collecting object based on the selection pin */
	PIN_SELECTION_RADIUS: 1000,

	popupOptions: {
		minWidth: '500',
		maxHeight: '300',
		className: 'customPopup',
		showNumber: false,
		autoPan: false,
	},

	/** Set the html content of popup of markers */
	getPopupContent: (object, objectList, locale) => {
		const content = objectList
			.map((item, index) => {
				const indexText = mapConfig.popupOptions.showNumber
					? `${index + 1}.`
					: '&bull;'
				const acn = `${
					locale.texts.ASSET_CONTROL_NUMBER
				}: ${ACNOmitsymbol}${item.asset_control_number.slice(-4)},`
				const residenceTime =
					item.status !== RETURNED
						? `${locale.texts[item.status.toUpperCase()]}`
						: `${item.residence_time}`
				const reservedTime =
					item.status === RESERVE ? `~ ${item.reserved_timestamp_final}` : ''
				const isReservedFor =
					item.status === RESERVE ? ` ${locale.texts.IS_RESERVED_FOR}` : ''
				const reservedUserName =
					item.status === RESERVE ? ` ${item.reserved_user_name}` : ''

				let careProvider = ''
				if (item.physician_names) {
					careProvider = ` ${locale.texts.PHYSICIAN_NAME}: ${item.physician_name},`
				}

				const itemContent =
					parseInt(item.object_type) === 0
						? `${item.type},
                            ${acn}
                            ${residenceTime}
                            ${reservedTime}
                            ${isReservedFor}
                            ${reservedUserName}
                        `
						: `${item.name},
                            ${careProvider}
                            ${item.residence_time}
                        `

				return `<div id='${item.mac_address}' class="popupItem mb-2">
                        <div class="d-flex justify-content-start">
                            <div class="min-width-1-percent">
                                ${indexText}
                            </div>
                            <div>
                                ${itemContent}
                            </div>
                        </div>
                        </div>
                        `
			})
			.join('')

		return `
            <div class="text-capitalize">
                <div class="font-size-120-percent">
                    ${object[0].location_description}
                </div>
                <hr/>
                <div class="popupContent custom-scrollbar max-height-30">
                    ${content}
                </div>
            </div>
        `
	},

	/** Set the html content of popup of Lbeacon markers */
	getLbeaconPopupContent: (lbeacon) => {
		return `
            <div>
                <div>
                    description: ${lbeacon.description}
                </div>
                <div>
                    coordinate: ${lbeacon.coordinate}
                </div>
                <div>
                    comment: ${lbeacon.comment}
                </div>
            </div>
        `
	},
}

export default mapConfig
