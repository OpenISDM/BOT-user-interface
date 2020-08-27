/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        pageModules.js

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
import UserProfile from '../components/container/UserContainer/UserProfile';
import LBeaconTable from '../components/container/LBeaconTable';
import GatewayTable from '../components/container/GatewayTable';
import AdminManagementContainer from '../components/container/UserContainer/AdminManagementContainer';
import config from '../config';
// import TransferredLocationManagement from '../components/container/TransferredLocationManagement';
import RolePermissionManagement from '../components/container/RolePermissionManagement';
import MyDeviceManager from '../components/container/UserContainer/MyDeviceManager';
import DeviceGroupManager from '../components/container/UserContainer/DeviceGroupManager';
import MyPatientManager from '../components/container/UserContainer/MyPatientManager';
import PatientGroupManager from '../components/container/UserContainer/PatientGroupManager';
import MonitorSettingBlock from '../components/container/MonitorSettingBlock';
import GeoFenceSettingBlock from '../components/container/GeoFenceSettingBlock';
import ObjectEditedRecord from '../components/container/UserContainer/ObjectEditedRecord';
import ShiftChangeRecord from '../components/container/UserContainer/ShiftChangeRecord';
import TrackingTable from '../components/container/TrackingTable';
import TraceContainer from '../components/container/menuContainer/TraceContainer';
import BOTAdmin from '../components/container/menuContainer/BOTAdminContainer';
import routes from '../config/routes/routes';
import Loadable from 'react-loadable';
import Loader from '../components/presentational/Loader';
import GeneralSettings from '../components/container/menuContainer/GeneralSettings';

const TransferredLocationManagement = Loadable({
    loader: () => import(
        /* webpackChunkName: "TransferredLocationManagement" */
        '../components/container/TransferredLocationManagement'
    ),
    loading: Loader
});


export const userContainerModule = {

    title: "user profile",

    defaultActiveKey: "user_profile",

    tabList: [
        {
            name: 'user profile',
            path: 'userProfile',
            href: '#UserProfile',
            component: (props) => <UserProfile />
        },
        {
            name: 'devices management',
            path: 'devicesManagement',
            href: '#DevicesManagement',
            component: (props) => <MyDeviceManager />
        },
        {
            name: 'patient management',
            path: 'patientManagement',
            href: '#PatientManagement',
            component: (props) => <MyPatientManager />
        },
    ],
}

export const settingModule = {

    title: 'settings',

    defaultActiveKey: 'user_profile',

    path: routes.SETTINGS,

    tabList: [
        {
            name: 'user profile',
            component: (props) => <UserProfile />
        },
        {
            name: 'general settings',
            component: (props) => <GeneralSettings />
        },
        {
            name: "lbeacon",
            component: (props) => <LBeaconTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
            permission: "route:lbeacon",
        },
        {
            name: "gateway",
            component: (props) => <GatewayTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
            permission: "route:gateway",

        },
        {
            name: "monitor settings",
            alias: "monitor",
            path: "/page/monitor",
            module: monitorSettingModule,
            permission: "route:monitor",
            platform: ['browser', 'tablet'],
            component: (props) => <GeoFenceSettingBlock {...props}/>
            
        },
        // {
        //     name: "transferred location management",
        //     component: (props) => <TransferredLocationManagement {...props}/>,
        //     platform: ['browser'],
        // },
        // {
        //     name: "Role Permission Management",
        //     permission: "rolePermissionManagement",
        //     component: (props) => <RolePermissionManagement {...props}/>,
        //     platform: ['browser']
        // },
        // {
        //     name: "monitor setting",
        //     alias: "monitor",
        //     path: "/page/monitor",
        //     module: monitorSettingModule,
        //     permission: "route:monitor",
        //     platform: ['browser', 'tablet']
        // },
    ]
}

export const monitorSettingModule= {
    
    title: "monitor setting",

    defaultActiveKey: "movement_monitor",

    path: routes.MONITOR_SETTINGS,

    tabList: [
        // {
        //     name: config.monitorSettingType.MOVEMENT_MONITOR,
        //     component: (props) => <MonitorSettingBlock {...props}/>
        // },
        // {
        //     name: config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
        //     component: (props) => <MonitorSettingBlock {...props}/>
        // },
        // {
        //     name: config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
        //     component: (props) => <MonitorSettingBlock {...props}/>
        // },
        {
            name: config.monitorSettingType.GEOFENCE_MONITOR,
            component: (props) => <GeoFenceSettingBlock {...props}/>
        },
    ]
}

export const trackingHistoryContainerModule = {

    title: "tracking history",

    defaultActiveKey: "real_time_record",

    path: routes.TRACE,
    
    tabList: [
        {
            name: 'real time record',
            permission: "route:trackingHistory",
            component: (props) => <TrackingTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'historical record',
            permission: "route:trackingHistory",
            component: (props) => <TraceContainer {...props}/>,
            platform: ['browser', 'tablet'],
        },
    ]
}

export const reportContainerModule = {
    
    title: "report",

    defaultActiveKey: "object_edited_record",

    path: routes.RECORDS,
    
    tabList: [
        {
            name: 'Generate and View Shift Change Record',
            component: (props) => <ShiftChangeRecord {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'notes on patients',
            component: (props) => null,
            platform: ['browser', 'tablet', 'mobile'],
        },
        {
            name: 'device transfer record',
            component: (props) => <ObjectEditedRecord {...props} />,
            platform: ['browser', 'tablet', 'mobile'],
        },
        // {
        //     name: 'device service request',
        //     component: (props) => null,
        //     platform: ['browser', 'tablet', 'mobile'],
        // },
        {
            name: 'object tracking',
            component: (props) => <TrackingTable {...props}/>,
            platform: ['browser', 'tablet', 'mobile'],
        },
        // {
        //     name: 'object edited record',
        //     component: (props) => <ObjectEditedRecord {...props} />,
        //     platform: ['browser', 'tablet', 'mobile'],
        // },
        {
            name: 'asset usage',
            component: (props) => null,
            platform: ['browser', 'tablet', 'mobile'],
        },
    ],

}

export const BOTAdminModule = { 

    title: 'BOT admin',

    defaultActiveKey: 'user_manager',

    path: routes.BOT_ADMIN,

    tabList: [
        {
            name: 'user manager',
            permission: "route:bigScreen",
            component: (props) => <AdminManagementContainer {...props}/>,
            platform: ['browser', 'tablet'],
        },
        {
            name: 'devices management',
            path: 'devicesManagement',
            href: '#DevicesManagement',
            // component: (props) => <MyDeviceManager />
            component: (props) => <DeviceGroupManager />
        },
        {
            name: 'patient management',
            path: 'patientManagement',
            href: '#PatientManagement',
            // component: (props) => <MyPatientManager />
            component: (props) => <PatientGroupManager />
        },
        {
            name: "transferred location management",
            component: (props) => <TransferredLocationManagement {...props}/>,
            platform: ['browser'],
        },
        {
            name: "Role Permission Management",
            permission: "rolePermissionManagement",
            component: (props) => <RolePermissionManagement {...props}/>,
            platform: ['browser']
        },
        // {
        //     name: "lbeacon",
        //     component: (props) => <LBeaconTable {...props}/>,
        //     platform: ['browser', 'tablet', 'mobile']
        // },
        // {
        //     name: "gateway",
        //     component: (props) => <GatewayTable {...props}/>,
        //     platform: ['browser', 'tablet', 'mobile']
        // }
    ]
}

export const navbarNavList = [
    {
        name: 'home',
        alias: 'home',
        path: routes.HOME,
        hasEvent: true
    },
    // {
    //     name: "shift change",
    //     alias: "shift change",
    //     // path: "/",
    //     permission: "user:shiftChange",
    //     platform: ['browser', 'tablet'],
    //     hasEvent: true
    // },
    {
        name: 'object management',
        alias: 'objectManagement',
        path: routes.OBJECT_MANAGEMENT,
        permission: 'route:objectManagement',
        hasEvent: true
    },
    {
        name: "BOT Admin",
        alias: "BOTAdmin",
        path: routes.BOT_ADMIN,
        module: BOTAdminModule,
        permission: "route:BOTAdmin",
        platform: ['browser', 'tablet', 'mobile'],
    },
    {
        name: "record",
        alias: "record",
        path: routes.RECORDS,
        module: reportContainerModule,
        permission: "route:report",
        platform: ['browser', 'tablet', 'mobile'],
    },
    {
        name: "settings",
        alias: "settings",
        path: routes.SETTINGS,
        module: settingModule,
        platform: ['browser', 'tablet', 'mobile'],
    },
    
    // {
    //     name: 'tracking history',
    //     alias: 'trackinghistory',
    //     path: '/page/trace',
    //     module: trackingHistoryContainerModule,
    //     permission: 'route:trackingHistory',
    // },
    // {
    //     name: "monitor setting",
    //     alias: "monitor",
    //     path: "/page/monitor",
    //     module: monitorSettingModule,
    //     permission: "route:monitor",
    //     platform: ['browser', 'tablet']
    // },
    // {
    //     name: 'contact tree',
    //     alias: 'contactTree',
    //     path: '/page/contactTree',
    //     permission: 'route:contactTree',
    //     platform: ['browser']
    // },
]
