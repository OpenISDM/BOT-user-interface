import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import PropTypes from 'prop-types'
import { BOTSideNav } from '../components/styleComponent'

const ListBox = ({ rows = [] }) => (
	<ListGroup>
		{rows.map((row) => {
			return (
				<ListGroup.Item onClick={row.onClick} key={row.acn}>
					<BOTSideNav className="text-center">{row.label}</BOTSideNav>
				</ListGroup.Item>
			)
		})}
	</ListGroup>
)

ListBox.propTypes = {
	rows: PropTypes.array,
}

export default ListBox
