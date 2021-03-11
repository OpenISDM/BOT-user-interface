import React from 'react'
import { AppContext } from '../../../context/AppContext'
import config from '../../../config'
import Map from '../../Map'
import PropTypes from 'prop-types'

class TabletMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const {
			locationMonitorConfig,
			proccessedTrackingData,
			pathObjectAcns,
			colorPanel,
			handleClosePath,
			lbeaconPosition,
			searchObjectArray,
			pinColorArray,
			handleShowPath,
			searchKey,
			showPath,
			getSearchKey,
		} = this.props

		const style = {
			mapForMobile: {
				// width: '90vw',
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
			mapBlock: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
		}

		return (
			<div style={style.mapForMobile}>
				<Map
					pathObjectAcns={pathObjectAcns}
					colorPanel={colorPanel}
					proccessedTrackingData={proccessedTrackingData}
					lbeaconPosition={lbeaconPosition}
					locationMonitorConfig={locationMonitorConfig}
					getSearchKey={getSearchKey}
					mapConfig={config.mapConfig}
					handleClosePath={handleClosePath}
					handleShowPath={handleShowPath}
					showPath={showPath}
					searchObjectArray={searchObjectArray}
					pinColorArray={pinColorArray}
					searchKey={searchKey}
				/>
			</div>
		)
	}
}

TabletMapContainer.propTypes = {
	locationMonitorConfig: PropTypes.object,
	proccessedTrackingData: PropTypes.array,
	pathObjectAcns: PropTypes.array,
	colorPanel: PropTypes.object,
	handleClosePath: PropTypes.func,
	lbeaconPosition: PropTypes.array,
	searchObjectArray: PropTypes.array,
	pinColorArray: PropTypes.array,
	handleShowPath: PropTypes.array,
	searchKey: PropTypes.array,
	showPath: PropTypes.bool,
	getSearchKey: PropTypes.func,
}

export default TabletMapContainer
