import React from 'react';
import { Col, Row } from 'react-bootstrap';

import axios from 'axios';
import Cookies from 'js-cookie'
import LocaleContext from '../../../context/LocaleContext';
import dataSrc from "../../../dataSrc";

import AddableList from './AddableList'

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
                this.API.updateAddableList()
            },
            removeAllMyDevice: () => {
                this.device.myDevices = {}
                this.device.notMyDevices = this.device.dataMap
                this.API.updateAddableList()
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
                this.API.updateAddableList()
            },
            updateAddableList: () => {
                
                this.APIforAddableList_1.setList(this.device.myDevices)
                this.APIforAddableList_2.setList(this.device.notMyDevices)
                
            },
            postMyDeviceChange: (mode, acn) => {
                axios.post(dataSrc.modifyMyDevice, {
                    username: Cookies.get('user'),
                    mode: mode,
                    acn: acn
                }).then((res) => {
                    console.log('success')
                })
            }
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

                return <h3 name={index}>{item.access_control_number}:<br/>{item.name}, status is {item.status}</h3>
            }
        }


        this.getAPIfromAddableList_1 = this.getAPIfromAddableList_1.bind(this)
        this.getAPIfromAddableList_2 = this.getAPIfromAddableList_2.bind(this)
    }

    getAPIfromAddableList_1(API){
        var locale = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_1 = API

        this.APIforAddableList_1.setTitle(locale.MY_DEVICES)
        this.APIforAddableList_1.setValidation(validation)
        this.APIforAddableList_1.setItemLayout(itemLayout)
        this.APIforAddableList_1.setOnClick(onClick)
    }
    getAPIfromAddableList_2(API){
        var locale = this.context
        const {itemLayout, validation, onClick} = this.functionForAddableList
        this.APIforAddableList_2 = API
        this.APIforAddableList_2.setTitle(locale.OTHER_DEVICES)
        this.APIforAddableList_2.setValidation(validation)
        this.APIforAddableList_2.setItemLayout(itemLayout)
        this.APIforAddableList_2.setOnClick(onClick)
    }
    componentDidMount(){
        console.log(this.context)
        this.getObjectData()
    }
    componentDidUpdate(){
        var locale = this.context
        if(this.APIforAddableList_1) this.APIforAddableList_1.setTitle(locale.MY_DEVICES)
        if(this.APIforAddableList_2) this.APIforAddableList_2.setTitle(locale.OTHER_DEVICES)
    }
    shouldComponentUpdate(nexProps){
        return true
    }
    getObjectData() {
        axios.get(dataSrc.objectTable).then(res => {


            let data = res.data.rows
            var dataMap = {}

            for(var item of data){
                dataMap[item.access_control_number] = item
            }
            this.device.dataMap = dataMap
            // get My Device
            axios.post(dataSrc.userInfo, {
                username: Cookies.get('user')
            }).then((res) => {

                var myDeviceList
                if(res.data.rows.length === 0){
                    myDeviceList = []
                }else{
                    myDeviceList = res.data.rows[0].mydevice
                }
                
                var allDeviceList = Object.keys(dataMap)

                this.device.myDeviceList = myDeviceList
                var myDevices = {}, notMyDevices = {}
                for(var acn of allDeviceList){
                    if(myDeviceList.includes(acn)){
                        myDevices[acn] = dataMap[acn]
                    }else{
                        notMyDevices[acn] = dataMap[acn]
                    }
                }

                this.device.myDevices = myDevices
                this.device.notMyDevices = notMyDevices

                this.API.updateAddableList()

            }).catch()
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    
    render(){
        
        
        return (
            <Fragment>
                <Col xl={5}>
                    <AddableList
                        getAPI={this.getAPIfromAddableList_1}
                    />
                </Col>
                <Col xl={2} className='p-5' style={{position: 'relative', top: '15%'}}>

                        <i className="fas fa-angle-double-right fa-3x p-4" onClick = {this.API.removeAllMyDevice}></i>

                        <i className="fas fa-angle-double-left fa-3x p-4" onClick = {this.API.addAllMyDevice}></i>
                </Col>
                <Col xl={5}>
                    <AddableList
                        getAPI={this.getAPIfromAddableList_2}
                    />
                </Col>
            </Fragment>
        )
    }
}
MyDeviceManager.contextType = LocaleContext;