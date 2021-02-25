import React from 'react'
import ListBox from './ListBox'
import { Col, Row } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { isSameValue } from '../helper/utilities'
import PropTypes from 'prop-types'

class DualListBox extends React.Component {
	static contextType = AppContext

	generateSelectedRowsForListBox = () => {
		const { allItems, selectedItemList } = this.props

		const selectedItem = allItems.filter((item) => {
			return selectedItemList && selectedItemList.includes(item.id)
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
		const [{ area }] = this.context.stateReducer
		const { allItems, selectedItemList } = this.props

		let unselectedItems = allItems.filter((item) => {
			return isSameValue(item.area_id, area.id) && item.list_id == null
		})

		if (selectedItemList) {
			unselectedItems = unselectedItems.filter((item) => {
				return !selectedItemList.includes(item.id)
			})
		}

		return unselectedItems.map((item) => {
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

DualListBox.defaultProps = {
	allItems: [],
	selectedItemList: [],
	selectedTitle: '',
	unselectedTitle: '',
	onSelect: () => {
		//onSelect
	},
	onUnselect: () => {
		//onUnselect
	},
}

export default DualListBox
