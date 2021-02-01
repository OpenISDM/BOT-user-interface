import React from 'react'
import { AppContext } from '../../context/AppContext'
import { CenterContainer } from '../BOTComponent/styleComponent'
import { Link } from 'react-router-dom'
import styleSheet from '../../config/styleSheet'

const imageLength = 160

const ResetPasswordResult = () => {
	const { locale } = React.useContext(AppContext)

	return (
		<CenterContainer
			style={{
				textAlign: 'center',
			}}
		>
			<div className="mb-2">
				<i
					className="fa fa-check-circle"
					aria-hidden="true"
					style={{
						fontSize: imageLength,
						color: styleSheet.theme,
					}}
				/>
			</div>
			<div className="mb-2">{locale.texts.PASSWORD_RESET_SUCCESSFUL}</div>
			<Link to={'/login'}>{locale.texts.SIGN_IN}</Link>
		</CenterContainer>
	)
}

export default ResetPasswordResult
