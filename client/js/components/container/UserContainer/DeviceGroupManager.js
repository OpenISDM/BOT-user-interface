import React from 'react'
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import apiHelper from '../../../helper/apiHelper'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import DualListBox from './DualListBox'
import messageGenerator from '../../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../../config/wordMap'
import EditListForm from '../../presentational/form/EditListForm'
import DeleteAlertModal from '../../presentational/DeleteAlertModal'
import config from '../../../config'

class DeviceGroupManager extends React.Component {
	static contextType = AppContext
	state = {
		selectedOption: null,
		selectedDeviceGroup: null,
		showAddGroupForm: false,
		showDeleteModal: false,
		areaOptions: null,
		deviceGroupListOptions: [],
		allDevices: [],
	}

	componentDidMount = () => {
		this.getObjectData()
		this.getDeviceGroup()
		this.getAreaTable()
	}

	reload = () => {
		this.getObjectData()
		this.getDeviceGroup()
		this.setState({
			showAddGroupForm: false,
			showDeleteModal: false,
		})
	}

	newDeviceGroup = async (values) => {
		try {
			await apiHelper.deviceGroupListApis.addDeviceGroupList({
				name: values.name,
				areaId: values.area.id,
			})
			await messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log(`add list failed ${e}`)
		}
	}

	deleteDeviceGroup = async () => {
		try {
			await apiHelper.deviceGroupListApis.deleteGroup({
				groupId: this.state.selectedDeviceGroup.id,
			})
			this.setState({ selectedOption: null, selectedPatientGroup: null })
			await messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			this.reload()
		} catch (e) {
			console.log(`delete group failed ${e}`)
		}
	}

	addDeviceToGroup = async (item) => {
		try {
			await apiHelper.deviceGroupListApis.modifyDeviceGroupList({
				groupId: this.state.selectedDeviceGroup.id,
				mode: 0,
				itemId: item.id,
			})
			this.reload()
		} catch (e) {
			console.log(`add device to group failed ${e}`)
		}
	}

	removeDeviceFromGroup = async (item) => {
		try {
			await apiHelper.deviceGroupListApis.modifyDeviceGroupList({
				groupId: this.state.selectedDeviceGroup.id,
				mode: 1,
				itemId: item.id,
			})
			this.reload()
		} catch (e) {
			console.log(`remove device to group failed ${e}`)
		}
	}

	selectDeviceGroup = (deviceGroup) => {
		this.setState({
			selectedOption: deviceGroup,
			selectedDeviceGroup: deviceGroup ? deviceGroup.value : null,
		})
	}

	getObjectData = async () => {
		const { auth } = this.context
		const res = await apiHelper.objectApiAgent.getObjectTable({
			areas_id: auth.user.areas_id,
			objectType: [config.OBJECT_TYPE.DEVICE],
		})
		if (res) {
			this.setState({
				allDevices: res.data.rows,
			})
		}
	}

	getAreaTable = async () => {
		const res = await apiHelper.areaApiAgent.getAreaTable()
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

	getDeviceGroup = async () => {
		try {
			const res = await apiHelper.deviceGroupListApis.getDeviceGroupList()
			const data = res.data.map((group) => {
				return {
					...group,
					devices: group.devices || [],
				}
			})

			const deviceGroupListOptions = res.data.map((item) => {
				return {
					label: item.name,
					value: item,
				}
			})

			let { selectedDeviceGroup } = this.state
			if (selectedDeviceGroup) {
				selectedDeviceGroup = data.find(
					(group) =>
						parseInt(group.id) === parseInt(this.state.selectedDeviceGroup.id)
				)
			}

			this.setState({
				deviceGroupListOptions,
				selectedDeviceGroup,
			})
		} catch (e) {
			console.log('get device group failed', e)
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
			deviceGroupListOptions,
			selectedDeviceGroup,
			allDevices = [],
			showAddGroupForm,
			selectedOption,
		} = this.state

		const areaId = selectedDeviceGroup && selectedDeviceGroup.area_id
		const items = selectedDeviceGroup && selectedDeviceGroup.items

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
						onChange={this.selectDeviceGroup}
						options={deviceGroupListOptions || []}
					/>
				</div>
				<DualListBox
					allItems={allDevices}
					selectedItemList={items}
					selectedGroupAreaId={areaId}
					selectedTitle={locale.texts.SELECTED_DEVICES}
					unselectedTitle={locale.texts.UNSELECTED_DEVICES}
					onSelect={this.addDeviceToGroup}
					onUnselect={this.removeDeviceFromGroup}
				/>
				<EditListForm
					show={showAddGroupForm}
					handleClose={this.handleClose}
					handleSubmit={this.newDeviceGroup}
					title={locale.texts.CREATE_LIST}
					areaOptions={areaOptions}
				/>
				<DeleteAlertModal
					show={this.state.showDeleteModal}
					handleClose={this.handleClose}
					handleSubmit={this.deleteDeviceGroup}
					title={locale.texts.ARE_YOU_SURE_TO_DELETE}
				/>
			</div>
		)
	}
}

export default DeviceGroupManager
