import React from 'react'
import { Row, Image } from 'react-bootstrap'
import Searchbar from '../../../components/Searchbar'
import config from '../../../config'
import PropTypes from 'prop-types'

const TabletSearchContainer = ({
	searchKey,
	getSearchKey,
	handleTouchMove,
	clearSearchResult,
	suggestData,
}) => {
	return (
		<div id="searchContainer" className="py-1" onTouchMove={handleTouchMove}>
			<Image src={config.LOGO} rounded width={100} />
			<Row
				id="searchBar"
				className="d-flex justify-content-center align-items-center my-4"
			>
				<Searchbar
					placeholder={searchKey}
					getSearchKey={getSearchKey}
					clearSearchResult={clearSearchResult}
					width={300}
					suggestData={suggestData}
				/>
			</Row>
		</div>
	)
}

TabletSearchContainer.propTypes = {
	searchKey: PropTypes.object,
	getSearchKey: PropTypes.func,
	handleTouchMove: PropTypes.func,
	clearSearchResult: PropTypes.func,
	suggestData: PropTypes.array,
}

export default TabletSearchContainer
