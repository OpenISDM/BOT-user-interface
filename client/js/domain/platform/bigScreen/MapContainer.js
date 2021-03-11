import React from 'react'
import Map from './Map'
import { AppContext } from '../../../context/AppContext'
import PropTypes from 'prop-types'
class MapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const style = {
			mapBlock: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
			},
		}

		const { stateReducer } = this.context

		const [{ areaId }] = stateReducer

		return (
			<div
				id="MapContainer"
				style={style.MapContainer}
				className="overflow-hidden"
			>
				<div style={style.mapBlock}>
					<Map
						areaId={areaId}
						legendDescriptor={this.props.legendDescriptor}
                        proccessedTrackingData={this.props.proccessedTrackingData}
					/>
				</div>
			</div>
		)
	}
}

MapContainer.PropTypes={
    legendDescriptor: PropTypes.array.isRequired,
    proccessedTrackingData : PropTypes.array.isRequired
}
export default MapContainer
