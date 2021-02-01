import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy } from 'lodash'
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
		deviceGroupMap: {},
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
		const [{ area }] = stateReducer
		const userId = auth.user.id
		const assignedDeviceGroupListids = []
		const assignedPatientGroupListids = []

		const res = await apiHelper.userAssignmentsApiAgent.getByUserId({
			areaId: area.id,
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
		const [{ area }] = stateReducer

		try {
			const res = await apiHelper.patientGroupListApis.getDetailByAreaId(
				area.id
			)
			const patientGruopMap = keyBy(res.data.gruopList, 'id')
			const patientObjectMap = keyBy(res.data.objectList, 'id')
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
		const [{ area }] = stateReducer

		try {
			const res = await apiHelper.deviceGroupListApis.getDetailByAreaId(area.id)
			const deviceGroupMap = keyBy(res.data.gruopList, 'id')
			const deviceObjectMap = keyBy(res.data.objectList, 'id')
			this.setState({
				deviceGroupMap,
				objectMap: { ...this.state.objectMap, ...deviceObjectMap },
			})
		} catch (e) {
			console.log('get device group failed', e)
		}
	}

	getTrackingData = async () => {
		const { locale, stateReducer } = this.context
		const [{ area }, dispatch] = stateReducer

		const res = await apiHelper.trackingDataApiAgent.getTrackingData({
			areaIds: [area.id],
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
		deviceGroupMap,
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
					gruopMap={deviceGroupMap}
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
			deviceGroupMap,
			patientGruopMap,
			assignedDeviceGroupListids,
			assignedPatientGroupListids,
			showShiftChange,
			showCheckShiftChangeList,
		} = this.state

		let hasDeviceItems = false
		let allAssignmentsNameList = []
		if (assignedDeviceGroupListids.length > 0) {
			const deviceGroupList = Object.values(deviceGroupMap).filter((item) => {
				return assignedDeviceGroupListids.includes(item.id)
			})

			allAssignmentsNameList = deviceGroupList.map((item) => item.name)
			hasDeviceItems = deviceGroupList.some(
				(deviceGroup) => deviceGroup.items && deviceGroup.items.length > 0
			)
		}

		let hasPatientItems = false
		if (assignedPatientGroupListids.length > 0) {
			const patientGroupList = Object.values(patientGruopMap).filter((item) => {
				return assignedPatientGroupListids.includes(item.id)
			})

			allAssignmentsNameList = [
				...allAssignmentsNameList,
				...patientGroupList.map((item) => item.name),
			]
			hasPatientItems = patientGroupList.some(
				(patientGroup) => patientGroup.items && patientGroup.items.length > 0
			)
		}

		const disabled = !(hasDeviceItems || hasPatientItems)

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
					deviceGroupMap,
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
							showCheckShiftChangeList: false,
						})
					}}
					handleSubmit={() => {
						this.setState({
							showShiftChange: false,
							showCheckShiftChangeList: false,
						})
						this.reload()
					}}
					assignedDeviceGroupListids={assignedDeviceGroupListids}
					assignedPatientGroupListids={assignedPatientGroupListids}
					listName={allAssignmentsNameList.join()}
				/>
			</Fragment>
		)
	}
}

export default ShiftChangeRecord
