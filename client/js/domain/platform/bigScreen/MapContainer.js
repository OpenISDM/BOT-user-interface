import React from 'react'
import Map from './Map'
import config from '../../../config'
import { AppContext } from '../../../context/AppContext'

class MapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { hasSearchKey } = this.props

		const style = {
			mapBlock: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
		}

		const { stateReducer } = this.context

		let [{ areaId }] = stateReducer

		return (
			<div
				id="MapContainer"
				style={style.MapContainer}
				className="overflow-hidden"
			>
				<div style={style.mapBlock}>
					<Map
						hasSearchKey={hasSearchKey}
						colorPanel={this.props.colorPanel}
						proccessedTrackingData={this.props.proccessedTrackingData}
						lbeaconPosition={this.props.lbeaconPosition}
						getSearchKey={this.props.getSearchKey}
						areaId={areaId}
						mapConfig={config.mapConfig}
						legendDescriptor={this.props.legendDescriptor}
					/>
				</div>
			</div>
		)
	}
}

export default MapContainer
