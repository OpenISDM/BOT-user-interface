import React from 'react'

const ImageWebp = ({ src, srcWebp, width, alt }) => {
	return (
		<picture>
			<source srcSet={srcWebp} type="image/jpeg" media="(min-width:650px)" />
			<img src={src} alt={alt} width={width} />
		</picture>
	)
}

export default ImageWebp
