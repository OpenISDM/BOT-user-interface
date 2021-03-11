import React, { useEffect, useContext } from 'react'
import SearchResultList from '../../SearchResultList'
import SearchContainer from '../../SearchContainer'
import { Row, Col } from 'react-bootstrap'
import InfoPrompt from '../../InfoPrompt'
import AuthenticationContext from '../../../context/AuthenticationContext'
import MapContainer from '../../MapContainer'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import PropTypes from 'prop-types'

const BrowserMainContainer = ({
	getSearchKey,
	lbeaconPosition,
	highlightSearchPanel,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	proccessedTrackingData,
	pathObjectAcns,
	isHighlightSearchPanel,
	locationMonitorConfig,
	searchObjectArray,
	pinColorArray,
	handleClick,
	showFoundResult,
	keywords,
	activeActionButtons,
	handleSearchTypeClick,
	handleShowPath,
}) => {
	const auth = useContext(AuthenticationContext)

	const searchResultListRef = React.useRef(null)

	useEffect(() => {
		// componentDidMount is here!
		disableBodyScroll(document.querySelector('mainContainer'))
		return () => {
			// componentWillUnmount is here!
			enableBodyScroll(document.querySelector('mainContainer'))
		}
	}, [])

	const style = {
		searchPanel: {
			margin: '0px',
			padding: '0px',
			border: '0px',
			maxWidth: '100%',
			zIndex: isHighlightSearchPanel ? 1060 : 1,
			borderRadius: 10,
		},
	}

	return (
		<div className="mx-1 my-1 overflow-hidden h-100">
			<Row
				id="mainContainer"
				className="d-flex w-100 justify-content-around mx-0 h-100"
			>
				<Col xs={12} sm={12} md={8} lg={8} xl={8}>
					<MapContainer
						pathObjectAcns={pathObjectAcns}
						proccessedTrackingData={proccessedTrackingData}
						searchKey={searchKey}
						searchResult={searchResult}
						handleClearButton={handleClick}
						handleClick={handleClick}
						getSearchKey={getSearchKey}
						lbeaconPosition={lbeaconPosition}
						locationMonitorConfig={locationMonitorConfig}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						searchResultListRef={searchResultListRef}
						activeActionButtons={activeActionButtons}
					/>
				</Col>
				<Col
					xs={12}
					sm={12}
					md={4}
					lg={4}
					xl={4}
					className="w-100 px-2 bg-white d-flex flex-column h-100"
					style={style.searchPanel}
				>
					<InfoPrompt
						searchKey={searchKey}
						searchResult={searchResult}
						handleClick={handleClick}
					/>
					<SearchContainer
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						keywords={keywords}
						handleSearchTypeClick={handleSearchTypeClick}
					/>
					<div id="searchResult">
						<SearchResultList
							searchResult={searchResult}
							searchKey={searchKey}
							highlightSearchPanel={highlightSearchPanel}
							showMobileMap={showMobileMap}
							searchObjectArray={searchObjectArray}
							pinColorArray={pinColorArray}
							showFoundResult={showFoundResult}
							ref={searchResultListRef}
							handleShowPath={handleShowPath}
						/>
					</div>
				</Col>
			</Row>
		</div>
	)
}

BrowserMainContainer.propTypes = {
	handleClearButton: PropTypes.func.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	lbeaconPosition: PropTypes.array.isRequired,
	highlightSearchPanel: PropTypes.func.isRequired,
	showMobileMap: PropTypes.bool.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
	searchKey: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	proccessedTrackingData: PropTypes.array.isRequired,
	pathObjectAcns: PropTypes.string.isRequired,
	isHighlightSearchPanel: PropTypes.bool.isRequired,
	locationMonitorConfig: PropTypes.object.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	handleClick: PropTypes.func.isRequired,
	showFoundResult: PropTypes.bool.isRequired,
	keywords: PropTypes.array.isRequired,
	activeActionButtons: PropTypes.array.isRequired,
	handleSearchTypeClick: PropTypes.func.isRequired,
	handleShowPath: PropTypes.func.isRequired,
}

export default BrowserMainContainer
