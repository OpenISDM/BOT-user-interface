import React from 'react'
import { ListGroup } from 'react-bootstrap'
import config from '../config'
import { AppContext } from '../context/AppContext'
import {
	getDescription,
	getMacaddress,
	getRSSI,
	getUpdatedByNLbeacons,
	getLastUpdatedUserName,
} from '../helper/descriptionGenerator'
import {
	ALL_DEVICES,
	ALL_PATIENTS,
	OBJECT_TYPE,
	SEARCH_HISTORY,
	NAMED_LIST,
	NORMAL,
} from '../config/wordMap'
import { ASSIGN_OBJECT } from '../reducer/action'
import PropTypes from 'prop-types'

const SearchResultListGroup = ({
	data,
	onSelect,
	selection,
	action,
	searchObjectArray,
	pinColorArray,
	searchKey,
}) => {
	const { locale, auth, stateReducer } = React.useContext(AppContext)

	const onMouseOver = (e, value) => {
		const [, dispatch] = stateReducer
		dispatch({
			type: ASSIGN_OBJECT,
			value,
		})
	}

	const onMouseOut = () => {
		const [, dispatch] = stateReducer
		dispatch({
			type: ASSIGN_OBJECT,
			value: null,
		})
	}

	const createItem = (searchKey, item, index) => {
		if (selection.includes(item.mac_address)) {
			return (
				<div className="d-inline-block">
					<i className="fas fa-check color-blue"></i>
				</div>
			)
		}

		let background
		if (item.searched && item.status !== NORMAL) {
			background = config.mapConfig.iconColor.unNormal
		} else {
			background = searchObjectArray.includes(item.keyword)
				? pinColorArray[searchObjectArray.indexOf(item.keyword)]
				: null
		}

		switch (searchKey.type) {
			case ALL_DEVICES:
			case ALL_PATIENTS:
				return <p className="d-inline-block">&bull;</p>
			case NAMED_LIST:
			case OBJECT_TYPE:
			case SEARCH_HISTORY:
				return (
					<div className="d-inline-block">
						<div
							className="d-flex justify-content-center color-white"
							style={{
								height: '25px',
								width: '25px',
								borderRadius: '50%',
								background,
							}}
						>
							{item.numberOfSearched}
						</div>
					</div>
				)
			default:
				return <p className="d-inline-block">{index + 1}.</p>
		}
	}

	const keywordType = config.KEYWORD_TYPE[auth.user.keyword_type]

	return (
		<ListGroup onSelect={onSelect}>
			{data.map((item, index) => {
				const element = (
					<ListGroup.Item
						href={'#' + index}
						eventKey={item.found + ':' + index}
						onMouseOver={(e) => onMouseOver(e, item.mac_address)}
						onMouseOut={onMouseOut}
						key={index}
						action={action}
						active
						className="d-flex text-left justify-content-start"
					>
						<div className="d-flex justify-content-center">
							{createItem(searchKey, item, index)}
						</div>
						{getDescription({ item, locale, keywordType })}
						{getMacaddress(item, locale)}
						{getRSSI(item, locale)}
						{getUpdatedByNLbeacons(item, locale)}
						{getLastUpdatedUserName(item, locale)}
					</ListGroup.Item>
				)
				return element
			})}
		</ListGroup>
	)
}

SearchResultListGroup.propTypes = {
	data: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	selection: PropTypes.array.isRequired,
	action: PropTypes.bool.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchKey: PropTypes.string.isRequired,
}

export default SearchResultListGroup
