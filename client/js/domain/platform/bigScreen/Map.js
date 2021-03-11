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


import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet.markercluster';
import '../../../config/leafletAwesomeNumberMarkers';
import { AppContext } from '../../../context/AppContext';
import  pinImage from "./pinImage"
import siteConfig from '../../../../../site_module/siteConfig'
import {
    macAddressToCoordinate
} from '../../../helper/dataTransfer'

class Map extends React.Component {
    
    static contextType = AppContext

    state = {
        objectInfo: [],
    }

    map = null;
    image = null;
    iconOptions = {};
    markersLayer = L.layerGroup();

    componentDidMount = () => {
        this.initMap();  
    }

    componentDidUpdate = (prevProps) => {
        this.handleObjectMarkers();

        if (prevProps.areaId !== this.props.areaId) { 
            this.setMap()
        }
    }

    /** Set the search map configuration establishing in config.js  */
    initMap = () => {
        let [{areaId}] = this.context.stateReducer

        let {
            areaModules
        } = siteConfig

        this.iconOptions = this.props.mapConfig.iconOptionsInBigScreen
        let areaOption = this.props.mapConfig.areaOptions[areaId]   

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]

        let map = L.map('mapid', this.props.mapConfig.bigScreenMapOptions);

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

        /** Set the map's events */
        // this.map.on('zoomend', this.resizeMarkers)
        this.createLegend(this.createLegendJSX())
    }

    /** Set the overlay image */
    setMap = () => {
        let [{areaId}] = this.context.stateReducer
        let {
            areaModules
        } = siteConfig        
        
        let areaOption = this.props.mapConfig.areaOptions[areaId]

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]

        if (hasMap) {
            this.image.setUrl(url)
            this.image.setBounds(bounds)
            this.map.fitBounds(bounds)  
        } else {
            this.image.setUrl(null)
        }        
    }

    createLegend(LegendJSX){
        if(LegendJSX){
            try{
                this.map.removeControl(this.legend)
            }catch{ null }

            this.legend = L.control({position: 'bottomleft'});

            this.legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend');
                ReactDOM.render(LegendJSX, div);
                return div;
            }.bind(this);

            this.legend.addTo(this.map);
        }
    }

    createLegendJSX = (imageSize = "25px", fontSize = "15px", legendWidth = "250px") => {
        // pinImage is imported
        var {
            legendDescriptor
        } = this.props
        let {
            locale
        } = this.context
        var pins;
        try{
            pins = legendDescriptor.map( description => { return pinImage[description.pinColor] })
        }catch{ null }

        var jsx = legendDescriptor ? 
            (
                <div className="bg-light" style={{width: legendWidth}}>
                    {
                        legendDescriptor.map((description, index) => {
                            return(
                                <div 
                                    className="text-left d-flex align-items-center" 
                                    key = {index} 
                                    style = {{width: '100%', height: '80px'}}
                                >
                                    <img src = {pins[index]} className = "m-2 float-left" width={imageSize}></img>
                                    <strong>
                                        <h6 className="" style={{lineHeight: '200%', fontWeight:'bold'}}>
                                            {description.text}: {description.itemCount} {locale.texts.ITEM}
                                        </h6>
                                    </strong>
                                </div>
                            )             
                        })
                    }
                </div>   
            )
            : null
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
        let { locale } = this.context

        /** Clear the old markerslayers. */
        this.markersLayer.clearLayers();

        /** Mark the objects onto the map  */

        let counter = 0;

        this.props.proccessedTrackingData
        .filter(item => {
            return (  
                item.searched != -1
            )
        })
        .map(item => {

            /** Calculate the position of the object  */
            let position = macAddressToCoordinate(
                item.mac_address, 
                item.currentPosition, 
                this.props.mapConfig.iconOptions.markerDispersity
            );

            /** Set the icon option*/

            item.iconOption = {

                ...this.iconOptions,

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColorInBigScreen(item, this.props.colorPanel),

                /** Set the pin size */
                // iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,
                currentPosition: item.currentPosition,

                /** Show the ordered on location pin */
                number: this.props.mapConfig.iconOptionsInBigScreen.showNumber && 
                        // this.props.mapConfig.isObjectShowNumber.includes(item.searchedObjectType) && 
                        item.searched 
                        ? ++counter 
                        : '',

                /** Set the color of ordered number */
                numberColor: this.props.mapConfig.iconColor.number,
            }

            const option = new L.AwesomeNumberMarkers (item.iconOption)
            let marker =  L.marker(position, {icon: option}).addTo(this.markersLayer)

            /** Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others */
            if (item.searched) marker.setZIndexOffset(1000);
        })

        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.createLegend(this.createLegendJSX());
    }

    render(){
        return (   
            <div id='mapid' style={{height: '90vh'}}/>
        )
    }
}

export default Map;

