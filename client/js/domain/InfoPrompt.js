import React, { Fragment } from 'react'
import { Row } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import { TabletView, isTablet, CustomView, isMobile } from 'react-device-detect'
import { SWITCH_SEARCH_LIST, FOUND, NOT_FOUND } from '../config/wordMap'
import {
	HoverDiv,
	HoverWithUnderlineDiv,
	JustifyCenterDiv,
	FontBoldDiv,
	ToggleDisplayDiv,
	ReactBootstrapAlert,
} from '../components/styleComponent'
import { searchResultToMap } from '../helper/dataTransfer'
import PropTypes from 'prop-types'

const InfoPrompt = ({ searchKey, searchResult, handleClick }) => {
	const appContext = React.useContext(AppContext)
	const [showDetail, setShowDetail] = React.useState(false)

	const { locale } = appContext

	const searchResultMap = searchResultToMap(searchResult)

	const handleShowDetail = () => {
		setShowDetail(!showDetail)
	}

	return (
		<Fragment>
			<CustomView condition={!isTablet && !isMobile}>
				<ReactBootstrapAlert
					variant="secondary"
					className="px-4 position-fixed sm:display-none xs:display-none"
					style={{
						width: '32%',
					}}
				>
					<Row>
						<HoverWithUnderlineDiv onClick={handleClick}>
							{stringBlock({
								name: SWITCH_SEARCH_LIST,
								value: true,
								data: searchResult.filter((item) => item.found).length,
								label: FOUND,
								locale,
								onClick: handleClick,
							})}
						</HoverWithUnderlineDiv>
						<HoverWithUnderlineDiv onClick={handleClick}>
							{stringBlock({
								name: SWITCH_SEARCH_LIST,
								value: false,
								data: searchResult.filter((item) => !item.found).length,
								label: NOT_FOUND,
								locale,
								onClick: handleClick,
							})}
						</HoverWithUnderlineDiv>
						<HoverDiv
							onClick={handleShowDetail}
							className="text-muted ml-auto d-flex align-items-center position-relative right-0 font-size-80-percent"
						>
							{locale.texts.DETAIL}
							&nbsp;
							<i
								className={`fas ${
									showDetail ? 'fa-angle-up' : 'fa-angle-down'
								}`}
							/>
						</HoverDiv>
					</Row>
					<ToggleDisplayDiv display={showDetail} className="pt-1">
						{Object.keys(searchResultMap).map((item, index) => {
							return (
								<Row key={index} className="text-capitalize">
									<JustifyCenterDiv className="mr-1">
										{locale.texts.FOUND}
										&nbsp;
										<FontBoldDiv>{searchResultMap[item][1]}</FontBoldDiv>
										&nbsp;
										{item}
									</JustifyCenterDiv>
									&nbsp;
									<JustifyCenterDiv className="mr-1">
										{locale.texts.NOT_FOUND}
										&nbsp;
										<FontBoldDiv>
											{searchResultMap[item][0] - searchResultMap[item][1]}
										</FontBoldDiv>
										&nbsp;
										{item}
									</JustifyCenterDiv>
								</Row>
							)
						})}
					</ToggleDisplayDiv>
				</ReactBootstrapAlert>
			</CustomView>
			<TabletView>
				<FontBoldDiv>
					{searchKey
						? locale.texts.FOUND
						: locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
					{searchKey ? searchResult.filter((item) => item.found).length : ''}
					{searchKey ? locale.texts.OBJECTS : ''}
				</FontBoldDiv>
			</TabletView>
		</Fragment>
	)
}

InfoPrompt.propTypes = {
	searchKey: PropTypes.string,
	searchResult: PropTypes.array,
	handleClick: PropTypes.func,
}

export default InfoPrompt

const stringBlock = ({ name, value, data, label, locale, onClick }) => {
	switch (locale.abbr) {
		// case locale.supportedLocale.ms.abbr:
		// case locale.supportedLocale.cn.abbr:

		case locale.supportedLocale.en.abbr:
			return (
				<div
					className="d-flex justify-content-start mr-2"
					name={name}
					value={value}
					onClick={onClick}
				>
					<FontBoldDiv name={name} value={value}>
						{data}
					</FontBoldDiv>
					&nbsp;
					{locale.texts.OBJECTS}
					&nbsp;
					{locale.texts[label.toUpperCase().replace(/ /g, '_')]}
				</div>
			)
		case locale.supportedLocale.tw.abbr:
			return (
				<div
					className="d-flex justify-content-start mr-2"
					name={name}
					value={value}
					onClick={onClick}
				>
					{locale.texts[label.toUpperCase().replace(/ /g, '_')]}
					&nbsp;
					<FontBoldDiv name={name} value={value}>
						{data}
					</FontBoldDiv>
					&nbsp;
					{locale.texts.OBJECTS}
				</div>
			)
	}
}
