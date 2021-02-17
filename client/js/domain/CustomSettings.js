import React from 'react'
import { debounce } from 'lodash'
import { ButtonToolbar, Row, Col } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import API from '../api'
import { PrimaryButton } from '../components/StyleComponents'
import { setSuccessMessage } from '../helper/messageGenerator'
import Table from '../components/Table'
import Button from '../components/Button'
import config from '../config'

const pages = {
	COVERED_AREA_PROFILE: 0,
	DEVICE_ALIASES: 1,
	PATIENT_ALIASES: 2,
}
class CustomSettings extends React.Component {
	static contextType = AppContext

	state = {
		deviceAliasesData: [],
		deviceAliasesColumns: [],
		patientAliasesData: [],
		patientAliasesColumns: [],
		changedIndex: [],
		buttonSelected: pages.DEVICE_ALIASES,
	}

	componentDidMount = () => {
		this.getDeviceAliases()
		this.getPatientData()
	}

	showMessage = debounce(
		() => {
			setSuccessMessage('save success')
		},
		1500,
		{
			leading: true,
			trailing: false,
		}
	)

	reload = async () => {
		const aliasesPromise = this.getDeviceAliases()
		const patientPromise = this.getPatientData()

		await Promise.all([aliasesPromise, patientPromise])

		this.setState({ changedIndex: [] })
		this.showMessage()
	}

	updateDeviceAliases = async () => {
		const [{ area }] = this.context.stateReducer
		const objectTypeList = this.state.changedIndex.map((index) => {
			return this.state.deviceAliasesData[index]
		})
		await API.Object.editAliases({
			objectTypeList,
			areaId: area.id,
		})

		this.reload()
	}

	updatePatientNickname = async () => {
		const personList = this.state.changedIndex.map((index) => {
			return this.state.patientAliasesData[index]
		})
		await API.Object.editNickname({
			personList,
		})

		this.reload()
	}

	setCurrentPage = (identity) => {
		this.setState({
			changedIndex: [],
			buttonSelected: identity,
		})
	}

	getDeviceAliases = async () => {
		const { stateReducer } = this.context
		const [{ area }] = stateReducer
		const res = await API.Object.getAliases({
			areaId: area.id,
			objectType: config.OBJECT_TYPE.DEVICE,
		})

		if (res) {
			const columns = [
				{
					Header: 'object type',
					accessor: 'type',
					width: 200,
				},
				{
					Header: 'alias',
					accessor: 'alias',
					width: 200,
					Cell: (props) => {
						return (
							<input
								className="border"
								value={props.original.type_alias}
								onChange={(e) => {
									const deviceAliasesData = this.state.deviceAliasesData
									const changedIndex = this.state.changedIndex
									deviceAliasesData[props.index].type_alias = e.target.value
									if (!changedIndex.includes(props.index)) {
										changedIndex.push(props.index)
									}
									this.setState({
										deviceAliasesData,
										changedIndex,
									})
								}}
							/>
						)
					},
				},
			]

			this.setState({
				deviceAliasesData: res.data,
				deviceAliasesColumns: columns,
			})
		}
	}

	getPatientData = async () => {
		const { stateReducer } = this.context
		const [{ area }] = stateReducer

		const res = await API.Object.getObjectTable({
			areas_id: [area.id],
			objectTypes: [config.OBJECT_TYPE.PERSON],
		})

		if (res) {
			const columns = [
				{
					Header: 'name',
					accessor: 'name',
					width: 200,
				},
				{
					Header: 'nickname',
					accessor: 'nickname',
					width: 200,
					Cell: (props) => {
						return (
							<input
								className="border"
								value={props.original.nickname}
								onChange={(e) => {
									const patientAliasesData = this.state.patientAliasesData
									const changedIndex = this.state.changedIndex
									patientAliasesData[props.index].nickname = e.target.value
									if (!changedIndex.includes(props.index)) {
										changedIndex.push(props.index)
									}
									this.setState({
										patientAliasesData,
										changedIndex,
									})
								}}
							/>
						)
					},
				},
			]

			this.setState({
				patientAliasesData: res.data.rows,
				patientAliasesColumns: columns,
			})
		}
	}

	checkButtonIsPressed = (identity) => this.state.buttonSelected === identity

	checkToRenderSubPage = (locale) => {
		let subPage

		switch (this.state.buttonSelected) {
			case pages.COVERED_AREA_PROFILE:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.COVERED_AREA_PROFILE}
						</div>
					</>
				)
				break
			case pages.DEVICE_ALIASES:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.DEVICE_ALIASES}
						</div>
						<div className="color-black mb-2 font-size-120-percent">
							<ButtonToolbar>
								<PrimaryButton name={'SAVE'} onClick={this.updateDeviceAliases}>
									{locale.texts.SAVE}
								</PrimaryButton>
							</ButtonToolbar>
						</div>
						<Table
							data={this.state.deviceAliasesData}
							columns={this.state.deviceAliasesColumns}
						/>
					</>
				)
				break
			case pages.PATIENT_ALIASES:
				subPage = (
					<>
						<div className="color-black mb-2 font-size-120-percent">
							{locale.texts.PATIENT_ALIASES}
						</div>
						<div className="color-black mb-2 font-size-120-percent">
							<ButtonToolbar>
								<PrimaryButton
									name={'SAVE'}
									onClick={this.updatePatientNickname}
								>
									{locale.texts.SAVE}
								</PrimaryButton>
							</ButtonToolbar>
						</div>
						<Table
							data={this.state.patientAliasesData}
							columns={this.state.patientAliasesColumns}
						/>
					</>
				)
				break
			default:
				break
		}

		return subPage
	}

	render() {
		const { locale } = this.context

		const style = {
			rowContainer: {
				marginLeft: '1px',
				marginRight: '1px',
				marginBottom: '5px',
			},
		}

		return (
			<>
				<Row>
					<Col xs={4} lg={3}>
						<Row style={style.rowContainer}>
							<Button
								pressed={this.checkButtonIsPressed(pages.COVERED_AREA_PROFILE)}
								onClick={() => {
									this.setCurrentPage(pages.COVERED_AREA_PROFILE)
								}}
								text={locale.texts.COVERED_AREA_PROFILE}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<Button
								pressed={this.checkButtonIsPressed(pages.DEVICE_ALIASES)}
								onClick={() => {
									this.setCurrentPage(pages.DEVICE_ALIASES)
								}}
								text={locale.texts.DEVICE_ALIASES}
								block
							/>
						</Row>
						<Row style={style.rowContainer}>
							<Button
								pressed={this.checkButtonIsPressed(pages.PATIENT_ALIASES)}
								onClick={() => {
									this.setCurrentPage(pages.PATIENT_ALIASES)
								}}
								text={locale.texts.PATIENT_ALIASES}
								block
							/>
						</Row>
					</Col>
					<Col>{this.checkToRenderSubPage(locale)}</Col>
				</Row>
			</>
		)
	}
}

export default CustomSettings
