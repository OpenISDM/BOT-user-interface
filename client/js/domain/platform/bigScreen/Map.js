import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import 'leaflet.markercluster'
import '../../../config/leafletAwesomeNumberMarkers'
import { AppContext } from '../../../context/AppContext'
import pinImage from './pinImage'
import { macAddressToCoordinate } from '../../../helper/dataTransfer'
import mapConfig from '../../../config/mapConfig'
import PropTypes from 'prop-types'
class Map extends React.Component {
	static contextType = AppContext

	state = {
		objectInfo: [],
	}

	map = null
	image = null
	iconOptions = {}
	markersLayer = L.layerGroup()

	componentDidMount = () => {
		this.initMap()
	}

	componentDidUpdate = (prevProps) => {
		this.handleObjectMarkers()

		if (prevProps.areaId !== this.props.areaId) {
			this.setMap()
		}
	}

	/** Set the search map configuration establishing in config.js  */
	initMap = () => {
		const [{ areaId, area }] = this.context.stateReducer

		this.iconOptions = mapConfig.iconOptionsInBigScreen
		const areaOption = mapConfig.areaOptions[areaId]

		/** set the map's config */
		const { url, bounds, hasMap } = areaModules[areaOption]

		const map = L.map('mapid', mapConfig.bigScreenMapOptions)

		if (hasMap) {
			this.image = L.imageOverlay(url, bounds)
			map.addLayer(this.image)
			map.fitBounds(bounds)
			this.map = map
		} else {
			this.image = L.imageOverlay(null, null)
			map.addLayer(this.image)
			this.map = map
		}

		/** Set the map's events */
		// this.map.on('zoomend', this.resizeMarkers)
		this.createLegend(this.createLegendJSX())
	}

	/** Set the overlay image */
	setMap = () => {
		const [{ areaId, area }] = this.context.stateReducer


		const areaOption = mapConfig.areaOptions[areaId]

		/** set the map's config */
		const { url, bounds, hasMap } = areaModules[areaOption]

		if (hasMap) {
			this.image.setUrl(url)
			this.image.setBounds(bounds)
			this.map.fitBounds(bounds)
		} else {
			this.image.setUrl(null)
		}
	}

	createLegend(LegendJSX) {
		if (LegendJSX) {
			try {
				this.map.removeControl(this.legend)
			} catch(e) {
				console.log(`create legend failed : ${e}`)
			}

			this.legend = L.control({ position: 'bottomleft' })

			this.legend.onAdd = function () {
				const div = L.DomUtil.create('div', 'info legend')
				ReactDOM.render(LegendJSX, div)
				return div
			}.bind(this)

			this.legend.addTo(this.map)
		}
	}

	createLegendJSX = (imageSize = '25px', legendWidth = '250px') => {
		// pinImage is imported
		const { legendDescriptor } = this.props
		const { locale } = this.context
		let pins = null
		try {
			pins = legendDescriptor.map((description) => {
				return pinImage[description.pinColor]
			})
		} catch (e) {
			console.log(`get pins failed : ${e}`)
		}

		const jsx = legendDescriptor ? (
			<div className="bg-light" style={{ width: legendWidth }}>
				{legendDescriptor.map((description, index) => {
					return (
						<div
							className="text-left d-flex align-items-center"
							key={index}
							style={{ width: '100%', height: '80px' }}
						>
							<img
								src={pins[index]}
								className="m-2 float-left"
								width={imageSize}
							></img>
							<strong>
								<h6
									className=""
									style={{ lineHeight: '200%', fontWeight: 'bold' }}
								>
									{description.text}: {description.itemCount}{' '}
									{locale.texts.ITEM}
								</h6>
							</strong>
						</div>
					)
				})}
			</div>
		) : null
		return jsx
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
		/** Clear the old markerslayers. */
		this.markersLayer.clearLayers()

		/** Mark the objects onto the map  */

		let counter = 0

		this.props.proccessedTrackingData
			.filter((item) => {
				return item.searched !== -1
			})
			.map((item) => {
				/** Calculate the position of the object  */
				const position = macAddressToCoordinate(
					item.mac_address,
					item.currentPosition,
					mapConfig.iconOptions.markerDispersity
				)

				/** Set the icon option*/

				item.iconOption = {
					...this.iconOptions,

					/** Set the pin color */
					markerColor: mapConfig.getIconColorInBigScreen(item),

					/** Set the pin size */
					// iconSize,

					/** Insert the object's mac_address to be the data when clicking the object's marker */
					macAddress: item.mac_address,
					currentPosition: item.currentPosition,

					/** Show the ordered on location pin */
					number:
						mapConfig.iconOptionsInBigScreen.showNumber &&
						// this.props.mapConfig.isObjectShowNumber.includes(item.searchedObjectType) &&
						item.searched
							? ++counter
							: '',

					/** Set the color of ordered number */
					numberColor: mapConfig.iconColor.number,
				}

				const option = new L.AwesomeNumberMarkers(item.iconOption)
				const marker = L.marker(position, { icon: option }).addTo(
					this.markersLayer
				)

				/** Set the z-index offset of the searhed object so that
				 * the searched object icon will be on top of all others */
				if (item.searched) marker.setZIndexOffset(1000)

				return item
			})

		/** Add the new markerslayers to the map */
		this.markersLayer.addTo(this.map)
		this.createLegend(this.createLegendJSX())
	}

	render() {
		return <div id="mapid" style={{ height: '90vh' }} />
	}
}

Map.propTypes = {
	areaId: PropTypes.string.isRequired,
	legendDescriptor: PropTypes.array.isRequired,
	proccessedTrackingData: PropTypes.array.isRequired,
}

export default Map
