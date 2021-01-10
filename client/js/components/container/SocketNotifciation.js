/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        SocketNotifciation.js

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

import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SocketNotifciation = () => {
	const [ws, setWs] = useState(null)

	const connectWebSocket = () => {
		//開啟
		setWs(io())
	}

	useEffect(() => {
		if (ws) {
			//連線成功在 console 中打印訊息
			console.log('success connect!')
			//設定監聽
			initWebSocket()
		}
	}, [ws])

	const initWebSocket = () => {
		//對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
		ws.on('getMessage', (message) => {
			console.log(message)
		})
	}

	const sendMessage = () => {
		//以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
		ws.emit('getMessage', '只回傳給發送訊息的 client')
	}

	return (
		<div>
			<input type="button" value="連線" onClick={connectWebSocket} />
			<input type="button" value="送出訊息" onClick={sendMessage} />
		</div>
	)
}

// ReactDom.render(<Main />, document.getElementById('root'))

export default SocketNotifciation
