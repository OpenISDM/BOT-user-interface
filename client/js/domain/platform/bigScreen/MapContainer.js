/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MapContainer.js

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


import React from "react";
import Map from "./Map";
import config from "../../../config";
import { AppContext } from "../../../context/AppContext";

class MapContainer extends React.Component {

    static contextType = AppContext

    render(){
        const { 
            hasSearchKey,
        } = this.props;

        const style = {
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
            },
        }
        
        const { 
            stateReducer
        } = this.context;

        let [{areaId}] = stateReducer

        return(
            <div id="MapContainer" style={style.MapContainer} className="overflow-hidden">
                <div style={style.mapBlock}>
                    <Map 
                        hasSearchKey={hasSearchKey}
                        colorPanel={this.props.colorPanel}
                        proccessedTrackingData={this.props.proccessedTrackingData}
                        lbeaconPosition={this.props.lbeaconPosition}
                        getSearchKey={this.props.getSearchKey}
                        areaId={areaId}
                        mapConfig={config.mapConfig}
                        legendDescriptor = {this.props.legendDescriptor}
                    />
                </div>
            </div>
        )
    }
}

export default MapContainer