/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTMap.js

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

import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, ImageOverlay, LayerGroup, Circle } from 'react-leaflet'
import { CRS } from 'leaflet'
import siteConfig from '../../../../site_module/siteConfig'
import config from '../../config'
import { AppContext } from '../../context/AppContext'
import { isWebpSupported, getCoordinatesFromUUID } from '../../helper/utilities'
import apiHelper from '../../helper/apiHelper'
import PropTypes from 'prop-types'

const generateGeoFenceLayer = (showGeoFence, geoFenceList) => {
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

const BOTMap = ({ showGeoFence = false }) => {
	const { auth, stateReducer } = useContext(AppContext)
	const [{ area }] = stateReducer
	const [geoFenceList, setGeoFenceList] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const res = await apiHelper.geofenceApis.getGeofenceConfig({
				areaId: area.id,
			})
			if (res) {
				setGeoFenceList(res.data)
			}
		}
		fetchData()
	}, [])

	const { areaOptions, browserMapOptions } = config.mapConfig
	const { areaModules } = siteConfig
	const areaOption = areaOptions[auth.user.main_area]
	const { bounds } = areaModules[areaOption]
	const url =
		isWebpSupported() && areaModules[areaOption].urlWebp
			? areaModules[areaOption].urlWebp
			: areaModules[areaOption].url

	const mapProps = {
		...browserMapOptions,
		crs: CRS.Simple,
		bounds,
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
			{generateGeoFenceLayer(showGeoFence, geoFenceList)}
			<ImageOverlay bounds={mapProps.bounds} url={url} />
		</MapContainer>
	)
}

BOTMap.propTypes = {
	showGeoFence: PropTypes.bool,
}

export default BOTMap
