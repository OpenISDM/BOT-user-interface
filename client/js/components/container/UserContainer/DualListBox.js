import React from 'react'
import ListBox from './ListBox'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

class DualListBox extends React.Component {
	generateSelectedRowsForListBox = () => {
		const { allItems = [], selectedItemList = {} } = this.props
		const items = (selectedItemList && selectedItemList.items) || []

		const selectedItem = allItems.filter((item) => {
			return items.includes(item.asset_control_number)
		})

		return selectedItem.map((item) => {
			return {
				acn: item.asset_control_number,
				onClick: () => {
					this.props.onUnselect(item)
				},
				label: (
					<div className="cursor-pointer">
						{item.name}, {item.asset_control_number}
					</div>
				),
			}
		})
	}

	generateUnselectedRowsForListBox = () => {
		const { allItems = [], selectedItemList = {} } = this.props
		const items = (selectedItemList && selectedItemList.items) || []
		const areaId = selectedItemList && selectedItemList.area_id

		const unselectedItem = allItems.filter((item) => {
			return (
				!items.includes(item.asset_control_number) &&
				item.list_id == null &&
				parseInt(item.area_id) === parseInt(areaId)
			)
		})

		const HTMLForUnselecteItem = unselectedItem.map((item) => {
			return {
				acn: item.asset_control_number,
				onClick: () => {
					this.props.onSelect(item)
				},
				label: (
					<div className="cursor-pointer">
						{item.name}, {item.asset_control_number}
					</div>
				),
			}
		})
		return HTMLForUnselecteItem
	}

	render() {
		const style = {
			listBox: {
				height: '70vh',
				overflowY: 'scroll',
			},
		}
		return (
			<div style={{ marginTop: '10px' }}>
				<Col>
					<Row>
						<Col sm>
							<h5 style={{ margin: '10px' }} className="text-center">
								{this.props.selectedTitle}
							</h5>
							<Row style={style.listBox} className="justify-content-md-center">
								<ListBox
									className="cursor-pointer"
									rows={this.generateSelectedRowsForListBox()}
								/>
							</Row>
						</Col>
						<Col sm>
							<h5 style={{ margin: '10px' }} className="text-center">
								{this.props.unselectedTitle}
							</h5>
							<Row style={style.listBox} className="justify-content-md-center">
								<ListBox rows={this.generateUnselectedRowsForListBox()} />
							</Row>
						</Col>
					</Row>
				</Col>
			</div>
		)
	}
}

DualListBox.propTypes = {
	allItems: PropTypes.array.isRequired,
	selectedItemList: PropTypes.array.isRequired,
	selectedTitle: PropTypes.string.isRequired,
	unselectedTitle: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired,
	onUnselect: PropTypes.func.isRequired,
}

export default DualListBox
