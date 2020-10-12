import React from 'react'
import ListBox from './ListBox'
import { Col, Row } from 'react-bootstrap'

const Fragment = React.Fragment
class DualListBox extends React.Component {
	generateSelectedRowsForListBox = () => {
		let { allItems, selectedItemList } = this.props

		allItems = allItems || []
		selectedItemList.items = selectedItemList.items || []

		const selectedItem = allItems.filter((item) => {
			return selectedItemList.items.includes(item.asset_control_number)
		})

		const HTMLForSelecteItem = selectedItem.map((item) => {
			return {
				acn: item.asset_control_number,
				onClick: () => {
					this.onUnselect(item)
				},
				label: (
					<div className="cursor-pointer">
						{item.name}, {item.asset_control_number}
					</div>
				),
			}
		})
		return HTMLForSelecteItem
	}

	generateUnselectedRowsForListBox = () => {
		let { allItems, selectedItemList } = this.props

		allItems = allItems || []
		selectedItemList.items = selectedItemList.items || []

		const unselectedItem = allItems.filter((item) => {
			return (
				!selectedItemList.items.includes(item.asset_control_number) &&
				item.list_id == null &&
				item.area_id == selectedItemList.area_id
			)
		})

		const HTMLForUnselecteItem = unselectedItem.map((item) => {
			return {
				acn: item.asset_control_number,
				onClick: () => {
					this.onSelect(item)
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
	onSelect = (item) => {
		if (this.props.onSelect) {
			this.props.onSelect(item)
		}
	}
	onUnselect = (item) => {
		if (this.props.onUnselect) {
			this.props.onUnselect(item)
		}
	}

	render() {
		const style = {
			listBox: {
				height: '33vh',
				overflowY: 'scroll',
			},
		}
		return (
			<Col>
				<Row className="d-flex justify-content-center m-3">
					<h5>{this.props.selectedTitle}</h5>
				</Row>
				<Row className="d-flex justify-content-center" style={style.listBox}>
					<ListBox
						className="cursor-pointer"
						rows={this.generateSelectedRowsForListBox()}
					/>
				</Row>
				<Row className="d-flex justify-content-center m-3">
					<h5>{this.props.unselectedTitle}</h5>
				</Row>
				<Row className="d-flex justify-content-center" style={style.listBox}>
					<ListBox rows={this.generateUnselectedRowsForListBox()} />
				</Row>
			</Col>
		)
	}
}

export default DualListBox
