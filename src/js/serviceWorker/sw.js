/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        sw.js

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

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

let VERSION = 'v1.0 b.1958'

self.VERSION = VERSION
self.__WB_MANIFEST

let precacheList = self.__WB_MANIFEST || [
    {url: '/index.html', revision: VERSION },
    {url: '/manifest.webmanifest', revision: VERSION},
    {url: '/css/main.css', revision: VERSION},
    {url: '/js/main.bundle.js', revision: VERSION},
]

precacheAndRoute(precacheList)

registerRoute (
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images'
    }),
);

registerRoute (
    ({request}) => request.destination === 'style',
    new CacheFirst({
        cacheName: 'style'
    }),
);


registerRoute (
    ({request}) => request.destination === 'script',
    new CacheFirst({
        cacheName: 'script'
    }),
);


self.addEventListener('install', () => {
    if (process.env.NODE_ENV == 'development') {
        self.skipWaiting()
    }
})
