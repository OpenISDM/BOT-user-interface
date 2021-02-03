import React, { Fragment } from 'react'
import {
	TabletView,
	MobileOnlyView,
	isTablet,
	CustomView,
	isMobile,
} from 'react-device-detect'
import { AppContext } from '../../context/AppContext'
import TabletSearchContainer from '../platform/tablet/TabletSearchContainer'
import MobileSearchContainer from '../platform/mobile/MobileSearchContainer'
import BrowserSearchContainer from '../platform/browser/BrowserSearchContainer'
import apiHelper from '../../helper/apiHelper'
import config from '../../config'
import PropTypes from 'prop-types'
import { isSameValue, isEqual } from '../../helper/utilities'

class SearchContainer extends React.Component {
	static contextType = AppContext

	state = {
		isShowSectionTitle: false,
		isShowSearchOption: false,
		searchKey: '',
		sectionTitleList: [],
		sectionIndex: '',
		searchResult: [],
		hasSearchableObjectData: false,
		deviceObjectTypes: [],
		personObjectTypes: [],
		deviceNamedList: [],
		personNamedList: [],
		currentAreaId: null,
	}

	componentDidMount = () => {
		this.getData()
	}

	componentDidUpdate = (prepProps, prevState) => {
		const [{ area }] = this.context.stateReducer
		if (!isEqual(prevState.currentAreaId, area.id)) {
			this.setState({
				currentAreaId: area.id,
			})
			this.getData()
		}

		/** Refresh the search result automatically
		 *  This feature can be adjust by the user by changing the boolean value in config */
		if (this.state.refreshSearchResult) {
			this.props.getSearchKey(this.state.searchKey)
		}

		if (
			prepProps.clearSearchResult !== this.props.clearSearchResult &&
			this.props.clearSearchResult
		) {
			this.setState({
				searchKey: '',
			})
		}
	}

	/** Get the searchable object type. */
	getData = async () => {
		const { auth, stateReducer } = this.context
		const [{ area }] = stateReducer
		const aliasesPromise = await apiHelper.objectApiAgent.getAliases({
			areaId: area.id,
			objectType: [config.OBJECT_TYPE.DEVICE, config.OBJECT_TYPE.PERSON],
		})
		const namedListPromise = apiHelper.namedListApiAgent.getNamedListWithoutType(
			{
				areaIds: [area.id],
				isUserDefined: true,
			}
		)

		const [aliasesRes, namedListRes] = await Promise.all([
			aliasesPromise,
			namedListPromise,
		])

		if (aliasesRes && namedListRes) {
			const keywordType = config.KEYWORD_TYPE[auth.user.keyword_type]
			const personObjectTypes = [
				...new Set(
					aliasesRes.data
						.filter((item) =>
							isSameValue(item.object_type, config.OBJECT_TYPE.PERSON)
						)
						.map((item) => item.type)
				),
			]

			const deviceObjectTypes = [
				...new Set(
					aliasesRes.data
						.filter((item) =>
							isSameValue(item.object_type, config.OBJECT_TYPE.DEVICE)
						)
						.map((item) => {
							return item[keywordType] ? item[keywordType] : item.type
						})
				),
			]

			const deviceNamedList = namedListRes.data.filter((item) =>
				isSameValue(item.type, config.NAMED_LIST_TYPE.DEVICE)
			)

			const personNamedList = namedListRes.data.filter(
				(item) => !isSameValue(item.type, config.NAMED_LIST_TYPE.DEVICE)
			)

			this.setState({
				personObjectTypes,
				deviceObjectTypes,
				deviceNamedList,
				personNamedList,
			})
		}
	}

	render() {
		const {
			searchKey,
			getSearchKey,
			clearSearchResult,
			searchObjectArray,
			pinColorArray,
			keywords,
			handleSearchTypeClick,
		} = this.props

		const {
			personObjectTypes,
			deviceObjectTypes,
			deviceNamedList,
			personNamedList,
		} = this.state

		const propsGroup = {
			searchKey,
			personObjectTypes,
			deviceObjectTypes,
			deviceNamedList,
			personNamedList,
			getSearchKey,
			clearSearchResult,
			searchObjectArray,
			pinColorArray,
			keywords,
			handleSearchTypeClick,
		}

		return (
			<Fragment>
				<CustomView condition={!isTablet && !isMobile}>
					<BrowserSearchContainer {...propsGroup} />
				</CustomView>
				<TabletView>
					<TabletSearchContainer {...propsGroup} />
				</TabletView>
				<MobileOnlyView>
					<MobileSearchContainer {...propsGroup} />
				</MobileOnlyView>
			</Fragment>
		)
	}
}

SearchContainer.propTypes = {
	handleSearchTypeClick: PropTypes.func.isRequired,
	keywords: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	searchKey: PropTypes.object.isRequired,
	getSearchKey: PropTypes.func.isRequired,
	clearSearchResult: PropTypes.bool.isRequired,
}

export default SearchContainer
