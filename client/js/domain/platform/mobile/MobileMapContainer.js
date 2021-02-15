import React from 'react'
import QRcodeContainer from '../../container/QRcode'
import { AppContext } from '../../../context/AppContext'
import InfoPrompt from '../../presentational/InfoPrompt'
import config from '../../../config'
import { Nav, Button } from 'react-bootstrap'
import AccessControl from '../../authentication/AccessControl'
import Map from '../../presentational/Map'

export default class TabletMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { locale, stateReducer, auth } = this.context

		const {
			locationMonitorConfig,
			proccessedTrackingData,
			showPdfDownloadForm,
			handleClickButton,
			authenticated,
			searchObjectArray,
			pinColorArray,
			searchKey,
			handleClick,
			getSearchKey,
		} = this.props

		const [{ area }] = stateReducer

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
					pathMacAddress={this.props.pathMacAddress}
					colorPanel={this.props.colorPanel}
					proccessedTrackingData={proccessedTrackingData}
					lbeaconPosition={this.props.lbeaconPosition}
					locationMonitorConfig={this.props.locationMonitorConfig}
					getSearchKey={this.props.getSearchKey}
					mapConfig={config.mapConfig}
					handleClosePath={this.props.handleClosePath}
					handleShowPath={this.props.handleShowPath}
					showPath={this.props.showPath}
					searchObjectArray={searchObjectArray}
					pinColorArray={pinColorArray}
					searchKey={searchKey}
					getSearchKey={getSearchKey}
				/>
			</div>
		)
	}
}
