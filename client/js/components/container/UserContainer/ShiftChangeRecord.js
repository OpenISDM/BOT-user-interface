/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChangeRecord.js

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
import { ButtonToolbar } from 'react-bootstrap'
import _, { debounce } from 'lodash'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import ShiftChange from '../ShiftChange'
import AssignmentItems from '../AssignmentItems'

const { ASSIGNMENT } = config

class ShiftChangeRecord extends React.Component {
	static contextType = AppContext

	state = {
		objectMap: {},
		patientGruopMap: {},
		deviceGruopMap: {},
		assignedDeviceGroupListids: [],
		assignedPatientGroupListids: [],
		showShiftChange: false,
		locale: this.context.locale.abbr,
		prevIndex: null,
	}

	componentDidMount = () => {
		this.debounceReload()
	}

	debounceReload = debounce(
		() => {
			this.reload()
		},
		10,
		{
			leading: true,
			trailing: false,
		}
	)

	reload = () => {
		this.getAssignments()
		this.getPatientGroupList()
		this.getDeviceGroupListDetail()
	}

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	getAssignments = async () => {
		const { stateReducer, auth } = this.context
		const [{ areaId }] = stateReducer
		const userId = auth.user.id
		const assignedDeviceGroupListids = []
		const assignedPatientGroupListids = []

		const res = await apiHelper.userAssignmentsApiAgent.getByUserId({
			areaId,
			userId,
		})

		if (res) {
			res.data
				.filter((item) => item.status === ASSIGNMENT.STATUS.ON_GOING)
				.forEach((item) => {
					switch (item.assignment_type) {
						case ASSIGNMENT.TYPE.DEVICE:
							assignedDeviceGroupListids.push(parseInt(item.group_list_id))
							break
						case ASSIGNMENT.TYPE.PATIENT:
							assignedPatientGroupListids.push(parseInt(item.group_list_id))
							break
					}
				})
		}

		this.setState({
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
		})
	}

	getPatientGroupList = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.patientGroupListApis.getDetailByAreaId(areaId)
			const patientGruopMap = _.keyBy(res.data.gruopList, 'id')
			const patientObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				patientGruopMap,
				objectMap: { ...this.state.objectMap, ...patientObjectMap },
			})
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	getDeviceGroupListDetail = async () => {
		const { stateReducer } = this.context
		const [{ areaId }] = stateReducer

		try {
			const res = await apiHelper.deviceGroupListApis.getDetailByAreaId(areaId)
			const deviceGruopMap = _.keyBy(res.data.gruopList, 'id')
			const deviceObjectMap = _.keyBy(res.data.objectList, 'id')
			this.setState({
				deviceGruopMap,
				objectMap: { ...this.state.objectMap, ...deviceObjectMap },
			})
		} catch (e) {
			console.log('get device group failed', e)
		}
	}

	generateAssignmentItems = ({
		objectMap,
		deviceGruopMap,
		patientGruopMap,
		assignedDeviceGroupListids,
		assignedPatientGroupListids,
	}) => {
		let deviceItems = null
		let patientItems = null
		if (assignedDeviceGroupListids.length > 0) {
			deviceItems = (
				<AssignmentItems
					objectMap={objectMap}
					gruopMap={deviceGruopMap}
					submitGroupListIds={[]}
					assignedGroupListids={assignedDeviceGroupListids}
					showOnlyAssigned={true}
				/>
			)
		}
		if (assignedPatientGroupListids.length > 0) {
			patientItems = (
				<AssignmentItems
					objectMap={objectMap}
					gruopMap={patientGruopMap}
					submitGroupListIds={[]}
					assignedGroupListids={assignedPatientGroupListids}
					showOnlyAssigned={true}
				/>
			)
		}
		return (
			<>
				<hr />
				{deviceItems}
				{patientItems}
				<hr />
			</>
		)
	}

	render() {
		const { locale } = this.context
		const {
			objectMap,
			deviceGruopMap,
			patientGruopMap,
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
			showShiftChange,
		} = this.state

		const disabled = !(
			assignedDeviceGroupListids.length > 0 ||
			assignedPatientGroupListids.length > 0
		)

		let allAssignmentsNameList = []
		if (assignedDeviceGroupListids.length > 0) {
			allAssignmentsNameList = Object.values(deviceGruopMap)
				.filter((item) => {
					return assignedDeviceGroupListids.includes(item.id)
				})
				.map((item) => item.name)
		}
		if (assignedPatientGroupListids.length > 0) {
			allAssignmentsNameList = [
				...allAssignmentsNameList,
				...Object.values(patientGruopMap)
					.filter((item) => {
						return assignedPatientGroupListids.includes(item.id)
					})
					.map((item) => item.name),
			]
		}

		return (
			<Fragment>
				<AccessControl
					renderNoAccess={() => null}
					platform={['browser', 'tablet']}
				>
					<ButtonToolbar>
						<PrimaryButton
							disabled={disabled}
							onClick={() => {
								this.setState({
									showShiftChange: true,
								})
							}}
						>
							{locale.texts.GENERATE_RECORD}
						</PrimaryButton>
					</ButtonToolbar>
				</AccessControl>

				{this.generateAssignmentItems({
					objectMap,
					deviceGruopMap,
					patientGruopMap,
					assignedDeviceGroupListids,
					assignedPatientGroupListids,
				})}

				<ShiftChange
					show={showShiftChange}
					handleClose={this.handleClose}
					handleSubmit={this.reload}
					assignedDeviceGroupListids={assignedDeviceGroupListids}
					assignedPatientGroupListids={assignedPatientGroupListids}
					listName={allAssignmentsNameList.join()}
				/>
			</Fragment>
		)
	}
}

export default ShiftChangeRecord
