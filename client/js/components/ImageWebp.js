import React from 'react'
import PropTypes from 'prop-types'

const ImageWebp = ({ src, srcWebp, width, alt }) => {
	return (
		<picture>
			<source srcSet={srcWebp} type="image/jpeg" media="(min-width:650px)" />
			<img src={src} alt={alt} width={width} />
		</picture>
	)
}

ImageWebp.propTypes = {
	src: PropTypes.string.isRequired,
	srcWebp: PropTypes.string.isRequired,
	width: PropTypes.number,
	alt: PropTypes.string.isRequired,
}

export default ImageWebp
