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
import ReactTable from 'react-table'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
const SelectTable = selecTableHOC(ReactTable)
import { shiftChangeRecordTableColumn } from '../../../config/tables'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { AppContext } from '../../../context/AppContext'
import styleConfig from '../../../config/styleConfig'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import { JSONClone } from '../../../helper/utilities'
import ShiftChange from '../ShiftChange'
import Select from 'react-select'
import Cookies from 'js-cookie'
import messageGenerator from '../../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../../config/wordMap'

class ShiftChangeRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		deviceGroupListOptions: [],
		devicelist: null,
		showForm: false,
		showShiftChange: false,
		locale: this.context.locale.abbr,
		selectAll: false,
		selection: [],
		showDeleteConfirmation: false,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr != prevState.locale) {
			this.getData()
		}
	}

	componentDidMount = () => {
		this.getData()
		this.getDeviceGroup()
	}

	getData(callback) {
		const { locale } = this.context

		apiHelper.record
			.getRecord(config.RECORD_TYPE.SHIFT_CHANGE, locale.abbr)
			.then((res) => {
				const columns = JSONClone(shiftChangeRecordTableColumn)

				columns.map((field) => {
					field.Header =
						locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
				})
				res.data.rows.map((item) => {
					item.shift =
						item.shift &&
						locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
				})
				this.setState(
					{
						data: res.data.rows,
						columns,
						locale: locale.abbr,
						selection: [],
						selectAll: false,
						showDeleteConfirmation: false,
					},
					callback
				)
			})
			.catch((err) => {
				console.log(`get shift change record failed ${err}`)
			})
	}

	toggleAll = () => {
		const selectAll = !this.state.selectAll
		const selection = []
		if (selectAll) {
			const wrappedInstance = this.selectTable.getWrappedInstance()
			const currentRecords = wrappedInstance.getResolvedState().sortedData
			currentRecords.forEach((item) => {
				if (item._original) {
					selection.push(item._original.id)
				}
			})
		}

		this.setState({ selectAll, selection })
	}

	toggleSelection = (key, shift, row) => {
		if (key != 999) {
			//多的
			let selection = [...this.state.selection]
			const selectThis = !this.state.selectThis

			key = typeof key == 'number' ? key : parseInt(key.split('-')[1])
			const keyIndex = selection.indexOf(key.toString())
			if (keyIndex >= 0) {
				selection = [
					...selection.slice(0, keyIndex),
					...selection.slice(keyIndex + 1),
				]
			} else {
				selection.push(key.toString())
			}

			this.setState({ selectThis, selection })
		}
	}

	isSelected = (key) => {
		return this.state.selection.includes(key)
	}

	deleteRecord = () => {
		const idPackage = []
		const deleteArray = []
		let deleteCount = 0

		this.state.data.map((item) => {
			this.state.selection.map((itemSelect) => {
				itemSelect == item.id ? deleteArray.push(deleteCount.toString()) : null
			})
			deleteCount += 1
		})

		deleteArray.map((item) => {
			this.state.data[item] == undefined
				? null
				: idPackage.push(parseInt(this.state.data[item].id))
		})

		apiHelper.record
			.deleteShiftChangeRecord({
				idPackage,
			})
			.then((res) => {
				const callback = () => {
					messageGenerator.setSuccessMessage(SAVE_SUCCESS)
				}
				this.getData(callback)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	handleCloseDeleteConfirmForm = () => {
		this.setState({
			showDeleteConfirmation: false,
		})
	}

	handleClose = () => {
		this.setState({
			showShiftChange: false,
		})
	}

	handleClick = (e) => {
		const name = e.target.getAttribute('name')

		switch (name) {
			case SHIFT_CHANGE:
				e.preventDefault()
				this.setState({
					showShiftChange: true,
				})
				break
		}
	}

	getDeviceGroup = () => {
		apiHelper.deviceGroupListApis
			.getDeviceGroupList()
			.then((res) => {
				const listId =
					Cookies.get('user') && JSON.parse(Cookies.get('user')).list_id
						? JSON.parse(Cookies.get('user')).list_id
						: null

				let devicelist = null

				const deviceGroupListOptions = res.data.map((item) => {
					const option = {
						label: item.name,
						value: item,
					}
					if (item.id == listId) {
						devicelist = option
					}
					return option
				})

				this.setState({
					deviceGroupListOptions,
					devicelist,
				})
			})
			.catch((err) => {
				console.log('err when get device group ', err)
			})
	}

	selectDeviceGroup = (devicelist) => {
		const { auth } = this.context
		const callback = async () => {
			const user = {
				...JSON.parse(Cookies.get('user')),
				list_id: devicelist.value.id,
			}
			await Cookies.set('user', user)
			auth.setListId(devicelist.value.id)
		}
		this.setState(
			{
				devicelist,
			},
			callback
		)
	}

	render() {
		const { locale } = this.context

		const { toggleSelection, toggleAll, isSelected } = this

		const { selectAll, selectType, devicelist } = this.state

		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
			selectType,
		}

		return (
			<Fragment>
				<div className="mb-">
					<div className="color-black mb-2">
						{locale.texts.SELECT_DEVICE_LIST}
					</div>
					<Select
						className="w-50"
						isClearable
						onChange={this.selectDeviceGroup}
						options={this.state.deviceGroupListOptions}
						value={this.state.devicelist}
					/>
				</div>
				<hr />
				<AccessControl
					renderNoAccess={() => null}
					platform={['browser', 'tablet']}
				>
					<ButtonToolbar>
						<PrimaryButton
							disabled={!devicelist}
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
				<hr />
				<div className="mb-2">
					<div className="d-flex justify-content-between mb-2">
						<div className="color-black mb-2">{locale.texts.VIEW_REPORT}</div>
						<PrimaryButton
							disabled={this.state.selection.length == 0}
							onClick={() => {
								this.setState({
									showDeleteConfirmation: true,
								})
							}}
						>
							{locale.texts.DELETE}
						</PrimaryButton>
					</div>
					<SelectTable
						keyField="id"
						data={this.state.data}
						columns={this.state.columns}
						ref={(r) => (this.selectTable = r)}
						className="-highlight text-none"
						onPageChange={(e) => {
							this.setState({ selectAll: false, selection: '' })
						}}
						onSortedChange={(e) => {
							this.setState({ selectAll: false, selection: '' })
						}}
						style={{ maxHeight: '75vh' }}
						{...extraProps}
						{...styleConfig.reactTable}
						NoDataComponent={() => null}
						getTrProps={(state, rowInfo, column, instance) => {
							return {
								onClick: (e, handleOriginal) => {
									const id = rowInfo.index + 1
									this.toggleSelection(id)
									if (handleOriginal) {
										handleOriginal()
									}
									apiHelper.fileApiAgent.getFile({
										path: rowInfo.original.file_path,
									})
								},
							}
						}}
					/>
				</div>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleCloseDeleteConfirmForm}
					handleSubmit={this.deleteRecord}
					message={locale.texts.ARE_YOU_SURE_TO_DELETE}
				/>
				<ShiftChange
					show={this.state.showShiftChange}
					handleClose={this.handleClose}
					listName={this.state.devicelist ? this.state.devicelist.label : null}
				/>
			</Fragment>
		)
	}
}

export default ShiftChangeRecord
