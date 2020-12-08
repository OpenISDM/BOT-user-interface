/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        CustomSettings.js

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

import React from 'react'
import { debounce } from 'lodash'
import { ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../../../context/AppContext'
import apiHelper from '../../../helper/apiHelper'
import ReactTable from 'react-table'
import styleConfig from '../../../config/styleConfig'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import messageGenerator from '../../../helper/messageGenerator'

class CustomSettings extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		changedIndex: [],
	}

	componentDidMount = () => {
		this.getData()
	}

	showMessage = debounce(
		() => {
			messageGenerator.setSuccessMessage('save success')
		},
		1500,
		{
			leading: true,
			trailing: false,
		}
	)

	chekcinAliases = async () => {
		const objectTypeList = this.state.changedIndex.map((index) => {
			return this.state.data[index]
		})
		try {
			await apiHelper.objectApiAgent.editAliases({
				objectTypeList,
			})
			const changedIndex = []
			this.setState({ changedIndex })
			this.showMessage()
		} catch (e) {
			console.log(`checkin aliases failed ${e}`)
		}
	}

	getData = async () => {
		const { locale } = this.context
		try {
			const res = await apiHelper.objectApiAgent.getAlias()
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
									const data = this.state.data
									const changedIndex = this.state.changedIndex
									data[props.index].type_alias = e.target.value
									if (!changedIndex.includes(props.index)) {
										changedIndex.push(props.index)
									}
									this.setState({
										data,
										changedIndex,
									})
								}}
							/>
						)
					},
				},
			]

			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})

			this.setState({
				data: res.data,
				columns,
			})
		} catch (e) {
			console.log(`get object alias failed ${e}`)
		}
	}

	render() {
		const { locale } = this.context

		return (
			<div className="d-flex flex-column">
				<div className="mb-">
					<div className="color-black mb-2 font-size-120-percent">
						{locale.texts.EDIT_DEVICE_ALIAS}
					</div>
					<div className="color-black mb-2 font-size-120-percent">
						<ButtonToolbar>
							<PrimaryButton name={'SAVE'} onClick={this.chekcinAliases}>
								{locale.texts.SAVE}
							</PrimaryButton>
						</ButtonToolbar>
					</div>
					<ReactTable
						data={this.state.data}
						columns={this.state.columns}
						resizable={true}
						freezeWhenExpanded={false}
						{...styleConfig.reactTable}
						pageSize={10}
					/>
				</div>
			</div>
		)
	}
}

export default CustomSettings
