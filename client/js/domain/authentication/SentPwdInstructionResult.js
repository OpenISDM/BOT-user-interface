import React from 'react'
import { AppContext } from '../../context/AppContext'
import { CenterContainer } from '../BOTComponent/styleComponent'
import styleSheet from '../../config/styleSheet'

const imageLength = 160

const SentPwdInstructionResult = () => {
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
			<div className="mb-2">
				{locale.texts.PASSWORD_RESET_INSTRUCTION_SUCCESSFUL}
			</div>
		</CenterContainer>
	)
}

export default SentPwdInstructionResult
