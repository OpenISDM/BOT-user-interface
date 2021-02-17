import React, { Fragment } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import ScrollArea from 'react-scrollbar'
import AccessControl from '../../AccessControl'
import SearchResultListGroup from '../../SearchResultListGroup'
import { AppContext } from '../../../context/AppContext'
import { Title } from '../../../components/styleComponent'
import PropTypes from 'prop-types'

const MobileSearchResultList = ({
	searchKey,
	searchResult,
	title,
	selection,
	handleToggleNotFound,
	showNotFoundResult,
	onSelect,
}) => {
	const { locale } = React.useContext(AppContext)

	const style = {
		noResultDiv: {
			color: 'grey',
			fontSize: '1rem',
		},
		titleText: {
			color: 'rgb(80, 80, 80, 0.9)',
		},

		searchResultListForTablet: {
			maxHeight: '28vh',
			dispaly: searchKey ? null : 'none',
		},
	}

	return (
		<Fragment>
			<Row className="d-flex justify-content-center">
				<Title>{title}</Title>
			</Row>
			<Row>
				{searchResult.length === 0 ? (
					<Col
						className="d-flex justify-content-center font-weight-lighter"
						style={style.noResultDiv}
					>
						<div className="searchResultForDestop">
							{locale.texts.NO_RESULT}
						</div>
					</Col>
				) : (
					<Col className="d-flex justify-content-center overflow-hidden-scroll custom-scrollbar">
						<ScrollArea
							style={style.searchResultListForTablet}
							smoothScrolling={true}
						>
							<AccessControl
								permission={'form:edit'}
								renderNoAccess={() => (
									// TODO: To be refined
									<SearchResultListGroup
										data={searchResult}
										selection={selection}
									/>
								)}
							>
								<SearchResultListGroup
									data={searchResult}
									onSelect={onSelect}
									selection={selection}
									action
								/>
							</AccessControl>
						</ScrollArea>
					</Col>
				)}
			</Row>
			<Row className="d-flex justify-content-center mt-3">
				<Button
					variant="link"
					onClick={handleToggleNotFound}
					size="lg"
					disabled={false}
				>
					{showNotFoundResult
						? locale.texts.SHOW_SEARCH_RESULTS_FOUND
						: locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND}
				</Button>
			</Row>
		</Fragment>
	)
}

MobileSearchResultList.propTypes = {
	searchKey: PropTypes.array,
	searchResult: PropTypes.array,
	title: PropTypes.string,
	selection: PropTypes.array,
	handleToggleNotFound: PropTypes.func,
	showNotFoundResult: PropTypes.func,
	onSelect: PropTypes.func,
}

export default MobileSearchResultList
