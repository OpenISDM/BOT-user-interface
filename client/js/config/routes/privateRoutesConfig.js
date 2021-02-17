import Loadable from 'react-loadable'
import Loader from '../../domain/Loader'
import routes from './routes'

const ObjectManagementContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "ObjectManagementContainer" */
			'../../domain/ObjectManagementContainer'
		),
	loading: Loader,
})

const MainContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "MainContainer" */
			'../../domain/MainContainer'
		),
	loading: Loader,
})

const SystemSetting = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "SystemSetting" */
			'../../domain/SystemSetting'
		),
	loading: Loader,
})

const ReportContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "ReportContainer" */
			'../../domain/ReportContainer'
		),
	loading: Loader,
})

const BOTAdminContainer = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "BOTAdminContainer" */
			'../../domain/BOTAdminContainer'
		),
	loading: Loader,
})

const About = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "About" */
			'../../domain/About'
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
