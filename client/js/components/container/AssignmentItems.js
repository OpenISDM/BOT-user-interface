import React from 'react'
import { Row, Col } from 'react-bootstrap'
import CheckboxOverlayTrigger from '../presentational/CheckboxOverlayTrigger'
import PropTypes from 'prop-types'
import { generateObjectSumString } from '../../helper/utilities'

class AssignmentItems extends React.Component {
	generateAssisments = (
		objectMap,
		groupMap,
		submitGroupListIds,
		assignedGroupListids,
		handleChange,
		showOnlyAssigned
	) => {
		return Object.values(groupMap)
			.filter((gruop) => {
				const { id } = gruop
				if (showOnlyAssigned) {
					return assignedGroupListids.includes(id)
				}
				return true
			})
			.map((group) => {
				const { id, name, items } = group
				const checked =
					assignedGroupListids.includes(id) || submitGroupListIds.includes(id)
				return (
					<Row style={{ marginTop: '5px', marginBottom: '5px' }} key={id}>
						<CheckboxOverlayTrigger
							popoverTitle={name}
							popoverBody={generateObjectSumString({
								objectMap,
								objectIds: items,
							})}
							id={id}
							name={name}
							checked={checked}
							placement={'right'}
							onChange={handleChange}
							disabled={assignedGroupListids.includes(id)}
							trigger={'hover'}
						/>
					</Row>
				)
			})
	}

	render() {
		const {
			objectMap,
			gruopMap,
			submitGroupListIds,
			assignedGroupListids,
			handleChange,
			showOnlyAssigned = false,
		} = this.props

		return (
			<>
				<Col>
					{this.generateAssisments(
						objectMap,
						gruopMap,
						submitGroupListIds,
						assignedGroupListids,
						handleChange,
						showOnlyAssigned
					)}
				</Col>
			</>
		)
	}
}

AssignmentItems.propTypes = {
	objectMap: PropTypes.object.isRequired,
	gruopMap: PropTypes.object.isRequired,
	submitGroupListIds: PropTypes.array.isRequired,
	assignedGroupListids: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
	showOnlyAssigned: PropTypes.bool,
}

export default AssignmentItems
