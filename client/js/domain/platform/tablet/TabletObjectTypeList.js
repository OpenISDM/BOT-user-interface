import React from 'react'
import { Col, Button } from 'react-bootstrap'
import AccessControl from '../../AccessControl'
import { AppContext } from '../../../context/AppContext'
import { MobileOnlyView, TabletView } from 'react-device-detect'
import ScrollArea from 'react-scrollbar'
import PropTypes from 'prop-types'

class TabletObjectTypeList extends React.Component {
	static contextType = AppContext

	state = {
		searchKey: '',
	}

	componentDidUpdate = (prepProps) => {
		if (
			prepProps.clearSearchResult !== this.props.clearSearchResult &&
			!prepProps.clearSearchResult
		) {
			this.setState({
				searchKey: '',
			})
		}
	}

	handleClick = (e) => {
		const itemName = e.target.name.toLowerCase()
		this.getSearchKey(itemName)
	}

	getSearchKey = (itemName) => {
		this.props.getSearchKey(itemName)
		this.setState({
			searchKey: itemName,
		})
	}

	render() {
		const { locale } = this.context

		const style = {
			list: {
				// maxHeight: "50vh",
				// overflow: "hidden scroll",
			},
			listForMobile: {
				maxHeight: '50vh',
				overflow: 'hidden scroll',
				fontSize: '1.5rem',
				fontWeight: 300,
				color: 'green',
			},
			button: {
				//border: 'solid',
				padding: '0.1rem',
			},
			text: {
				fontSize: '2rem',
				fontWeight: 400,
			},
			textSmall: {
				fontSize: '1.5rem',
				fontWeight: 400,
			},
			textSmallButton: {
				padding: '0.1rem',
				fontSize: '1.5rem',
				fontWeight: 400,
			},
		}

		return (
			<div>
				<TabletView>
					<div id="objectTypeList" className="d-inline-flex flex-column">
						<div className="text-capitalize title">
							{locale.texts.OBJECT_TYPE}
						</div>
						<ScrollArea style={{ maxHeight: '40vh' }} smoothScrolling={true}>
							<div className="d-inline-flex flex-column searchOption">
								{this.props.deviceObjectTypes.map((item, index) => {
									return (
										<Button
											variant="outline-custom"
											onClick={this.handleClick}
											// active={this.state.searchKey == item.toLowerCase()}
											key={index}
											name={item}
											className="text-capitalize"
											style={style.button}
										>
											{item}
										</Button>
									)
								})}
								&nbsp;
							</div>
						</ScrollArea>

						<div className="d-inline-flex flex-column">
							&nbsp;
							<AccessControl permission={'user:mydevice'}>
								<Button
									variant="outline-custom"
									onClick={this.handleClick}
									name="my patients"
									className="text-capitalize"
								>
									{locale.texts.MY_PATIENTS}
								</Button>

								<Button
									variant="outline-custom"
									onClick={this.handleClick}
									// active={this.state.searchKey == 'my devices'}
									name="my devices"
									className="text-capitalize"
								>
									{locale.texts.MY_DEVICES}
								</Button>
							</AccessControl>
							<Button
								variant="outline-custom"
								onClick={this.handleClick}
								// active={this.state.searchKey == 'all devices'}
								name="all patients"
								className="text-capitalize"
							>
								{locale.texts.ALL_PATIENTS}
							</Button>
							<Button
								variant="outline-custom"
								onClick={this.handleClick}
								// active={this.state.searchKey == 'all devices'}
								name="all devices"
								className="text-capitalize"
							>
								{locale.texts.ALL_DEVICES}
							</Button>
						</div>
					</div>
				</TabletView>
				<MobileOnlyView>
					<div className="d-inline-flex flex-column" style={style.textSmall}>
						<AccessControl permission={'user:mydevice'}>
							<Col>
								<Button
									variant="outline-custom"
									onClick={this.handleClick}
									name="my patients"
									className="text-capitalize"
									style={style.textSmall}
								>
									{locale.texts.MY_PATIENTS}
								</Button>

								<Button
									variant="outline-custom"
									onClick={this.handleClick}
									// active={this.state.searchKey == 'my devices'}
									name="my devices"
									className="text-capitalize"
									style={style.textSmall}
								>
									{locale.texts.MY_DEVICES}
								</Button>
							</Col>
						</AccessControl>
						<Col>
							<Button
								variant="outline-custom"
								onClick={this.handleClick}
								// active={this.state.searchKey == 'all devices'}
								name="all patients"
								className="text-capitalize"
								style={style.textSmall}
							>
								{locale.texts.ALL_PATIENTS}
							</Button>
							<Button
								variant="outline-custom"
								onClick={this.handleClick}
								// active={this.state.searchKey == 'all devices'}
								name="all devices"
								className="text-capitalize"
								style={style.textSmall}
							>
								{locale.texts.ALL_DEVICES}
							</Button>
						</Col>
					</div>
					<div id="objectTypeList" className="d-inline-flex flex-column">
						<div className="text-capitalize title" style={style.text}>
							{locale.texts.OBJECT_TYPE}
						</div>

						<ScrollArea style={{ maxHeight: '50vh' }}>
							<div className="d-inline-flex flex-column searchOption">
								{this.props.deviceObjectTypes.map((item, index) => {
									return (
										<Button
											variant="outline-custom"
											onClick={this.handleClick}
											// active={this.state.searchKey == item.toLowerCase()}
											key={index}
											name={item}
											className="text-capitalize"
											style={style.textSmallButton}
										>
											{item}
										</Button>
									)
								})}
								&nbsp;
							</div>
						</ScrollArea>
					</div>
				</MobileOnlyView>
			</div>
		)
	}
}

TabletObjectTypeList.propTypes = {
	deviceObjectTypes: PropTypes.array,
	clearSearchResult: PropTypes.func,
	getSearchKey: PropTypes.func,
}

export default TabletObjectTypeList
