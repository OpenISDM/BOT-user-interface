import React from 'react'
import 'react-table/react-table.css'
import { Row, Col } from 'react-bootstrap'
import MapContainer from './MapContainer'
import config from '../../../config'
import axios from 'axios'
import dataSrc from '../../../dataSrc'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'

class BigScreenContainer extends React.Component {
	static contextType = AppContext

	state = {
		trackingData: [],
		legendDescriptor: [],
	}

	componentDidMount = () => {
		this.getTrackingData()
		this.interval = setInterval(
			this.getTrackingData,
			config.mapConfig.intervalTime
		)
	}

	componentWillUnmount = () => {
		clearInterval(this.interval)
	}

	addSearchedIndex = (trackingData, searchQueues) => {
		// console.log(trackingData)
		// console
		searchQueues.map((queue, index) => {
			// console.log(queue)
			// console.log(index)
			trackingData = trackingData
				.filter((item) => {
					return item.found && item.currentPosition && item.object_type == 0
				})
				.map((item) => {
					if (item.type == queue.key_word) {
						item.searched = index + 1
						item.pinColor = queue.pin_color_index
					}
					return item
				})
		})

		trackingData = trackingData.map((item) => {
			if (item.searched == undefined) {
				item.searched = -1
				item.pinColor = -1
			}
			return item
		})

		return trackingData
	}

	countItemsInQueue = (data, index) => {
		const count = data.filter((item) => {
			return item.searched == index + 1
		}).length
		return count
	}

	getTrackingData = async () => {
		const { stateReducer } = this.context
		const [{ area }] = stateReducer

		const res = await apiHelper.trackingDataApiAgent.getTrackingData({
			areaIds: [area.id],
		})
		if (res) {
			axios.post(dataSrc.getSearchQueue).then((searchQueue) => {
				const rawTrackingData = res.data
				const queue = searchQueue.data.rows

				// used for legend, with text description and image icon
				const trackingData = this.addSearchedIndex(rawTrackingData, queue)

				const legendDescriptor = queue.map((queue1, index) => {
					return {
						text: queue1.key_word,
						pinColor:
							config.mapConfig.iconColor.pinColorArray[queue1.pin_color_index],
						itemCount: this.countItemsInQueue(trackingData, index),
					}
				})

				this.setState({
					trackingData,
					legendDescriptor,
				})
			})
		}
	}

	render() {
		const style = {
			pageWrap: {
				overflow: 'hidden hidden',
			},
		}

		return (
			/** "page-wrap" the default id named by react-burget-menu */
			<div id="page-wrap" className="mx-1 my-2" style={style.pageWrap}>
				<Row
					id="bigScreenContainer"
					className="d-flex w-100 justify-content-around mx-0 overflow-hidden"
					style={style.container}
				>
					<Col id="searchMap" className="pl-2 pr-1">
						<MapContainer
							proccessedTrackingData={this.state.trackingData}
							legendDescriptor={this.state.legendDescriptor}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}

export default BigScreenContainer
