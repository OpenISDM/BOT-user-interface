import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
const Fragment = React.Fragment
class ListBox extends React.Component {
	/*
        props:
            rows: [
            {
                acn: string
                onClick: function(item)
                label: jsx,
            }]
    */
	render() {
		return (
			<ListGroup variant="flush" className="w-100">
				{this.props.rows.length != null
					? this.props.rows.map((row) => {
							return (
								<ListGroup.Item onClick={row.onClick} key={row.acn}>
									{row.label}
								</ListGroup.Item>
							)
					  })
					: null}
			</ListGroup>
		)
	}
}

export default ListBox
