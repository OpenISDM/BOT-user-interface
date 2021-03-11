import React from 'react'
import SearchContainer from '../../SearchContainer'
import { AppContext } from '../../../context/AppContext'
import MapContainer from '../../MapContainer'
import PropTypes from 'prop-types'

const MobileMainContainer = ({
	getSearchKey,
	lbeaconPosition,
	showMobileMap,
	clearSearchResult,
	searchKey,
	searchResult,
	proccessedTrackingData,
	pathObjectAcns,
	locationMonitorConfig,
	searchObjectArray = [],
	pinColorArray,
	handleClick,
	keywords,
	display,
}) => {
	const { auth } = React.useContext(AppContext)

	const style = {
		searchPanelForMobile: {
			// zIndex: isHighlightSearchPanel ? 1060 : 1,
			display: display ? null : 'none',
			fontSize: '2rem',
			background: 'white',
			borderRadius: 10,
			//border: 'solid',
			height: '90vh',
			// width:'90vw'
		},
		mapForMobile: {
			display: showMobileMap ? null : 'none',
		},
	}

	return (
		<div
			id="page-wrap"
			className="d-flex flex-column"
			style={{ height: '90vh' }}
		>
			<div className="h-100" style={{ overflow: 'hidden hidden' }}>
				<div
					id="searchPanel"
					className="h-100"
					style={style.searchPanelForMobile}
				>
					<SearchContainer
						clearSearchResult={clearSearchResult}
						auth={auth}
						getSearchKey={getSearchKey}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						keywords={keywords}
					/>
				</div>
				<div style={style.mapForMobile} className="m-1">
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
					/>
				</div>
			</div>
		</div>
	)
}

MobileMainContainer.propTypes = {
	getSearchKey: PropTypes.func.isRequired,
	lbeaconPosition: PropTypes.array.isRequired,
	showMobileMap: PropTypes.bool,
	clearSearchResult: PropTypes.func,
	searchKey: PropTypes.array,
	searchResult: PropTypes.array,
	proccessedTrackingData: PropTypes.array,
	pathObjectAcns: PropTypes.array,
	locationMonitorConfig: PropTypes.object,
	searchObjectArray: PropTypes.array,
	pinColorArray: PropTypes.array,
	handleClick: PropTypes.func,
	keywords: PropTypes.array,
	display: PropTypes.bool,
}

export default MobileMainContainer
