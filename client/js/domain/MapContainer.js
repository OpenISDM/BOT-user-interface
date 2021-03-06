import React, { Fragment } from 'react'
import PdfDownloadForm from './PdfDownloadForm'
import { AppContext } from '../context/AppContext'
import { BrowserView, TabletView, MobileOnlyView } from 'react-device-detect'
import GeneralConfirmForm from './GeneralConfirmForm'
import TabletMapContainer from './platform/tablet/TabletMapContainer'
import MobileMapContainer from './platform/mobile/MobileMapContainer'
import BrowserMapContainer from './platform/browser/BrowserMapContainer'
import { CLEAR_SEARCH_RESULT } from '../config/wordMap'
import config from '../config'
import pdfPackageGenerator from '../helper/pdfPackageGenerator'
import API from '../api'

import PropTypes from 'prop-types'

class MapContainer extends React.Component {
	static contextType = AppContext

	state = {
		showPdfDownloadForm: false,
		showConfirmForm: false,
		savePath: '',
	}

	handleClickButton = (e) => {
		const { name } = e.target

		switch (name) {
			case CLEAR_SEARCH_RESULT:
				this.props.handleClick(e)
				break
			case 'save':
				this.sendSearchResultToBackend()
				break
			case 'geofence':
				this.setState({
					showConfirmForm: true,
					type: name,
				})
				break
			case 'location':
				this.setState({
					showConfirmForm: true,
					type: name,
				})
				break
		}
	}

	handleCloseModal = () => {
		this.setState({
			showPdfDownloadForm: false,
			showConfirmForm: false,
		})
	}

	sendSearchResultToBackend = async () => {
		const data = {
			devicesResult: {
				found: [],
				notFound: [],
			},
			patientsReslut: {
				found: [],
				notFound: [],
			},
		}

		for (const item of this.props.searchResult) {
			if (parseInt(item.object_type) === config.OBJECT_TYPE.DEVICE) {
				item.found
					? data.devicesResult.found.push(item)
					: data.devicesResult.notFound.push(item)
			} else if (item.type === config.OBJECT_TABLE_SUB_TYPE.PATIENT) {
				item.found
					? data.patientsReslut.found.push(item)
					: data.patientsReslut.notFound.push(item)
			}
		}

		const { locale, auth } = this.context
		const pdfPackage = pdfPackageGenerator.getPdfPackage({
			option: 'searchResult',
			user: auth.user,
			data,
			locale,
		})

		const searResultInfo = {
			userInfo: auth.user,
			pdfPackage,
		}

		const res = await API.File.getPDF({
			...searResultInfo,
		})

		if (res) {
			this.setState({
				savePath: res.data,
				showPdfDownloadForm: true,
			})
		}
	}

	render() {
		const { handleClickButton } = this
		const { pathData, showPdfDownloadForm } = this.state
		const {
			locationMonitorConfig,
			proccessedTrackingData,
			handleClearButton,
			pathMacAddress,
			searchResult,
			lbeaconPosition,
			searchObjectArray,
			pinColorArray,
			searchKey,
			getSearchKey,
			searchResultListRef,
			activeActionButtons,
		} = this.props

		const propsGroup = {
			proccessedTrackingData,
			pathData,
			showPdfDownloadForm,
			handleClickButton,
			pathMacAddress,
			searchResult,
			handleClearButton,
			locationMonitorConfig,
			lbeaconPosition,
			searchObjectArray,
			pinColorArray,
			searchKey,
			getSearchKey,
			searchResultListRef,
			activeActionButtons,
		}

		return (
			<Fragment>
				<BrowserView>
					<BrowserMapContainer {...propsGroup} />
				</BrowserView>
				<TabletView>
					<TabletMapContainer {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileMapContainer {...propsGroup} />
				</MobileOnlyView>
				<PdfDownloadForm
					show={this.state.showPdfDownloadForm}
					savePath={this.state.savePath}
					handleClose={this.handleCloseModal}
				/>
				<GeneralConfirmForm
					show={this.state.showConfirmForm}
					handleClose={this.handleCloseModal}
				/>
			</Fragment>
		)
	}
}

MapContainer.propTypes = {
	locationMonitorConfig: PropTypes.object,
	proccessedTrackingData: PropTypes.array,
	handleClearButton: PropTypes.func,
	pathMacAddress: PropTypes.array,
	searchResult: PropTypes.array,
	lbeaconPosition: PropTypes.array,
	searchObjectArray: PropTypes.array,
	pinColorArray: PropTypes.array,
	searchKey: PropTypes.object,
	getSearchKey: PropTypes.func.isRequired,
	searchResultListRef: PropTypes.node,
	activeActionButtons: PropTypes.array,
	handleClick: PropTypes.func,
}

export default MapContainer
