import React from 'react'
import SearchResultList from '../../SearchResultList'
import SearchContainer from '../../SearchContainer'
import AuthenticationContext from '../../../context/AuthenticationContext'
import MapContainer from '../../MapContainer'
import PropTypes from 'prop-types'

const TabletMainContainer = ({
	handleClearButton,
	getSearchKey,
	handleClosePath,
	handleShowPath,
	lbeaconPosition,
	authenticated,
	highlightSearchPanel,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	proccessedTrackingData,
	pathMacAddress,
}) => {
	const auth = React.useContext(AuthenticationContext)

	const style = {
		noResultDiv: {
			color: 'grey',
			fontSize: '1rem',
		},
		titleText: {
			color: 'rgb(80, 80, 80, 0.9)',
		},
	}

	return (
		<div
			id="page-wrap"
			className="d-flex flex-column w-100"
			style={{ height: '90vh' }}
		>
			<div id="mainContainer" className="d-flex flex-row h-100 w-100">
				<div className="d-flex flex-column" style={style.MapAndResult}>
					<div className="d-flex" style={style.MapAndQrcode}>
						<MapContainer
							pathMacAddress={pathMacAddress}
							proccessedTrackingData={proccessedTrackingData}
							searchResult={searchResult}
							handleClearButton={handleClearButton}
							getSearchKey={getSearchKey}
							lbeaconPosition={lbeaconPosition}
							searchKey={searchKey}
							authenticated={authenticated}
							handleClosePath={handleClosePath}
							handleShowPath={handleShowPath}
						/>
					</div>

					<div
						id="searchResult"
						className="d-flex"
						style={{ justifyContent: 'center' }}
					>
						<SearchResultList
							searchResult={searchResult}
							searchKey={searchKey}
							highlightSearchPanel={highlightSearchPanel}
							handleShowPath={handleShowPath}
							showMobileMap={showMobileMap}
						/>
					</div>
				</div>
				<div
					id="searchPanel"
					className="h-100"
					style={style.searchPanelForTablet}
				>
					<SearchContainer
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
					/>
				</div>
			</div>
		</div>
	)
}

TabletMainContainer.propTypes = {
	handleClearButton: PropTypes.func,
	getSearchKey: PropTypes.func,
	handleClosePath: PropTypes.func,
	handleShowPath: PropTypes.func,
	lbeaconPosition: PropTypes.array,
	authenticated: PropTypes.bool,
	highlightSearchPanel: PropTypes.func,
	showMobileMap: PropTypes.func,
	clearSearchResult: PropTypes.func,
	searchKey: PropTypes.array,
	searchResult: PropTypes.array,
	proccessedTrackingData: PropTypes.array,
	pathMacAddress: PropTypes.array,
}

export default TabletMainContainer
