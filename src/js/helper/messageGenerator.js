/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        messageGenerator.js

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


import React from 'react'
import ToastMessage from '../components/presentational/ToastMessage'
import { toast, Slide, Zoom, Flip} from 'react-toastify';

const setSuccessMessage = (
    msg 
) => {
    return (
        toast.success(<ToastMessage msg={msg}  />, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            className: 'toast-success-notice-container',
            bodyClassName: "toast-notice-body",
            hideProgressBar: true,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
            transition: Slide,
        })
    )
}

const setErrorMessage = (
    msg  
) => { 
    return (
        toast.success(<ToastMessage msg={'connect to database failed'} />, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
            className: 'toast-error-notice-container',
            bodyClassName: "toast-notice-body",
            hideProgressBar: true,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
            transition: Slide,
        })
    )
}

const importErrorMessage = (
    msg  ,
    hint
) => { 
    return (
        toast.success(<ToastMessage msg={msg} hint = {hint} />, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            className: 'toast-error-notice-container',
            bodyClassName: "toast-notice-body",
            hideProgressBar: true,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
            transition: Slide,
        })
    )
}

export default {
    setSuccessMessage,
    setErrorMessage,
    importErrorMessage
}