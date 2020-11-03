/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        AssignmentItems.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import CheckboxOverlayTrigger from '../presentational/CheckboxOverlayTrigger'
import PropTypes from 'prop-types'

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
				const { id, name } = group
				const checked =
					assignedGroupListids.includes(id) || submitGroupListIds.includes(id)
				return (
					<Row style={{ marginTop: '5px', marginBottom: '5px' }} key={id}>
						<CheckboxOverlayTrigger
							popoverTitle={name}
							popoverBody={this.generateAssismentsDetails(objectMap, group)}
							id={id}
							name={name}
							checked={checked}
							placement={'right'}
							onChange={handleChange}
							label={name}
							disabled={assignedGroupListids.includes(id)}
							trigger={'hover'}
						/>
					</Row>
				)
			})
	}

	generateAssismentsDetails = (objectMap, gruop) => {
		let itemsNameString = ''

		const { items } = gruop
		if (items) {
			const itemMap = {}
			items.forEach((id) => {
				const object = objectMap[id]
				if (object) {
					const { name } = object
					if (itemMap[name]) {
						itemMap[name] += 1
					} else {
						itemMap[name] = 1
					}
				}
			})
			Object.keys(itemMap).forEach((itemKey) => {
				itemsNameString = `${itemsNameString}${itemKey} : ${
					itemMap[itemKey]
				} ${String.fromCharCode(13, 10)}`
			})
		}

		return itemsNameString
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
