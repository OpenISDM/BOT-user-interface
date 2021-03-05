import L from 'leaflet'

const ACNOmitsymbol = '...'
const MARKER_SIZE_IN_DESKTOP = 50
const MARKER_SIZE_IN_MOBILE = 20
const MARKER_SIZE_IN_TABLET = 20

/** Map configuration.
 *  Refer leaflet.js for more optional setting https://leafletjs.com/reference-1.5.0.html
 */
const mapConfig = {
	ACNOmitsymbol,
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

		numberSize: 14,

		numberShiftTop: '4%',

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

	iconColor: {
		number: 'White',
		sos: 'SOS',
		forbidden: 'Forbidden',

		deivce: {
			normal: 'BlackWithDot',
			unNormal: 'GrayWithDot',
			grayWithoutDot: 'Gray',
			blackBed: 'BlackRound',
			whiteBed: 'WhiteRound',
		},

		person: {
			normalMarker: 'Person',
			normalColor: 'Sienna',
			alert: 'Alert',
		},

		pinColorArray: [
			'SlateBlue',
			'Orange',
			'YellowGreen',
			'LightBlue',
			'Tan',
			'SteelBlue',
		],
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
}

export default mapConfig
