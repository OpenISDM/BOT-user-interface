import React from 'react'
import { Container } from 'react-bootstrap'
import config from '../../config'
import { AppContext } from '../../context/AppContext'

const About = () => {
	const { locale } = React.useContext(AppContext)

	return (
		<Container fluid className="mt-5">
			Build &nbsp;
			{config.VERSION}
			<div>{locale.texts.LICENCE}</div>
		</Container>
	)
}

export default About
