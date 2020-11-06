/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectEditedRecord.js

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
import { editObjectRecordTableColumn } from '../../../config/tables'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
const SelectTable = selecTableHOC(ReactTable)
import { AppContext } from '../../../context/AppContext'
import styleConfig from '../../../config/styleConfig'
import AccessControl from '../../authentication/AccessControl'
import { PrimaryButton } from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper'
import config from '../../../config'
import { JSONClone, formatTime } from '../../../helper/utilities'
import messageGenerator from '../../../helper/messageGenerator'

class ObjectEditedRecord extends React.Component {
	static contextType = AppContext

	state = {
		data: [],
		columns: [],
		showForm: false,
		locale: this.context.locale.abbr,
		selectAll: false,
		selection: [],
		showDeleteConfirmation: false,
	}

	componentDidMount = () => {
		this.getData()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.context.locale.abbr !== prevState.locale) {
			this.getData()
		}
	}

	getData = async () => {
		const { locale } = this.context
		const res = await apiHelper.record.getRecord(
			config.RECORD_TYPE.EDITED_OBJECT,
			locale.abbr
		)
		if (res) {
			const columns = JSONClone(editObjectRecordTableColumn)
			columns.forEach((field) => {
				field.Header =
					locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
			})
			const data = res.data.rows.map((item, index) => {
				item._id = index + 1
				item.new_status =
					locale.texts[item.new_status.toUpperCase().replace(/ /g, '_')]
				item.edit_time = formatTime(item.edit_time)
				return item
			})

			this.setState({
				data,
				columns,
				locale: locale.abbr,
			})
		}
	}

	toggleAll = () => {
		/*
            'toggleAll' is a tricky concept with any filterable table
            do you just select ALL the records that are in your data?
            OR
            do you only select ALL the records that are in the current filtered data?

            The latter makes more sense because 'selection' is a visual thing for the user.
            This is especially true if you are going to implement a set of external functions
            that act on the selected information (you would not want to DELETE the wrong thing!).

            So, to that end, access to the internals of ReactTable are required to get what is
            currently visible in the table (either on the current page or any other page).

            The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
            ReactTable and then get the internal state and the 'sortedData'.
            That can then be iterrated to get all the currently visible records and set
            the selection state.
        */
		const selectAll = !this.state.selectAll
		const selection = []
		if (selectAll) {
			// we need to get at the internals of ReactTable
			const wrappedInstance = this.selectTable.getWrappedInstance()
			// the 'sortedData' property contains the currently accessible records based on the filter and sort
			// const currentRecords = wrappedInstance.getResolvedState().sortedData;
			// we just push all the IDs onto the selection array
			const currentRecords = wrappedInstance.getResolvedState().sortedData
			currentRecords.forEach((item) => {
				if (item._original) {
					selection.push(item._original._id)
				}
			})
		}
		this.setState({ selectAll, selection })
	}

	toggleSelection = (key) => {
		/*
            Implementation of how to manage the selection state is up to the developer.
            This implementation uses an array stored in the component state.
            Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */

		let selection = [...this.state.selection]

		key = typeof key == 'number' ? key : parseInt(key.split('-')[1])
		const keyIndex = selection.indexOf(key)

		if (keyIndex >= 0) {
			selection = [
				...selection.slice(0, keyIndex),
				...selection.slice(keyIndex + 1),
			]
		} else {
			selection.push(key)
		}

		this.setState({
			selection,
		})
	}

	isSelected = (key) => {
		/*
            Instead of passing our external selection state we provide an 'isSelected'
            callback and detect the selection state ourselves. This allows any implementation
            for selection (either an array, object keys, or even a Javascript Set object).
        */
		return this.state.selection.includes(key)
	}

	deleteRecord = async () => {
		this.setState({ selectAll: false })
		const idPackage = []
		this.state.selection.forEach((item) => {
			idPackage.push(parseInt(this.state.data[item - 1].id))
		})

		try {
			await apiHelper.record.deleteEditObjectRecord({ idPackage })
			this.getData()
			this.setState({
				selection: [],
				selectAll: false,
				showDeleteConfirmation: false,
			})
		} catch (e) {
			console.log(e)
		}
	}

	handleCloseDeleteConfirmForm = () => {
		this.setState({
			showDeleteConfirmation: false,
		})
	}

	handleSubmitDeleteConfirmForm = () => {
		this.deleteRecord()
	}

	render() {
		const { locale } = this.context

		const { toggleSelection, toggleAll, isSelected } = this

		const { selectAll, selectType } = this.state

		const extraProps = {
			selectAll,
			isSelected,
			toggleAll,
			toggleSelection,
			selectType,
		}

		return (
			<Fragment>
				<div className="d-flex justify-content-start">
					<AccessControl
						renderNoAccess={() => null}
						platform={['browser', 'tablet']}
					>
						<ButtonToolbar>
							<PrimaryButton
								onClick={() => {
									this.setState({
										showDeleteConfirmation: true,
									})
								}}
							>
								{locale.texts.DELETE}
							</PrimaryButton>
						</ButtonToolbar>
					</AccessControl>
				</div>
				<hr />
				<SelectTable
					keyField="_id"
					data={this.state.data}
					columns={this.state.columns}
					ref={(r) => (this.selectTable = r)}
					className="-highlight text-none"
					onPageChange={() => {
						this.setState({ selectAll: false, selection: '' })
					}}
					onSortedChange={() => {
						this.setState({ selectAll: false, selection: '' })
					}}
					style={{ maxHeight: '75vh' }}
					{...extraProps}
					{...styleConfig.reactTable}
					NoDataComponent={() => null}
					getTrProps={(state, rowInfo) => {
						return {
							onClick: (e, handleOriginal) => {
								const id = rowInfo.original._id
								this.toggleSelection(id)

								if (handleOriginal) {
									handleOriginal()
								}
								if (rowInfo.original.file_path) {
									apiHelper.fileApiAgent.getFile({
										path: rowInfo.original.file_path,
									})
								} else {
									messageGenerator.setErrorMessage(
										locale.texts.FILE_URL_NOT_FOUND,
										2000
									)
								}
							},
						}
					}}
				/>
				<DeleteConfirmationForm
					show={this.state.showDeleteConfirmation}
					handleClose={this.handleCloseDeleteConfirmForm}
					handleSubmit={this.handleSubmitDeleteConfirmForm}
				/>
			</Fragment>
		)
	}
}

export default ObjectEditedRecord
