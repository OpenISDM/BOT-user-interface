import React from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { keyBy, debounce } from 'lodash'
import { AppContext } from '../context/AppContext'
import { PrimaryButton } from '../components/StyleComponents'
import API from '../api'
import { setSuccessMessage } from '../helper/messageGenerator'
import { SAVE_SUCCESS } from '../config/wordMap'
import config from '../config'
import AssignmentItems from './AssignmentItems'
const { ASSIGNMENT } = config

class GetAssignments extends React.Component {
	static contextType = AppContext

	state = {
		currentAssignmentType: ASSIGNMENT.TYPE.DEVICE,
		deviceGroupMap: {},
		patientGroupMap: {},
		objectMap: {},
		submitGroupListIds: [],
		assignedDeviceGroupListids: [],
		assignedPatientGroupListids: [],
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
		this.getPatientGroupList()
		this.getDeviceGroupListDetail()
		this.getAssignments()
	}

	getAssignments = async () => {
		const { stateReducer, auth } = this.context
		const [{ area }] = stateReducer
		const userId = auth.user.id
		const assignedDeviceGroupListids = []
		const assignedPatientGroupListids = []

		const res = await API.UserAssignments.getByUserId({
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
			submitGroupListIds: [],
		})
	}

	acceptAssignments = async (submitGroupListIds) => {
		const { auth } = this.context
		const userId = auth.user.id

		try {
			await API.UserAssignments.accept({
				userId,
				groupListIds: submitGroupListIds,
				assignmentType: this.state.currentAssignmentType,
			})
			await setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	cancelAssignments = async (assignedGroupListids) => {
		const { auth } = this.context
		const userId = auth.user.id

		try {
			await API.UserAssignments.cancel({
				userId,
				groupListIds: assignedGroupListids,
			})
			await setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	getPatientGroupList = async () => {
		const { stateReducer } = this.context
		const [{ area }] = stateReducer

		try {
			const res = await API.PatientGroupListApis.getDetailByAreaId(area.id)
			const patientGroupMap = keyBy(res.data.gruopList, 'id')
			const patientObjectMap = keyBy(res.data.objectList, 'id')
			this.setState({
				patientGroupMap,
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
			const res = await API.DeviceGroupListApis.getDetailByAreaId(area.id)
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

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	handleChange = (e) => {
		const groupId = parseInt(e.target.id)
		let submitGroupListIds = []
		if (this.state.submitGroupListIds.includes(groupId)) {
			// remove id
			submitGroupListIds = this.state.submitGroupListIds.filter(
				(id) => id !== groupId
			)
		} else {
			// add id
			submitGroupListIds = [...this.state.submitGroupListIds, groupId]
		}
		this.setState({
			submitGroupListIds: [...new Set(submitGroupListIds)],
		})
	}

	handleAssigmentTypeChange = (e) => {
		const type = parseInt(e.target.id)
		this.setState({ currentAssignmentType: type })
	}

	generateActionButtons = (locale, assignedGroupListids) => {
		const { submitGroupListIds } = this.state
		let buttons = null

		if (submitGroupListIds.length > 0) {
			buttons = (
				<ButtonToolbar>
					<PrimaryButton
						onClick={() => {
							this.acceptAssignments(submitGroupListIds)
						}}
					>
						{locale.texts.CONFIRM}
					</PrimaryButton>
					<PrimaryButton
						onClick={() => {
							this.setState({ submitGroupListIds: [] })
						}}
					>
						{locale.texts.CANCEL}
					</PrimaryButton>
				</ButtonToolbar>
			)
		} else if (assignedGroupListids.length > 0) {
			buttons = (
				<ButtonToolbar>
					<PrimaryButton
						onClick={() => {
							this.cancelAssignments(assignedGroupListids)
						}}
					>
						{locale.texts.DISCARD}
					</PrimaryButton>
				</ButtonToolbar>
			)
		}

		return buttons
	}

	render() {
		const { locale } = this.context

		const { handleChange } = this

		const gruopMap =
			this.state.currentAssignmentType === ASSIGNMENT.TYPE.DEVICE
				? this.state.deviceGroupMap
				: this.state.patientGroupMap

		const assignedGroupListids =
			this.state.currentAssignmentType === ASSIGNMENT.TYPE.DEVICE
				? this.state.assignedDeviceGroupListids
				: this.state.assignedPatientGroupListids

		const { objectMap, submitGroupListIds } = this.state

		return (
			<>
				<ButtonToolbar>
					<PrimaryButton
						disabled={
							this.state.currentAssignmentType === ASSIGNMENT.TYPE.DEVICE
						}
						id={ASSIGNMENT.TYPE.DEVICE}
						onClick={this.handleAssigmentTypeChange}
					>
						{locale.texts.DEVICE}
					</PrimaryButton>
					<PrimaryButton
						disabled={
							this.state.currentAssignmentType === ASSIGNMENT.TYPE.PATIENT
						}
						id={ASSIGNMENT.TYPE.PATIENT}
						onClick={this.handleAssigmentTypeChange}
					>
						{locale.texts.PATIENT}
					</PrimaryButton>
				</ButtonToolbar>
				<hr />
				<AssignmentItems
					objectMap={objectMap}
					gruopMap={gruopMap}
					submitGroupListIds={submitGroupListIds}
					assignedGroupListids={assignedGroupListids}
					handleChange={handleChange}
				/>
				<hr />
				{this.generateActionButtons(locale, assignedGroupListids)}
			</>
		)
	}
}

export default GetAssignments
