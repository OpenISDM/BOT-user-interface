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
import _ from 'lodash'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import ShiftChange from '../ShiftChange'
import ShiftChangeCheckList from '../ShiftChangeCheckList'
import AssignmentItems from '../AssignmentItems'
import {
	SET_TRACKING_DATA,
	SET_OBJECT_FOUND_RESULTS,
} from '../../../reducer/action'

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
		this.reload()
	}

	reload = () => {
		this.getAssignments()
		this.getPatientGroupList()
		this.getDeviceGroupListDetail()
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

		this.getTrackingData()
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

	getTrackingData = async () => {
		const { locale, auth, stateReducer } = this.context
		const [{ areaId }, dispatch] = stateReducer

		const res = await apiHelper.trackingDataApiAgent.getTrackingData({
			locale: locale.abbr,
			user: auth.user,
			areaId,
		})

		if (res) {
			const {
				assignedDeviceGroupListids,
				assignedPatientGroupListids,
			} = this.state
			const foundDevices = []
			const notFoundDevices = []
			const foundPatients = []
			const notFoundPatients = []
			const data = res.data

			data.forEach((item) => {
				item.status = {
					value: item.status,
					label: item.status ? locale.texts[item.status.toUpperCase()] : null,
				}
				item.transferred_location = item.transferred_location.id && {
					value: `${item.transferred_location.name}-${item.transferred_location.department}`,
					label: `${item.transferred_location.name}-${item.transferred_location.department}`,
				}
				item.found_text = item.found
					? locale.texts.FOUND
					: locale.texts.NOT_FOUND
			})

			data
				.filter((item) => {
					return (
						assignedDeviceGroupListids.includes(parseInt(item.list_id)) &&
						parseInt(item.object_type) === 0
					)
				})
				.forEach((item) => {
					if (item.found) {
						foundDevices.push(item)
					} else {
						notFoundDevices.push(item)
					}
				})

			data
				.filter((item) => {
					return (
						assignedPatientGroupListids.includes(parseInt(item.list_id)) &&
						parseInt(item.object_type) > 0
					)
				})
				.forEach((item) => {
					if (item.found) {
						foundPatients.push(item)
					} else {
						notFoundPatients.push(item)
					}
				})

			dispatch({
				type: SET_TRACKING_DATA,
				value: data,
			})

			dispatch({
				type: SET_OBJECT_FOUND_RESULTS,
				value: {
					totalResults: [
						...foundDevices,
						...notFoundDevices,
						...foundPatients,
						...notFoundPatients,
					],
					devicesResult: {
						found: foundDevices,
						notFound: notFoundDevices,
					},
					patientsReslut: {
						found: foundPatients,
						notFound: notFoundPatients,
					},
				},
			})
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
			showCheckShiftChangeList,
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
				<AccessControl platform={['browser', 'tablet']}>
					<ButtonToolbar>
						<PrimaryButton
							disabled={disabled}
							onClick={() => {
								this.setState({
									showCheckShiftChangeList: true,
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

				<ShiftChangeCheckList
					show={showCheckShiftChangeList}
					handleClose={() => {
						this.setState({
							showCheckShiftChangeList: false,
						})
					}}
					handleSubmit={() => {
						this.setState({
							showShiftChange: true,
						})
					}}
					assignedDeviceGroupListids={assignedDeviceGroupListids}
					assignedPatientGroupListids={assignedPatientGroupListids}
				/>

				<ShiftChange
					show={showShiftChange}
					handleClose={() => {
						this.setState({
							showShiftChange: false,
						})
					}}
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
