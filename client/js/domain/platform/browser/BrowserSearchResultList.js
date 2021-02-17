import React, { Fragment } from 'react'
import { Col, Row } from 'react-bootstrap'
import AccessControl from '../../AccessControl'
import SearchResultListGroup from '../../SearchResultListGroup'
import { AppContext } from '../../../context/AppContext'
import { Title } from '../../../components/StyleComponents'
import PropTypes from 'prop-types'

const BrowserSearchResultList = ({
	searchResult,
	title,
	selection,
	onSelect,
	searchObjectArray,
	pinColorArray,
	searchKey,
}) => {
	const { locale } = React.useContext(AppContext)

	const listMaxHeight = '45vh'

	return (
		<Fragment>
			<Row className="d-flex justify-content-center">
				<Title>{title}</Title>
			</Row>

			{searchResult.length === 0 ? (
				<Col className="d-flex justify-content-center color-grey">
					{locale.texts.NO_RESULT}
				</Col>
			) : (
				<div
					className="d-flex justify-content-center overflow-hidden-scroll custom-scrollbar"
					style={{
						maxHeight: listMaxHeight,
					}}
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
							searchObjectArray={searchObjectArray}
							pinColorArray={pinColorArray}
							searchKey={searchKey}
						/>
					</AccessControl>
				</div>
			)}
		</Fragment>
	)
}

BrowserSearchResultList.propTypes = {
	searchResult: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	selection: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	searchObjectArray: PropTypes.array.isRequired,
	pinColorArray: PropTypes.array.isRequired,
	searchKey: PropTypes.string.isRequired,
}

export default BrowserSearchResultList
