import React from 'react'
import { AppContext } from '../../../context/AppContext'
import config from '../../../config'
import { Nav } from 'react-bootstrap'
import AccessControl from '../../AccessControl'
import Map from '../../Map'
import { CLEAR_SEARCH_RESULT } from '../../../config/wordMap'
import PropTypes from 'prop-types'
import {
	SET_DEVICE_OBJECT_TYPE_VISIBLE,
	SET_PERSON_OBJECT_TYPE_VISIBLE,
} from '../../../reducer/action'
import Button from '../../../components/Button'

class BrowserMapContainer extends React.Component {
	static contextType = AppContext

	render() {
		const { locale, stateReducer } = this.context
		const { mapConfig, ACTION_BUTTONS } = config
		const {
			pathMacAddress,
			colorPanel,
			lbeaconPosition,
			locationMonitorConfig,
			proccessedTrackingData,
			showPdfDownloadForm,
			handleClickButton,
			searchObjectArray,
			pinColorArray,
			searchKey,
			getSearchKey,
			searchResultListRef,
			searchResult,
			activeActionButtons,
			handleClosePath,
			handleShowPath,
			showPath,
		} = this.props

		const [
			{ area, deviceObjectTypeVisible, personObjectTypeVisible },
			dispatch,
		] = stateReducer
		const style = {
			mapForMobile: {
				border: 'solid 2px rgba(227, 222, 222, 0.619)',
				padding: '5px',
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
			<div
				id="MapContainer"
				style={style.MapContainer}
				className="overflow-hidden"
			>
				<div className="p-1 border-grey">
					<Map
						pathMacAddress={pathMacAddress}
						colorPanel={colorPanel}
						proccessedTrackingData={proccessedTrackingData}
						lbeaconPosition={lbeaconPosition}
						locationMonitorConfig={locationMonitorConfig}
						getSearchKey={getSearchKey}
						mapConfig={mapConfig}
						handleClosePath={handleClosePath}
						handleShowPath={handleShowPath}
						showPath={showPath}
						searchObjectArray={searchObjectArray}
						pinColorArray={pinColorArray}
						searchKey={searchKey}
						searchResultListRef={searchResultListRef}
						searchResult={searchResult}
					/>
				</div>
				<div>
					<Nav className="d-flex align-items-start text-capitalize bd-highlight">
						<Nav.Item className="mt-2">
							<Button
								variant="outline-primary"
								className="mr-1 ml-2 text-capitalize"
								onClick={handleClickButton}
								name={CLEAR_SEARCH_RESULT}
								text={locale.texts.CLEAR}
							/>
						</Nav.Item>
						<AccessControl permission={'user:saveSearchRecord'}>
							<Nav.Item className="mt-2">
								<Button
									variant="outline-primary"
									className="mr-1 ml-2 text-capitalize"
									onClick={handleClickButton}
									name="save"
									value={1}
									disabled={showPdfDownloadForm}
									text={locale.texts.SAVE}
								/>
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
										!activeActionButtons.includes(ACTION_BUTTONS.DEVICE)
									}
									disableDebounce={true}
									text={
										deviceObjectTypeVisible
											? locale.texts.HIDE_DEVICES
											: locale.texts.SHOW_DEVICES
									}
								/>
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
										!activeActionButtons.includes(ACTION_BUTTONS.PERSON)
									}
									disableDebounce={true}
									text={
										personObjectTypeVisible
											? locale.texts.HIDE_RESIDENTS
											: locale.texts.SHOW_RESIDENTS
									}
								/>
							</Nav.Item>
						</AccessControl>
						<div className="d-flex bd-highligh ml-auto">
							{locationMonitorConfig &&
								Object.keys(locationMonitorConfig).includes(
									area.id.toString()
								) && (
									<Nav.Item className="mt-2 bd-highligh">
										<Button
											variant="warning"
											className="mr-1 ml-2"
											onClick={handleClickButton}
											name="location"
											value={locationMonitorConfig[area.id].enable}
											active={!locationMonitorConfig[area.id].enable}
											text={
												locationMonitorConfig[area.id].enable
													? locale.texts.LOCATION_MONITOR_ON
													: locale.texts.LOCATION_MONITOR_OFF
											}
										/>
									</Nav.Item>
								)}
						</div>
					</Nav>
				</div>
			</div>
		)
	}
}

BrowserMapContainer.propTypes = {
	mapConfig: PropTypes.object.isRequired,
	proccessedTrackingData: PropTypes.array.isRequired,
	searchResultListRef: PropTypes.object.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchKey: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	locationMonitorConfig: PropTypes.object.isRequired,
	pathMacAddress: PropTypes.object.isRequired,
	lbeaconPosition: PropTypes.array.isRequired,
	activeActionButtons: PropTypes.array.isRequired,
	showPdfDownloadForm: PropTypes.bool.isRequired,
	handleClickButton: PropTypes.func.isRequired,
	colorPanel: PropTypes.object.isRequired,
	showPath: PropTypes.bool.isRequired,
	handleShowPath: PropTypes.func.isRequired,
	handleClosePath: PropTypes.func.isRequired,
}

export default BrowserMapContainer
