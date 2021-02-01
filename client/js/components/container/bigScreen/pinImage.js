/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        pinImage.js

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

import { pinImage } from '../../../dataSrc'
const colorPinDir = pinImage

const black = `${colorPinDir}/Black.webp`
const darkblue = `${colorPinDir}/DarkBlue.webp`
const darkgrey = `${colorPinDir}/DarkGrey.webp`
const darkseagreen = `${colorPinDir}/DarkSeaGreen.webp`
const lavender = `${colorPinDir}/Lavender.webp`
const lightblue = `${colorPinDir}/lightblue.webp`
const lightyellow = `${colorPinDir}/LightYellow.webp`
const mistyrose = `${colorPinDir}/mistyrose.webp`
const orange = `${colorPinDir}/Orange.webp`
const orchid = `${colorPinDir}/Orchid.webp`
const red = `${colorPinDir}/Red.webp`
const slateblue = `${colorPinDir}/SlateBlue.webp`
const sos = `${colorPinDir}/sos.webp`
const tan = `${colorPinDir}/tan.webp`
const white = `${colorPinDir}/White.webp`
const yellowgreen = `${colorPinDir}/YellowGreen.webp`

export default {
	black,
	darkblue,
	darkgrey,
	darkseagreen,
	lavender,
	lightblue,
	lightyellow,
	mistyrose,
	orange,
	orchid,
	red,
	slateblue,
	sos,
	tan,
	white,
	yellowgreen,
}
export {
	black,
	darkblue,
	darkgrey,
	darkseagreen,
	lavender,
	lightblue,
	lightyellow,
	mistyrose,
	orange,
	orchid,
	red,
	slateblue,
	sos,
	tan,
	white,
	yellowgreen,
}
