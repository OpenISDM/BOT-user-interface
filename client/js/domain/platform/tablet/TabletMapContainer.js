import React from 'react'
import QRcodeContainer from '../../QRcode'
import { AppContext } from '../../../context/AppContext'
import InfoPrompt from '../../InfoPrompt'
import config from '../../../config'
import { Nav, Button } from 'react-bootstrap'
import AccessControl from '../../AccessControl'
import Map from '../../Map'
import {
	SET_DEVICE_OBJECT_TYPE_VISIBLE,
	SET_PERSON_OBJECT_TYPE_VISIBLE,
} from '../../../reducer/action'
import PropTypes from 'prop-types'

class TabletMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { locale, stateReducer, auth } = this.context

		const {
			proccessedTrackingData,
			showPdfDownloadForm,
			pathMacAddress,
			colorPanel,
			handleClickButton,
			lbeaconPosition,
			searchKey,
			isSearched,
			searchResult,
			getSearchKey,
			handleClosePath,
			handleShowPath,
			showPath,
			activeActionButtons,
		} = this.props

		const [
			{ deviceObjectTypeVisible, personObjectTypeVisible },
			dispatch,
		] = stateReducer
		const style = {
			title: {
				color: 'grey',
				fontSize: '1rem',
				maxWidth: '9rem',
				height: '5rem',
				lineHeight: '3rem',
			},
			MapAndQrcode: {
				height: '42vh',
			},
			qrBlock: {
				width: '10vw',
			},
			mapBlockForTablet: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
				width: '60vw',
			},
			button: {
				fontSize: '0.8rem',
			},
		}

		return (
			<div id="MapContainer" className="w-100 h-100 d-flex flex-column">
				<div className="d-flex w-100 h-100 flex-column">
					<div
						className="w-100 d-flex flex-row align-items justify-content"
						style={style.MapAndQrcode}
					>
						<div
							style={style.qrBlock}
							className="d-flex flex-column align-items"
						>
							<div>
								<QRcodeContainer
									data={proccessedTrackingData.filter((item) => item.searched)}
									userInfo={auth.user}
									searchKey={searchKey}
									isSearched={isSearched}
								/>
								<InfoPrompt
									searchKey={searchKey}
									searchResult={searchResult}
									title={locale.texts.FOUND}
									title2={locale.texts.NOT_FOUND}
								/>
							</div>
						</div>
						<div style={style.mapBlockForTablet}>
							<Map
								pathMacAddress={pathMacAddress}
								colorPanel={colorPanel}
								proccessedTrackingData={proccessedTrackingData}
								lbeaconPosition={lbeaconPosition}
								getSearchKey={getSearchKey}
								mapConfig={config.mapConfig}
								handleClosePath={handleClosePath}
								handleShowPath={handleShowPath}
								showPath={showPath}
							/>
						</div>
					</div>
					<div>
						<Nav
							style={style.button}
							className="d-flex align-items-start text-capitalize bd-highlight"
						>
							<Nav.Item className="mt-2">
								<Button
									variant="outline-primary"
									className="mr-1 ml-2 text-capitalize"
									onClick={handleClickButton}
									name="clear"
								>
									{locale.texts.CLEAR}
								</Button>
							</Nav.Item>
							<AccessControl permission={'user:saveSearchRecord'}>
								<Nav.Item className="mt-2">
									<Button
										variant="outline-primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={handleClickButton}
										name="save"
										disabled={showPdfDownloadForm}
									>
										{locale.texts.SAVE}
									</Button>
								</Nav.Item>
							</AccessControl>
							<AccessControl permission={'user:toggleShowDevices'}>
								<Nav.Item className="mt-2">
									<Button
										variant="primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={() => {
											dispatch({
												type: SET_DEVICE_OBJECT_TYPE_VISIBLE,
												value: !deviceObjectTypeVisible,
											})
										}}
										value={[
											config.SEARCHED_TYPE.ALL_DEVICES,
											config.SEARCHED_TYPE.MY_DEVICES,
											config.SEARCHED_TYPE.OBJECT_TYPE_DEVICE,
											config.SEARCHED_TYPE.PIN_SELETION,
										]}
										disabled={
											!activeActionButtons.includes(
												config.ACTION_BUTTONS.DEVICE
											)
										}
									>
										{deviceObjectTypeVisible
											? locale.texts.HIDE_DEVICES
											: locale.texts.SHOW_DEVICES}
									</Button>
								</Nav.Item>
							</AccessControl>
							<AccessControl permission={'user:toggleShowResidents'}>
								<Nav.Item className="mt-2">
									<Button
										variant="primary"
										className="mr-1 ml-2 text-capitalize"
										onClick={() => {
											dispatch({
												type: SET_PERSON_OBJECT_TYPE_VISIBLE,
												value: !personObjectTypeVisible,
											})
										}}
										value={[
											config.SEARCHED_TYPE.ALL_PATIENTS,
											config.SEARCHED_TYPE.MY_PATIENTS,
											config.SEARCHED_TYPE.OBJECT_TYPE_PERSON,
											config.SEARCHED_TYPE.PIN_SELETION,
										]}
										disabled={
											!activeActionButtons.includes(
												config.ACTION_BUTTONS.PERSON
											)
										}
									>
										{personObjectTypeVisible
											? locale.texts.HIDE_RESIDENTS
											: locale.texts.SHOW_RESIDENTS}
									</Button>
								</Nav.Item>
							</AccessControl>
							{process.env.IS_TRACKING_PATH_ON === 1 && (
								<AccessControl permission={'user:cleanPath'}>
									<Nav.Item className="mt-2">
										<Button
											variant="primary"
											className="mr-1 ml-2 text-capitalize"
											onClick={handleClickButton}
											name="cleanPath"
											disabled={pathMacAddress === ''}
										>
											{locale.texts.CLEAN_PATH}
										</Button>
									</Nav.Item>
								</AccessControl>
							)}
						</Nav>
					</div>
				</div>
			</div>
		)
	}
}

TabletMapContainer.propTypes = {
	proccessedTrackingData: PropTypes.array,
	pathMacAddress: PropTypes.array,
	colorPanel: PropTypes.object,
	handleClosePath: PropTypes.func,
	lbeaconPosition: PropTypes.array,
	handleShowPath: PropTypes.array,
	searchKey: PropTypes.array,
	showPath: PropTypes.bool,
	getSearchKey: PropTypes.func,
	isSearched: PropTypes.bool,
	searchResult: PropTypes.array,
	showPdfDownloadForm: PropTypes.bool,
	handleClickButton: PropTypes.func,
	activeActionButtons: PropTypes.array,
}

export default TabletMapContainer
