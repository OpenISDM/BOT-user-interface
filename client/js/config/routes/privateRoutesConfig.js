/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        privateRoutesConfig.js

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

import Loadable from 'react-loadable'
import Loader from '../../components/presentational/Loader'
import routes from './routes'

// import MainContainer from '../../components/container/menuContainer/MainContainer';
// import SystemSetting from '../../components/container/menuContainer/SystemSetting';
// import ObjectManagementContainer from '../../components/container/menuContainer/ObjectManagementContainer';
// import UserContainer from '../../components/container/menuContainer/UserContainer';
// import About from '../../components/container/About';
// import ContactTree from '../../components/container/menuContainer/ContactTree';
// import BigScreenContainer from "../../components/container/bigScreen/BigScreenContainer";
// import MonitorSettingContainer from "../../components/container/menuContainer/MonitorSettingContainer";
// import ReportContainer from "../../components/container/menuContainer/ReportContainer";
// import TrackingHistoryContainer from '../../components/container/menuContainer/TrackingHistoryContainer';
// import BOTAdminContainer from '../../components/container/menuContainer/BOTAdminContainer';

const ObjectManagementContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "ObjectManagementContainer" */
			'../../components/container/menuContainer/ObjectManagementContainer'
		),
	loading: Loader,
})

const UserContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "UserContainer" */
			'../../components/container/menuContainer/UserContainer'
		),
	loading: Loader,
})

const MainContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "MainContainer" */
			'../../components/container/menuContainer/MainContainer'
		),
	loading: Loader,
})

const SystemSetting = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "SystemSetting" */
			'../../components/container/menuContainer/SystemSetting'
		),
	loading: Loader,
})

const ReportContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "ReportContainer" */
			'../../components/container/menuContainer/ReportContainer'
		),
	loading: Loader,
})

const BOTAdminContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "BOTAdminContainer" */
			'../../components/container/menuContainer/BOTAdminContainer'
		),
	loading: Loader,
})

const About = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "About" */
			'../../components/container/About'
		),
	loading: Loader,
})

const privateRoutesConfig = [
	{
		path: routes.HOME,
		component: MainContainer,
		exact: true,
	},
	{
		path: routes.SETTINGS,
		component: SystemSetting,
		exact: true,
	},
	{
		path: routes.OBJECT_MANAGEMENT,
		component: ObjectManagementContainer,
		exact: true,
	},
	{
		path: routes.USER_SETTINGS,
		component: UserContainer,
		exact: true,
	},
	// {
	//     path: routes.BIG_SCREEN,
	//     component: BigScreenContainer,
	//     exact: true,
	// },
	{
		path: routes.ABOUT,
		component: About,
		exact: true,
	},
	// {
	//     path: routes.TRACE,
	//     component: TrackingHistoryContainer,
	//     exact: true,
	// },
	// {
	//     path: routes.CONTACT_TREE,
	//     component: ContactTree,
	//     exact: true,
	// },
	// {
	//     path: routes.MONITOR_SETTINGS,
	//     component: MonitorSettingContainer,
	//     exact: true,
	// },
	{
		path: routes.RECORDS,
		component: ReportContainer,
		exact: true,
	},
	{
		path: routes.BOT_ADMIN,
		component: BOTAdminContainer,
		exact: true,
	},
]

export const privateRouteParam = ['page', 'resetpassword']

export default privateRoutesConfig
