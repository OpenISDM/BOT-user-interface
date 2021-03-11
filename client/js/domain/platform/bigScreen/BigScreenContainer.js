/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BigScreenContainer.js

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
import 'react-table/react-table.css';
import { 
    Row, 
    Col 
} from 'react-bootstrap'
import MapContainer from './MapContainer';
import config from '../../../config';
import axios from 'axios';
import dataSrc from '../../../dataSrc'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper';

class BigScreenContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        legendDescriptor: [],
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.interval = setInterval(this.getTrackingData, config.mapConfig.intervalTime)
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    addSearchedIndex = (trackingData, searchQueues) => {
        // console.log(trackingData)
        // console
        searchQueues.map((queue, index) => {
            // console.log(queue)
            // console.log(index)
            trackingData = trackingData.filter(item => {
                return (
                    item.found && 
                    item.currentPosition &&
                    item.object_type == 0
                )
            })
            .map(item=> {
                if (item.type == queue.key_word) {
                    item.searched = index + 1
                    item.pinColor = queue.pin_color_index
                }
                return item
            })
        })

        trackingData = trackingData.map(item => {
            if(item.searched === undefined){
                item.searched = -1
                item.pinColor = -1
            }
            return item
        })


        return trackingData
    } 

    countItemsInQueue = (data, index) => {
        
        var count = data.filter(item => {
            return item.searched == index + 1
        }).length
        return count
    }

    getTrackingData = () => {
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer

        apiHelper.trackingDataApiAgent.getTrackingData({
            locale: locale.abbr,
            user: auth.user,
            areaId
        })
        .then(res => {
            axios.post(dataSrc.getSearchQueue)
                .then(searchQueue => {

                    const rawTrackingData = res.data
                    const queue = searchQueue.data.rows

                    // used for legend, with text description and image icon
                    var trackingData = this.addSearchedIndex(rawTrackingData, queue)

                    var legendDescriptor = queue.map((queue1, index) => {
                        return {
                            text: queue1.key_word,
                            pinColor: config.mapConfig.iconColor.pinColorArray[queue1.pin_color_index],
                            itemCount:  this.countItemsInQueue(trackingData, index)
                        }    
                    })                

                    this.setState({
                        trackingData,
                        legendDescriptor,
                    })
                })
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)
        })
    }
    
    render(){

        const style = {
            pageWrap: {
                overflow: "hidden hidden",
            },
        }
        
        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" 
                className='mx-1 my-2' 
                style={style.pageWrap} 
            >
                <Row id="bigScreenContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                    <Col id='searchMap' className="pl-2 pr-1" >
                        <MapContainer 
                            proccessedTrackingData={this.state.trackingData}
                            legendDescriptor = {this.state.legendDescriptor}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BigScreenContainer




