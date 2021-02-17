import Loadable from 'react-loadable'
import routes from './routes'
import Loader from '../../domain/Loader'

const ForgetPassword = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "forgetPassword" */
			'../../domain/ForgetPassword'
		),
	loading: Loader,
})

const SigninPage = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "signinPage" */
			'../../domain/SigninPage'
		),
	loading: Loader,
})

const ResetPassword = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "resetPassword" */
			'../../domain/ResetPassword'
		),
	loading: Loader,
})

const ResetPasswordResult = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "resetPasswordResult" */
			'../../domain/ResetPasswordResult'
		),
	loading: Loader,
})

const SentPwdInstructionResult = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "sentPwdInstructionResult" */
			'../../domain/SentPwdInstructionResult'
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
