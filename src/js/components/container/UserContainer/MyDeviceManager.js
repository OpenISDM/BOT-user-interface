import React from 'react';
import { Col, Row } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'
import AxiosFunction from './AxiosFunction';

const Fragment = React.Fragment;

export default class MyDeviceManager extends React.Component{

    constructor() {
        super();
        this.state = {
           
        }
        this.device = {
            dataMap: null,
            myDeviceList: [],
            myDevices: [],
            notMyDevices: []
        }
        this.APIforAddableList_1 = null
        this.APIforAddableList_2 = null

        this.API = {
            setAllDevice: (deviceList) => {
                this.API.allDevices = deviceList
            },
            setMyDevice: (myList) => {
                this.API.myDevices = myList
            },
            addAllMyDevice: () => {
                this.device.notMyDevices = {}
                this.device.myDevices = this.device.dataMap
                this.API.postMyDeviceChange('add', 'all')               
            },
            removeAllMyDevice: () => {
                this.device.myDevices = {}
                this.device.notMyDevices = this.device.dataMap
                this.API.postMyDeviceChange('remove', 'all')
                
            },
            switchDevice: (acn) => {
                if(acn in this.device.myDevices){
                    this.device.notMyDevices[acn] = this.device.dataMap[acn]
                    delete this.device.myDevices[acn] 
                    this.API.postMyDeviceChange('remove', acn)
                }else if(acn in this.device.notMyDevices){
                    this.device.myDevices[acn] = this.device.dataMap[acn]
                    delete this.device.notMyDevices[acn] 
                    this.API.postMyDeviceChange('add', acn)
                }else{
                    console.error('acn is not in device list')
                }
            },
            updateAddableList: () => {
                
                this.APIforAddableList_1.setList(this.device.myDevices || [])
                this.APIforAddableList_2.setList(this.device.notMyDevices || [])
                
            },
            postMyDeviceChange: (mode, acn) => {
                var Info = {
                    username: Cookies.get('user'),
                    mode: mode,
                    acn: acn
                }
                AxiosFunction.modifyUserDevice(Info,(err, res) => {
                    if(err){
                        console.log(err)
                    }else{
                        this.getObjectData()
                        console.log('success')
                    }
                })
            },  
        }

        this.functionForAddableList = {
            onClick: (e) => {
                var acn = e.target.getAttribute('name')
                this.API.switchDevice(acn)
            },
            validation: (string) => {
                var re = /^\s*(?<acn>\d{4}-\d{4}-\d{4})\s*$/
                var match = string.match(re)
                if(match){
                    return match.groups['acn']
                }else{
                    return null
                }
            },
            itemLayout: (item, index) => {
                return <h5 name={index}>{item.name}, Type {item.type}, ACN {item.access_control_number}</h5>
            }
        }
        this.getAPIfromAddableList_1 = this.getAPIfromAddableList_1.bind(this)
        this.getAPIfromAddableList_2 = this.getAPIfromAddableList_2.bind(this)
    }

    getAPIfromAddableList_1(API){
        var locale = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_1 = API
        this.APIforAddableList_1.setTitle(<h4>{locale.MY_DEVICES}</h4>)
        this.APIforAddableList_1.setValidation(validation)
        this.APIforAddableList_1.setItemLayout(itemLayout)
        this.APIforAddableList_1.setOnClick(onClick)
    }
    getAPIfromAddableList_2(API){
        var locale = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_2 = API
        this.APIforAddableList_2.setTitle(<h4>{locale.OTHER_DEVICES}</h4>)
        this.APIforAddableList_2.setValidation(validation)
        this.APIforAddableList_2.setItemLayout(itemLayout)
        this.APIforAddableList_2.setOnClick(onClick)
    }
    componentDidMount(){
        this.getObjectData()
    }
    componentDidUpdate(){
        var locale = this.context
        if(this.APIforAddableList_1) this.APIforAddableList_1.setTitle(<h4>{locale.MY_DEVICES}</h4>)
        if(this.APIforAddableList_2) this.APIforAddableList_2.setTitle(<h4>{locale.OTHER_DEVICES}</h4>)
    }
    seperateMyDevice(dataMap, myDeviceList){
        var allDeviceList = Object.keys(dataMap), myDevices = {}, notMyDevices = {}
        for(var acn of allDeviceList){
            myDeviceList.includes(acn) ? myDevices[acn] = dataMap[acn] : notMyDevices[acn] = dataMap[acn]
        }
        return {
            myDevices: myDevices,
            notMyDevices: notMyDevices
        }
    }
    getObjectData() {
        AxiosFunction.getObjectData(null, 
            (err, res) => {
                var dataMap = res
                var Info = {
                    username: Cookies.get('user')
                }
                var callBack = (err, res) => {
                    if(err){
                        console.error(err)
                    }else{
                        var myDeviceList = res.mydevice || []
                        
                        var { myDevices, notMyDevices } = this.seperateMyDevice(dataMap, myDeviceList)

                        this.device = {
                            ...this.device,
                            dataMap,
                            myDeviceList,
                            myDevices,
                            notMyDevices,
                        }
                        
                        this.API.updateAddableList()
                    }
                }
                var option = {
                    extract: ['mydevice'],
                    default: []
                }
                AxiosFunction.userInfo(Info, callBack, option)
            }, 
            {
                key: 'access_control_number',
                default: []
            }
        )
    }
    render(){
        return (
            <div className="w-100 d-flex" style={{height: '75vh'}}>
                <Col xl={5}>
                    <AddableList
                        getAPI={this.getAPIfromAddableList_1}
                        addableListStyle={{
                            height: '70vh'
                        }}
                    />
                </Col>
                <Col xl={2} className='h-100 d-flex justify-content-center align-items-center'>
                    <div className="my-auto">
                        <div>
                            <i className="fas fa-angle-double-right fa-3x py-3" onClick = {this.API.removeAllMyDevice}></i>
                        </div>
                        <div>
                            <i className="fas fa-angle-double-left fa-3x py-3" onClick = {this.API.addAllMyDevice}></i>
                        </div>
                    </div>
                    
                </Col>
                <Col xl={5}>
                    <AddableList
                        getAPI={this.getAPIfromAddableList_2}
                        addableListStyle={{
                            height: '70vh'
                        }}
                    />
                </Col>
            </div>
        )
    }
}
MyDeviceManager.contextType = LocaleContext;