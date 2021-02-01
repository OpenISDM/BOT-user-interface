import React from 'react'
import { Row, Image } from 'react-bootstrap'
import BOTSearchbar from '../../presentational/BOTSearchbar'
import config from '../../../config'

const MobileSearchContainer = ({
	searchKey,
	getSearchKey,
	handleTouchMove,
	clearSearchResult,
	suggestData,
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

export default MobileSearchContainer
