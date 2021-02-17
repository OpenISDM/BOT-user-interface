import React from 'react'
import { Row } from 'react-bootstrap'
import BOTSearchbar from '../../../components/BOTSearchbar'
import PropTypes from 'prop-types'

const MobileSearchContainer = ({
	searchKey,
	getSearchKey,
	handleTouchMove,
	clearSearchResult,
	keywords,
}) => {
	return (
		<div id="searchContainer" className="py-1" onTouchMove={handleTouchMove}>
			<Row
				id="searchBar"
				className="d-flex justify-content-center align-items-center my-4"
			>
				<BOTSearchbar
					placeholder={searchKey}
					getSearchKey={getSearchKey}
					clearSearchResult={clearSearchResult}
					width={400}
					suggestData={keywords}
				/>
			</Row>
		</div>
	)
}

MobileSearchContainer.propTypes = {
	searchKey: PropTypes.array,
	getSearchKey: PropTypes.func,
	handleTouchMove: PropTypes.func,
	clearSearchResult: PropTypes.func,
	keywords: PropTypes.array,
}

export default MobileSearchContainer
