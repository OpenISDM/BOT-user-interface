/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

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


import React from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import '../../helper/leafletAwesomeNumberMarkers';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import siteConfig from '../../../../site_module/siteConfig';
import polylineDecorator from 'leaflet-polylinedecorator';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isMobileOnly,
    isBrowser,
    isTablet, 
    CustomView,
    isMobile 
} from 'react-device-detect'
import {
    macAddressToCoordinate
} from '../../helper/dataTransfer'

class Map extends React.Component {
    
    static contextType = AppContext

    state = {
        shouldUpdateTrackingData: true,
        objectInfo: [],
    }

    map = null;
    image = null;
    pathOfDevice = L.layerGroup();
    markersLayer = L.layerGroup();
    errorCircle = L.layerGroup();
    lbeaconsPosition = L.layerGroup();
    geoFenceLayer = L.layerGroup()
    locationMonitorLayer = L.layerGroup()
    currentZoom = 0
    prevZoom = 0
    iconOption = {};
    mapOptions = {};

    componentDidMount = () => {
        
        this.initMap();
    }


    componentDidUpdate = (prevProps, prevState) => {

        let {
            auth
        } = this.context

        if (this.state.shouldUpdateTrackingData) {
            this.handleObjectMarkers();
        }

        if (!(_.isEqual(prevProps.lbeaconPosition, this.props.lbeaconPosition)) ||
            !(_.isEqual(prevProps.currentAreaId, this.context.stateReducer[0].areaId)) ||
            !(_.isEqual(prevProps.authenticated, this.props.authenticated))
            ) {
            this.createLbeaconMarkers(this.props.lbeaconPosition, this.lbeaconsPosition)
        }

        if (!(_.isEqual(prevProps.geofenceConfig, this.props.geofenceConfig))) {
            this.createGeofenceMarkers()
        }

        if (!(_.isEqual(prevProps.locationMonitorConfig, this.props.locationMonitorConfig))) {
            this.createLocationMonitorMarkers()
        }
        if(!(_.isEqual(prevProps.pathMacAddress, this.props.pathMacAddress))){
            this.drawPolyline();
        }

        if (prevProps.areaId !== this.props.areaId) { 
            this.setMap()
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData) {
            return false
        }
        return true

    }

    /** Set the search map configuration establishing in config.js  */
    initMap = () => {
        let [{areaId}] = this.context.stateReducer

        let {
            mapConfig
        } = this.props

        let { 
            areaOptions,
            defaultAreaId,
        } = mapConfig

        let {
            areaModules
        } = siteConfig


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
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]
        this.mapOptions.maxBounds = bounds.map((latLng, index) => latLng.map(axis => axis + this.mapOptions.maxBoundsOffset[index]))
        var map = L.map('mapid', this.mapOptions);

        if (hasMap) {
            let image = L.imageOverlay(url, bounds);
            map.addLayer(image)
            map.fitBounds(bounds);
            this.image = image
            this.map = map;
        } else {
            let image = L.imageOverlay(null, null);
            this.image = image
            map.addLayer(image)
            this.map = map;
        }
    }

    /** Set the overlay image when changing area */
    setMap = () => {
        let [{areaId}] = this.context.stateReducer

        let {
            areaModules
        } = siteConfig

        let { 
            areaOptions,
            defaultAreaId,
            mapOptions
        } = this.props.mapConfig

        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]
        mapOptions.maxBounds = bounds.map((latLng, index) => latLng.map(axis => axis + mapOptions.maxBoundsOffset[index]))
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
        
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = Math.floor(this.zoomDiff * 20);

        if (isBrowser) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSize) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptions.circleRadius) * this.resizeFactor
            this.scalableNumberSize = this.scalableIconSize / 3;

        } else if (isTablet) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSizeForTablet) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptions.circleRadiusForTablet) * this.resizeFactor
            this.scalableNumberSize = Math.floor(this.scalableIconSize / 3);

        } else if (isMobileOnly) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptionsInMobile.iconSize) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptionsInMobile.circleRadius) * this.resizeFactor
            this.scalableNumberSize = this.scalableIconSize / 3;
        }
    }

    /** init path */
    drawPolyline = () => {

        this.pathOfDevice.clearLayers();
        if(this.props.pathMacAddress !== ''){

            let route = []

            axios.post(dataSrc.getTrackingTableByMacAddress, {
                object_mac_address : this.props.pathMacAddress
            })
            .then(res => {

                var preUUID = ''
                res.data.rows.map(item => {
                    
                    if(item.uuid != preUUID){
                        preUUID = item.uuid;
                        let latLng = [item.base_y, item.base_x]

                        /** Calculate the position of the object  */
                        let pos = macAddressToCoordinate(
                            item.mac_address, 
                            latLng,
                            item.updated_by_n_lbeacons,
                            this.props.mapConfig.iconOptions.markerDispersity
                        );
                        var marker = L.circleMarker(pos, {radius:3,color:'lightgrey'});
                        
                        this.pathOfDevice.addLayer(marker)
                        route.push(pos)
                    }
                })
                var polyline = L.polyline(route,{
                    color: 'black',
                    dashArray: '1,1'
                })

                var decorator = L.polylineDecorator(polyline, {
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
                                    stroke:true
                                }
                            })
                        }
                    ]
                })
                this.pathOfDevice.addLayer(polyline)
                this.pathOfDevice.addLayer(decorator)
                this.pathOfDevice.addTo(this.map)
            })
            .catch(err => {
                console.log(`get tracking table by mac address failed ${err}`)
            })
        }
    }

    /** Create the geofence-related lbeacons markers */
    createGeofenceMarkers = () => {     
        let {
            geofenceConfig,
        } = this.props

        let {
            stateReducer
        } = this.context

        // this.calculateScale()

        let [{areaId}] = stateReducer

        this.geoFenceLayer.clearLayers()

        /** Create the markers of lbeacons of perimeters and fences
         *  and onto the map  */
        if (geofenceConfig[areaId] && geofenceConfig[areaId].enable) {
            ['parsePerimeters', 'parseFences'].map(type => {
                geofenceConfig[areaId].rules.map(rule => {
                    if (rule.is_active) {
                        rule[type].coordinates.map(item => {
                            L.circleMarker(item, this.iconOptions.geoFenceMarkerOptions).addTo(this.geoFenceLayer);
                            
                        })  
                    }
                })
            })
        }
        
        /** Add the new markerslayers to the map */
        this.geoFenceLayer.addTo(this.map);
    }

    /** Create the geofence-related lbeacons markers */
    createLocationMonitorMarkers = () => {     
        let {
            locationMonitorConfig,
        } = this.props
        let {
            stateReducer
        } = this.context

        let [{areaId}] = stateReducer
        
        this.locationMonitorLayer.clearLayers()
        /** Create the markers of lbeacons of perimeters and fences
         *  and onto the map  */
        if (locationMonitorConfig[areaId] 
            && locationMonitorConfig[areaId].enable 
            && locationMonitorConfig[areaId].rule.is_active) {
            this.createLbeaconMarkers(
                locationMonitorConfig[areaId].rule.lbeacons,
                this.locationMonitorLayer
            )                            
        }
    }

    /** Create the lbeacon and invisibleCircle markers */
    createLbeaconMarkers = (parseUUIDArray, layer) => {

        let {
            stateReducer,
            auth
        } = this.context
        let [{areaId}] = stateReducer

        layer.clearLayers();

        if (!auth.user.permissions.includes("view:lbeaconMarker")) {
            return
        }
        /** Creat the marker of all lbeacons onto the map  */
        parseUUIDArray
            .filter(lbeacon => parseInt(lbeacon.coordinate.split(',')[2]) == areaId)
            .map(lbeacon => {
            let latLng = lbeacon.coordinate.split(',')

            let lbeaconMarkerOptions = lbeacon.isInHealthInterval 
                ? this.iconOptions.lbeaconMarkerOptions
                : this.iconOptions.lbeaconMarkerFailedOptions

            let lbeaconMarker = L.circleMarker(latLng, lbeaconMarkerOptions)
            lbeaconMarker.bindPopup(this.props.mapConfig.getLbeaconPopupContent(lbeacon))
                .openPopup()
                .addTo(layer);
            // invisibleCircle.on('mouseover', this.handlemenu)
            // invisibleCircle.on('mouseout', function() {this.closePopup();})
        })
        /** Add the new markerslayers to the map */
        layer.addTo(this.map);
    }
    
    /**
     * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
     * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
     * @param e the object content of the mouse clicking. 
     */
    handlemenu = (e) => {
        const { objectInfo } = this.state
        const lbeacon_coorinate = Object.values(e.target._latlng).toString();
        let objectList = [], key;
        for (key in objectInfo) {
            if (objectInfo[key].lbeacon_coordinate.toString() == lbeacon_coorinate) {
                objectList.push(objectInfo[key])
            }
        }
        if (objectList.length !== 0) {
            const popupContent = this.popupContent(objectList)
            e.target.bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
        }

        this.props.isObjectListShownProp(true);
        this.props.selectObjectListProp(objectList);
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
        let { 
            locale,
            stateReducer
        } = this.context

        let [{assignedObject}] = stateReducer;

        /** Clear the old markerslayers. */
        this.prevZoom = this.originalZoom;
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();

        /** Mark the objects onto the map  */
        // this.calculateScale();

        // const iconSize = [this.scalableIconSize, this.scalableIconSize];
        // const numberSize = this.scalableNumberSize;
        let counter = 0;
        this.filterTrackingData(_.cloneDeep(this.props.proccessedTrackingData))
        .map((item, index)  => {
            /** Calculate the position of the object  */
            let position = macAddressToCoordinate(
                item.mac_address, 
                item.currentPosition, 
                item.updated_by_n_lbeacons,
                this.props.mapConfig.iconOptions.markerDispersity
            );


            /** Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Map.css */
            let popupContent = this.props.mapConfig.getPopupContent([item], this.collectObjectsByLatLng(item.lbeacon_coordinate), locale)
            
            /** Set the icon option*/
            item.iconOption = {

                ...this.iconOptions,

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColor(item, this.props.colorPanel),

                /** Set the pin size */
                // iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,

                lbeacon_coordinate: item.lbeacon_coordinate,

                currentPosition: item.currentPosition,

                /** Set the ordered number on location pin */
                number: this.props.mapConfig.iconOptions.showNumber && item.searched 
                            ? ++counter
                            : '',

                /** Set the color of the ordered number */
                numberColor: this.props.mapConfig.iconColor.number,
            }
            const option = new L.AwesomeNumberMarkers (item.iconOption)
            let marker = L.marker(position, {icon: option}).bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
            marker.addTo(this.markersLayer)

            /** Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others */
            if (item.searched || item.panic) marker.setZIndexOffset(1000);

            /** Set error circle if the object in search result list is on hover */
            if (item.mac_address == assignedObject) {

                let errorCircleOptions = this.iconOptions.errorCircleOptions;

                let errorCircle = L.circleMarker(position, errorCircleOptions);
                
                errorCircle.addTo(this.markersLayer);

            }
        
            /** Set the marker's event. */
            marker.on('mouseover', () => {
                this.pop
                marker.openPopup()
                this.setState({
                    shouldUpdateTrackingData: false
                })

            })
            marker.getPopup().on('remove', () => {
                this.setState({
                    shouldUpdateTrackingData: true
                })
            })
            
        })
        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);
    }

    /** Fire when clicing marker */
    handleMarkerClick = (e) => {
        const lbPosition =  e.target.options.icon.options.lbeacon_coordinate
        this.props.getSearchKey('objects', null, lbPosition, )
    }

    /** Filter out undesired tracking data */
    filterTrackingData = (proccessedTrackingData) => {
        return proccessedTrackingData.filter(item => {
            return (
                item.found && 
                item.isMatchedObject && 
                (   this.props.searchedObjectType.includes(parseInt(item.object_type)) ||
                    this.props.searchedObjectType.includes(parseInt(item.searchedType))
                )
            )
        })
    }

    collectObjectsByLatLng = (lbPosition) => {
        let objectList = []
        this.filterTrackingData(this.props.proccessedTrackingData)
            .map(item => {
                item.lbeacon_coordinate && 
                item.lbeacon_coordinate.toString() === lbPosition.toString() 
                && item.isMatchedObject 
                    ? objectList.push(item) 
                    : null;
            })

        return objectList 
    }
    
    render(){
        return(
            <div>
               <CustomView condition={isTablet != true && isMobile != true}>
                    <div id='mapid' style={{height:'80vh'}}></div>
                </CustomView>  
                <TabletView>
                    <div id='mapid' style={{height:'40vh'}}></div>
                </TabletView>
                <MobileOnlyView>
                    <div id='mapid' style={{height: '28vh'}}></div>
                </MobileOnlyView>
            </div>
        )
    }
}

export default Map;

