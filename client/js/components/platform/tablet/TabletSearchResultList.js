import React, { Fragment } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import ScrollArea from 'react-scrollbar'
import AccessControl from '../../authentication/AccessControl'
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import { AppContext } from '../../../context/AppContext'
import { Title } from '../../BOTComponent/styleComponent'

const SearchResult = ({
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
		searchResultListForTablet: {
			dispaly: searchKey ? null : 'none',
			maxHeight: '28vh',
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
						{locale.texts.NO_RESULT}
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

export default SearchResult
