import React from 'react'
import { Col, Row, Button, ButtonToolbar, Modal, Form } from 'react-bootstrap'
import axios from 'axios'
import dataSrc from '../../../dataSrc'
// import AddableList from './AddableList'
import { AppContext } from '../../../context/AppContext'

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { getName, getType, getACN } from '../../../helper/descriptionGenerator'

import DualListBox from './DualListBox'
import apiHelper from '../../../helper/apiHelper'

const style = {
	list: {
		// wordBreak: 'keep-all',
		zIndex: 1,
	},
	item: {
		minWidth: 35,
	},
}

class PatientGroupManager extends React.Component {
	static contextType = AppContext
	reNameRef = React.createRef()
	state = {
		selectedPatientGroup: null,
	}
	componentDidMount = () => {
		this.getObjectData()
		this.getPatientGroup('Mount')
	}
	reload = () => {
		this.getObjectData()
		this.getPatientGroup()
	}
	newPatientGroup = (name) => {
		apiHelper.patientGroupListApis
			.addPatientGroupList({
				name,
			})
			.then((res) => {
				this.setState({
					selectedPatientGroup: { id: res.data },
				})
				this.reload()
			})
			.catch((err) => {
				console.log('err when add patient group ', err)
			})
	}
	addPatientToGroup = (item) => {
		const groupId = this.state.selectedPatientGroup.id
		apiHelper.patientGroupListApis
			.modifyPatientGroupList({
				groupId: this.state.selectedPatientGroup.id,
				mode: 0,
				itemACN: item.asset_control_number,
			})
			.then((res) => {
				this.reload()
			})
			.catch((err) => console.log(err))
	}
	removePatientFromGroup = (item) => {
		const groupId = this.state.selectedPatientGroup.id

		apiHelper.patientGroupListApis
			.modifyPatientGroupList({
				groupId: this.state.selectedPatientGroup.id,
				mode: 1,
				itemACN: item.asset_control_number,
			})
			.then((res) => {
				this.reload()
			})
			.catch((err) => console.log(err))
	}
	renameGroup = (newName) => {
		const groupId = this.state.selectedPatientGroup.id

		apiHelper.patientGroupListApis
			.modifyPatientGroupList({
				groupId: this.state.selectedPatientGroup.id,
				mode: 2,
				newName,
			})
			.then((res) => {
				this.setState({
					renameGroup: false,
				})
				this.reload()
			})
			.catch((err) => console.log(err))
	}
	selectPatientGroup = (patientGroup) => {
		this.setState({
			selectedPatientGroup: patientGroup ? patientGroup.value : null,
		})
	}
	deleteGroup = () => {
		apiHelper.patientGroupListApis
			.deleteGroup({
				groupId: this.state.selectedPatientGroup.id,
			})
			.then((res) => {
				this.reload()
			})
			.catch((err) => console.log(err))
	}
	getObjectData = () => {
		const { locale, auth } = this.context
		apiHelper.objectApiAgent
			.getObjectTable({
				locale: locale.abbr,
				areas_id: auth.user.areas_id,
				objectType: [1, 2],
			})
			.then((res) => {
				this.setState({
					allPatients: res.data.rows,
				})
			})
			.catch(function (error) {
				console.log(error)
			})
	}
	patientGroupListToSelectOptions = (data) => {
		const options = data.map((option) => {
			return {
				label: option.name,
				value: option,
			}
		})

		return options
	}
	getPatientGroup = (isMount) => {
		apiHelper.patientGroupListApis
			.getPatientGroupList()
			.then((res) => {
				const data = res.data.map((group) => {
					return {
						...group,
						patients: group.patients || [],
					}
				})
				const updatedSelectedPatientGroup = data.filter((group) => {
					if (this.state.selectedPatientGroup) {
						if (group.id == this.state.selectedPatientGroup.id) {
							return true
						}
						return false
					}
					return false
				})[0]

				this.setState({
					patientGroupList: data,
					patientGroupListOptions: this.patientGroupListToSelectOptions(data),
					selectedPatientGroup:
						isMount == 'Mount' ? data[0] : updatedSelectedPatientGroup,
				})
			})
			.catch((err) => {
				console.log('err when get patient group ', err)
			})
	}

	render() {
		const { locale } = this.context
		return (
			<div
				className="text-capitalize"
				style={{
					height: this.state.selectedPatientGroup ? '80vh' : '10vh',
				}}
			>
				<Modal
					show={this.state.renameGroup}
					onHide={() => {
						this.setState({ renameGroup: false })
					}}
				>
					<Modal.Header closeButton>
						<Modal.Title>{locale.texts.RENAME}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group as={Col}>
							<Form.Control type="text" ref={this.reNameRef} />
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								console.log(this.reNameRef.current.value)
								this.renameGroup(this.reNameRef.current.value)
							}}
						>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
				<CreatableSelect
					isClearable
					onChange={this.selectPatientGroup}
					onCreateOption={this.newPatientGroup}
					options={this.state.patientGroupListOptions}
					value={
						this.state.selectedPatientGroup
							? {
									value: this.state.selectedPatientGroup,
									label: this.state.selectedPatientGroup.name,
							  }
							: null
					}
				/>
				{this.state.selectedPatientGroup ? (
					<>
						<ButtonToolbar className="my-2">
							<Button
								variant="outline-primary"
								className="text-capitalize mr-2"
								name="secondaryArea"
								size="sm"
								onClick={() => {
									this.setState({ renameGroup: true })
								}}
							>
								{locale.texts.EDIT_DEVICE_GROUP_NAME}
							</Button>
							<Button
								variant="outline-primary"
								className="text-capitalize mr-2"
								name="password"
								size="sm"
								onClick={this.deleteGroup}
							>
								{locale.texts.REMOVE_DEVICE_GROUP}
							</Button>
						</ButtonToolbar>
						<DualListBox
							allItems={this.state.allPatients || []}
							selectedItemList={
								this.state.selectedPatientGroup
									? this.state.selectedPatientGroup.patients
									: []
							}
							selectedTitle="Patients In List"
							unselectedTitle="Other Patients"
							onSelect={this.addPatientToGroup}
							onUnselect={this.removePatientFromGroup}
						/>
					</>
				) : null}
			</div>
		)
	}
}

export default PatientGroupManager
