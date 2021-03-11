import React from 'react'
import 'react-table/react-table.css'
import { Row, Col } from 'react-bootstrap'
import MapContainer from './MapContainer'
import config from '../../../config'
import API from '../../../api'
import { AppContext } from '../../../context/AppContext'

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
		searchQueues.map((queue, index) => {
			trackingData = trackingData
				.filter((item) => {
					return item.found && item.currentPosition && item.object_type === 0
				})
				.map((item) => {
					if (item.type === queue.key_word) {
						item.searched = index + 1
						item.pinColor = queue.pin_color_index
					}
					return item
				})
		})

		trackingData = trackingData.map((item) => {
			if (item.searched === undefined) {
				item.searched = -1
				item.pinColor = -1
			}
			return item
		})

		return trackingData
	}

	countItemsInQueue = (data, index) => {
		return data.filter((item) => {
			return item.searched === index + 1
		}).length
	}

	getTrackingData = async () => {
		const {  locale, stateReducer } = this.context
		const [{ areaId }] = stateReducer
		try {
			const trackingDataPromise = API.Tracking.getTrackingData({
				locale,
				areaIds: areaId,
			})

			const searchResultQueuePromise = API.Tracking.getSearchQueue()

			const [trackingDataRes, searchResultQueueRes] = Promise.all([
				trackingDataPromise,
				searchResultQueuePromise,
			])

			const trackingData = this.addSearchedIndex(
				trackingDataRes.data,
				searchResultQueueRes.data.rows
			)

			const legendDescriptor = searchResultQueueRes.data.rows.map(
				(item, index) => {
					return {
						text: item.key_word,
						pinColor:
							config.mapConfig.iconColor.pinColorArray[item.pin_color_index],
						itemCount: this.countItemsInQueue(trackingData, index),
					}
				}
			)

			this.setState({
				trackingData,
				legendDescriptor,
			})
		} catch (e) {
			console.log(`get Tracking data failed : ${e}`)
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