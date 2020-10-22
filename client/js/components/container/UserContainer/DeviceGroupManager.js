import React from 'react'
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import apiHelper from '../../../helper/apiHelper'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import DualListBox from './DualListBox'
import messageGenerator from '../../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../../config/wordMap'
import EditListForm from '../../presentational/form/EditListForm'

class DeviceGroupManager extends React.Component {
	static contextType = AppContext
	state = {
		selectedOption: null,
		selectedDeviceGroup: null,
		showRenameGroupForm: false,
	}

	componentDidMount = () => {
		this.getObjectData()
		this.getDeviceGroup()
		this.getAreaTable()
	}

	reload = () => {
		this.getObjectData()
		this.getDeviceGroup()
	}

	newDeviceGroup = async (values) => {
		try {
			await apiHelper.deviceGroupListApis.addDeviceGroupList({
				name: values.name,
				area_id: values.area.id,
			})

			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.setState(
				{
					// selectedDeviceGroup: {id:res.data}
					showRenameGroupForm: false,
				},
				callback
			)
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
			this.reload()
			const callback = () => {
				messageGenerator.setSuccessMessage(SAVE_SUCCESS)
			}
			this.setState({ selectedOption: null }, callback)
		} catch (e) {
			console.log(`delete group failed ${e}`)
		}
	}

	addDeviceToGroup = async (item) => {
		try {
			await apiHelper.deviceGroupListApis.modifyDeviceGroupList({
				groupId: this.state.selectedDeviceGroup.id,
				mode: 0,
				itemACN: item.asset_control_number,
				item_id: item.id,
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
				itemACN: item.asset_control_number,
				item_id: item.id,
			})
			this.reload()
		} catch (e) {
			console.log(`remove device to group failed ${e}`)
		}
	}

	showRenameGroupForm = async (newName) => {
		try {
			await apiHelper.deviceGroupListApis.modifyDeviceGroupList({
				groupId: this.state.selectedDeviceGroup.id,
				mode: 2,
				newName,
			})
			this.reload()
			this.setState({
				showRenameGroupForm: false,
			})
		} catch (e) {
			console.log(`rename group failed ${e}`)
		}
	}

	selectDeviceGroup = (deviceGroup) => {
		this.setState({
			selectedOption: deviceGroup,
			selectedDeviceGroup: deviceGroup ? deviceGroup.value : null,
		})
	}

	getObjectData = async () => {
		const { locale, auth } = this.context
		try {
			const res = await apiHelper.objectApiAgent.getObjectTable({
				locale: locale.abbr,
				areas_id: auth.user.areas_id,
				objectType: [0],
			})
			this.setState({
				allDevices: res.data.rows,
			})
		} catch (e) {
			console.log(`get object data failed ${e}`)
		}
	}

	getAreaTable = async () => {
		const { locale } = this.context
		try {
			const res = await apiHelper.areaApiAgent.getAreaTable()
			const areaOptions = res.data.rows.map((area) => {
				return {
					id: area.id,
					value: area.name,
					label: locale.texts[area.name],
				}
			})
			this.setState({
				areaOptions,
			})
		} catch (e) {
			console.log(`get area table failed ${e}`)
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
			console.log('err when get device group ', e)
		}
	}

	handleClose = () => {
		this.setState({
			showRenameGroupForm: false,
		})
	}

	render() {
		const { locale } = this.context

		const {
			areaOptions,
			deviceGroupListOptions,
			selectedDeviceGroup,
			allDevices = [],
			showRenameGroupForm,
			selectedOption,
		} = this.state

		return (
			<div className="text-capitalize">
				<div className="d-flex">
					<PrimaryButton
						variant="primary"
						className="text-capitalize ml-2"
						name="add"
						onClick={() => {
							this.setState({
								showRenameGroupForm: true,
							})
						}}
					>
						{locale.texts.ADD}
					</PrimaryButton>
					<PrimaryButton
						variant="primary"
						className="text-capitalize mr-2"
						name="password"
						onClick={this.deleteDeviceGroup}
					>
						{locale.texts.REMOVE}
					</PrimaryButton>
					<Select
						className="flex-grow-1"
						isClearable
						value={selectedOption}
						onChange={this.selectDeviceGroup}
						options={deviceGroupListOptions}
					/>
				</div>
				<DualListBox
					allItems={allDevices}
					selectedItemList={selectedDeviceGroup}
					selectedTitle={locale.texts.SELECTED_DEVICES}
					unselectedTitle={locale.texts.UNSELECTED_DEVICES}
					onSelect={this.addDeviceToGroup}
					onUnselect={this.removeDeviceFromGroup}
				/>
				<EditListForm
					show={showRenameGroupForm}
					handleClose={this.handleClose}
					handleSubmit={this.newDeviceGroup}
					title={locale.texts.CREATE_LIST}
					areaOptions={areaOptions}
				/>
			</div>
		)
	}
}

export default DeviceGroupManager
