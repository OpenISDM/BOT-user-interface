import React, { useContext, useEffect, useState } from 'react'
import {
	MapContainer,
	ImageOverlay,
	LayerGroup,
	Circle,
	Marker,
	useMap,
} from 'react-leaflet'
import L, { CRS } from 'leaflet'
import 'leaflet.markercluster'
import '../config/leafletAwesomeNumberMarkers'
import config from '../config'
import { AppContext } from '../context/AppContext'
import { getCoordinatesFromUUID } from '../helper/utilities'
import { macAddressToCoordinate } from '../helper/dataTransfer'
import API from '../api'
import { baseURL } from '../api/utils/request'
import PropTypes from 'prop-types'

const GenerateGeoFenceLayer = ({ showGeoFence = false, geoFenceList = [] }) => {
	let circles
	if (showGeoFence) {
		circles = geoFenceList.map((geoFence) => {
			return (
				<>
					<Circle
						center={getCoordinatesFromUUID({
							lBeaconUUID: geoFence.fences_uuid,
						})}
						pathOptions={{ color: 'red', fillColor: 'red' }}
						radius={900}
					/>
					<Circle
						center={getCoordinatesFromUUID({
							lBeaconUUID: geoFence.perimeters_uuid,
						})}
						pathOptions={{ color: 'orange', fillColor: 'orange' }}
						radius={900}
					/>
				</>
			)
		})
	}

	return <LayerGroup>{circles}</LayerGroup>
}

GenerateGeoFenceLayer.propTypes = {
	showGeoFence: PropTypes.bool,
	geoFenceList: PropTypes.array,
}

const GenerateMarkersLayer = ({ objectList = [] }) => {
	const markers = []
	if (objectList.length > 0) {
		objectList.forEach((object, index) => {
			/** Calculate the position of the object  */
			const position = macAddressToCoordinate(
				object.mac_address,
				object.currentPosition,
				object.updated_by_n_lbeacons,
				60
			)
			if (position) {
				const option = new L.AwesomeNumberMarkers({
					...config.mapConfig.iconOptions,
					markerColor: config.mapConfig.iconColor.deivce.normal,
				})
				markers.push(<Marker key={index} position={position} icon={option} />)
			}
		})
	}

	return <LayerGroup>{markers}</LayerGroup>
}

GenerateMarkersLayer.propTypes = {
	objectList: PropTypes.array,
}

const GenerateImageLayer = ({ area }) => {
	const { bounds, map_image_path, id } = area
	const map = useMap()

	useEffect(() => {
		if (bounds && bounds.length > 0) {
			map.fitBounds(bounds)
		}
	}, [map, bounds])

	const url = map_image_path ? `${baseURL}/map/${map_image_path}` : null
	let image
	if (url && bounds) {
		image = (
			<ImageOverlay
				key={id} // We set unique id to key for updating new image data
				bounds={bounds}
				url={url}
			/>
		)
	}

	return <LayerGroup>{image}</LayerGroup>
}

GenerateImageLayer.propTypes = {
	area: PropTypes.object,
	bounds: PropTypes.array,
}

const Map = ({ showGeoFence = false, objectList = [] }) => {
	const { stateReducer } = useContext(AppContext)
	const [{ area }] = stateReducer
	const [geoFenceList, setGeoFenceList] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const res = await API.GeofenceApis.getGeofenceConfig({
				areaId: area.id,
			})
			if (res) {
				setGeoFenceList(res.data)
			}
		}
		fetchData()
	}, [area.id])

	const { browserMapOptions } = config.mapConfig
	const mapProps = {
		...browserMapOptions,
		crs: CRS.Simple,
	}

	return (
		<MapContainer
			{...mapProps}
			style={{
				height: '100%',
				width: '100%',
				backgroundColor: 'white',
			}}
		>
			<GenerateGeoFenceLayer
				showGeoFence={showGeoFence}
				geoFenceList={[...geoFenceList]}
			/>
			<GenerateMarkersLayer objectList={objectList} />
			<GenerateImageLayer area={area} />
		</MapContainer>
	)
}

Map.propTypes = {
	showGeoFence: PropTypes.bool,
	objectList: PropTypes.array,
}

export default Map
