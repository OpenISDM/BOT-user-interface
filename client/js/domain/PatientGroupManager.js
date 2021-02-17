import React from 'react'
import { AppContext } from '../context/AppContext'
import Select from 'react-select'
import API from '../api'
import { PrimaryButton } from '../components/StyleComponents'
import DualListBox from './DualListBox'
import { setSuccessMessage } from '../helper/messageGenerator'
import { SAVE_SUCCESS } from '../config/wordMap'
import EditListForm from './EditListForm'
import DeleteAlertModal from './DeleteAlertModal'
import config from '../config'

class PatientGroupManager extends React.Component {
	static contextType = AppContext
	state = {
		selectedOption: null,
		selectedPatientGroup: null,
		showAddGroupForm: false,
		showDeleteModal: false,
		areaOptions: null,
		patientGroupListOptions: [],
		allPatients: [],
	}

	componentDidMount = () => {
		this.getObjectData()
		this.getPatientGroup()
		this.getAreaTable()
	}

	reload = () => {
		this.getObjectData()
		this.getPatientGroup()
		this.setState({
			showAddGroupForm: false,
			showDeleteModal: false,
		})
	}

	newPatientGroup = async (values) => {
		try {
			await API.PatientGroupListApis.addPatientGroupList({
				name: values.name,
				areaId: values.area.id,
			})
			await setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log(`err when add patient group ${e}`)
		}
	}

	deletePatientGroup = async () => {
		try {
			await API.PatientGroupListApis.deleteGroup({
				groupId: this.state.selectedPatientGroup.id,
			})
			this.setState({ selectedOption: null, selectedPatientGroup: null })
			await setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log(`delete group failed ${e}`)
		}
	}

	addPatientToGroup = async (item) => {
		try {
			await API.PatientGroupListApis.modifyPatientGroupList({
				groupId: this.state.selectedPatientGroup.id,
				mode: 0,
				itemId: item.id,
			})
			this.reload()
		} catch (e) {
			console.log(`add patient to group failed ${e}`)
		}
	}

	removePatientFromGroup = async (item) => {
		try {
			await API.PatientGroupListApis.modifyPatientGroupList({
				groupId: this.state.selectedPatientGroup.id,
				mode: 1,
				itemId: item.id,
			})
			this.reload()
		} catch (e) {
			console.log(`remove patient to group failed ${e}`)
		}
	}

	selectPatientGroup = (patientGroup) => {
		this.setState({
			selectedOption: patientGroup,
			selectedPatientGroup: patientGroup ? patientGroup.value : null,
		})
	}

	getObjectData = async () => {
		const { auth } = this.context

		const res = await API.Object.getObjectTable({
			areas_id: auth.user.areas_id,
			objectTypes: [config.OBJECT_TYPE.PERSON],
		})
		if (res) {
			this.setState({
				allPatients: res.data.rows,
			})
		}
	}

	getAreaTable = async () => {
		const res = await API.Area.getAreaTable()
		if (res) {
			const areaOptions = res.data.map((area) => {
				return {
					id: area.id,
					value: area.name,
					label: area.readable_name,
				}
			})
			this.setState({
				areaOptions,
			})
		}
	}

	getPatientGroup = async () => {
		try {
			const res = await API.PatientGroupListApis.getPatientGroupList()
			const data = res.data.map((group) => {
				return {
					...group,
					patients: group.patients || [],
				}
			})

			const patientGroupListOptions = res.data.map((item) => {
				return {
					label: item.name,
					value: item,
				}
			})

			let { selectedPatientGroup } = this.state
			if (selectedPatientGroup) {
				selectedPatientGroup = data.find(
					(group) =>
						parseInt(group.id) === parseInt(this.state.selectedPatientGroup.id)
				)
			}

			this.setState({
				patientGroupListOptions,
				selectedPatientGroup,
			})
		} catch (e) {
			console.log('get patient group failed', e)
		}
	}

	handleClose = () => {
		this.setState({
			showAddGroupForm: false,
			showDeleteModal: false,
		})
	}

	render() {
		const { locale } = this.context

		const {
			areaOptions,
			patientGroupListOptions,
			selectedPatientGroup,
			allPatients,
			showAddGroupForm,
			selectedOption,
		} = this.state

		const areaId = selectedPatientGroup && selectedPatientGroup.area_id
		const patients = selectedPatientGroup && selectedPatientGroup.patients

		return (
			<div className="text-capitalize">
				<div className="d-flex">
					<PrimaryButton
						variant="primary"
						className="text-capitalize ml-2"
						name="add"
						onClick={() => {
							this.setState({
								showAddGroupForm: true,
							})
						}}
					>
						{locale.texts.ADD}
					</PrimaryButton>
					<PrimaryButton
						variant="primary"
						className="text-capitalize mr-2"
						name="remove"
						disabled={!selectedOption}
						onClick={() => {
							this.setState({
								showDeleteModal: true,
							})
						}}
					>
						{locale.texts.REMOVE}
					</PrimaryButton>
					<Select
						className="flex-grow-1"
						isClearable
						value={selectedOption}
						onChange={this.selectPatientGroup}
						options={patientGroupListOptions || []}
					/>
				</div>
				<DualListBox
					allItems={allPatients}
					selectedItemList={patients}
					selectedGroupAreaId={areaId}
					selectedTitle={locale.texts.SELECTED_PATIENTS}
					unselectedTitle={locale.texts.UNSELECTED_PATIENTS}
					onSelect={this.addPatientToGroup}
					onUnselect={this.removePatientFromGroup}
				/>
				<EditListForm
					show={showAddGroupForm}
					handleClose={this.handleClose}
					handleSubmit={this.newPatientGroup}
					title={locale.texts.CREATE_LIST}
					areaOptions={areaOptions}
				/>
				<DeleteAlertModal
					show={this.state.showDeleteModal}
					handleClose={this.handleClose}
					handleSubmit={this.deletePatientGroup}
					title={locale.texts.ARE_YOU_SURE_TO_DELETE}
				/>
			</div>
		)
	}
}

export default PatientGroupManager
