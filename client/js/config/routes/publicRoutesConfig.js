/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        publicRoutesConfig.js

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
import routes from './routes'
// import SigninPage from '../../components/authentication/SigninPage';
// import ForgetPassword from '../../components/authentication/ForgetPassword';
// import ResetPassword from '../../components/authentication/ResetPassword';
// import ResetPasswordResult from '../../components/authentication/ResetPasswordResult';
// import SentPwdInstructionResult from '../../components/authentication/SentPwdInstructionResult';
import Loader from '../../components/presentational/Loader'

const ForgetPassword = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "forgetPassword" */
			'../../components/authentication/ForgetPassword'
		),
	loading: Loader,
})

const SigninPage = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "signinPage" */
			'../../components/authentication/SigninPage'
		),
	loading: Loader,
})

const ResetPassword = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "resetPassword" */
			'../../components/authentication/ResetPassword'
		),
	loading: Loader,
})

const ResetPasswordResult = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "resetPasswordResult" */
			'../../components/authentication/ResetPasswordResult'
		),
	loading: Loader,
})

const SentPwdInstructionResult = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "sentPwdInstructionResult" */
			'../../components/authentication/SentPwdInstructionResult'
		),
	loading: Loader,
})

const publicRoutesConfig = [
	{
		path: routes.LOGIN,
		component: SigninPage,
		exact: true,
	},
	{
		path: routes.FORGET_PASSWORD,
		component: ForgetPassword,
		exact: true,
	},
	{
		path: routes.RESET_PASSWORD,
		component: ResetPassword,
		exact: true,
	},
	{
		path: routes.RESET_PASSWORD_RESULT,
		component: ResetPasswordResult,
		exact: true,
	},
	{
		path: routes.RESET_PASSWORD_INSTRUCTION,
		component: SentPwdInstructionResult,
		exact: true,
	},
]

export default publicRoutesConfig
