import React from 'react'
import ReactLoading from 'react-loading'
import { LoaderWrapper } from '../components/StyleComponents'
import styleSheet from '../config/styleSheet'
import PropTypes from 'prop-types'

const Loader = ({ backdrop = true }) => {
	return (
		<LoaderWrapper backdrop={backdrop}>
			<ReactLoading type={'bubbles'} color={styleSheet.theme} />
		</LoaderWrapper>
	)
}

Loader.propTypes = {
	backdrop: PropTypes.bool,
}

export default Loader
