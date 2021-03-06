import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Searchbar from '../../../components/Searchbar'
import FrequentSearch from '../../FrequentSearch'
import ObjectTypeList from '../../ObjectTypeList'
import PropTypes from 'prop-types'

const BrowserSearchContainer = ({
	searchKey,
	personObjectTypes,
	deviceObjectTypes,
	deviceNamedList,
	personNamedList,
	getSearchKey,
	handleTouchMove,
	clearSearchResult,
	searchObjectArray,
	pinColorArray,
	keywords,
	handleSearchTypeClick,
}) => {
	return (
		<div
			id="searchContainer"
			className="py-2 mt-5"
			onTouchMove={handleTouchMove}
		>
			<Row
				id="searchBar"
				className="d-flex justify-content-center align-items-center pb-2"
			>
				<Searchbar
					placeholder={searchKey}
					getSearchKey={getSearchKey}
					clearSearchResult={clearSearchResult}
					width={400}
					suggestData={keywords}
				/>
			</Row>
			<Row>
				<Col xs={4} sm={4} md={4} lg={4} xl={4} style={{ paddingRight: '0px' }}>
					<FrequentSearch
						getSearchKey={getSearchKey}
						clearSearchResult={clearSearchResult}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						handleSearchTypeClick={handleSearchTypeClick}
					/>
				</Col>
				<Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ paddingLeft: '0px' }}>
					<ObjectTypeList
						getSearchKey={getSearchKey}
						clearSearchResult={clearSearchResult}
						personObjectTypes={personObjectTypes}
						deviceObjectTypes={deviceObjectTypes}
						personNamedList={personNamedList}
						deviceNamedList={deviceNamedList}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
					/>
				</Col>
			</Row>
		</div>
	)
}

BrowserSearchContainer.propTypes = {
	searchKey: PropTypes.object.isRequired,
	personObjectTypes: PropTypes.array.isRequired,
	deviceObjectTypes: PropTypes.array.isRequired,
	personNamedList: PropTypes.array.isRequired,
	deviceNamedList: PropTypes.array.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	handleTouchMove: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	keywords: PropTypes.array.isRequired,
	handleSearchTypeClick: PropTypes.func.isRequired,
}

export default BrowserSearchContainer
