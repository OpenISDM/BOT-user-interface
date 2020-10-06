/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MonitorSettingBlock.js

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
import { AppContext } from '../../context/AppContext'
import { ButtonToolbar, Button } from 'react-bootstrap'
import config from '../../config'
import ReactTable from 'react-table'
import styleConfig from '../../config/styleConfig'
import EditMonitorConfigForm from '../presentational/form/EditMonitorConfigForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import { monitorConfigColumn } from '../../config/tables'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import messageGenerator from '../../helper/messageGenerator'
const SelectTable = selecTableHOC(ReactTable)
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import apiHelper from '../../helper/apiHelper'
import { JSONClone } from '../../helper/utilities'

class MonitorSettingBlock extends React.Component {
    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        path: '',
        areaOptions: [],
        isEdited: false,
        selection: [],
        selectAll: false,
        exIndex: 9999,
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => {
        this.getMonitorConfig()
    }

    getMonitorConfig = (callback) => {
        let { auth, locale } = this.context
        apiHelper.monitor
            .getMonitorConfig(this.props.type, auth.user.areas_id)
            .then((res) => {
                let columns = JSONClone(monitorConfigColumn)

                columns.map((field) => {
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })
                res.data.map((item, index) => {
                    item.area = {
                        value: config.mapConfig.areaOptions[item.area_id],
                        label:
                            locale.texts[
                                config.mapConfig.areaOptions[item.area_id]
                            ],
                        id: item.area_id,
                    }
                })
                this.setState(
                    {
                        data: res.data,
                        columns,
                        show: false,
                        showDeleteConfirmation: false,
                        selectedData: null,
                        selection: '',
                        selectAll: false,
                    },
                    callback
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleSubmit = (pack) => {
        let configPackage = pack ? pack : {}
        let { path, selectedData } = this.state
        configPackage['type'] = config.monitorSettingUrlMap[this.props.type]
        // configPackage["id"] = selectedData ? selectedData.id : null;
        configPackage['id'] = this.state.selection
        if (configPackage['id'] == '' && this.state.selectedData != null) {
            configPackage['id'] = this.state.selectedData.id
        }

        apiHelper.monitor[path](configPackage)
            .then((res) => {
                let callback = () =>
                    messageGenerator.setSuccessMessage('save success')
                this.getMonitorConfig(callback)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null,
        })
    }

    handleClickButton = (e, value) => {
        let { name } = e.target
        switch (name) {
            case 'add rule':
                this.setState({
                    show: true,
                    isEdited: false,
                    path: 'add',
                })
                break
            case 'edit':
                this.setState({
                    show: true,
                    selectedData: value.original,
                    isEdited: true,
                    path: 'put',
                })
                break
            case 'delete':
                this.setState({
                    showDeleteConfirmation: true,
                    path: 'delete',
                })
                break
        }
    }

    toggleSelection = (key, shift, row) => {
        let selection = [...this.state.selection]
        key = key.split('-')[1] ? key.split('-')[1] : key
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

    toggleAll = () => {
        const selectAll = this.state.selectAll ? false : true
        let selection = []
        let rowsCount = 0

        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance()
            //const currentRecords = wrappedInstance.props.data
            const currentRecords = wrappedInstance.getResolvedState().sortedData
            currentRecords.forEach((item) => {
                rowsCount++
                if (
                    rowsCount >
                        wrappedInstance.state.pageSize *
                            wrappedInstance.state.page &&
                    rowsCount <=
                        wrappedInstance.state.pageSize +
                            wrappedInstance.state.pageSize *
                                wrappedInstance.state.page
                ) {
                    selection.push(item._original.id)
                }
            })
        } else {
            selection = []
        }
        this.setState({ selectAll, selection })
    }

    isSelected = (key) => {
        return this.state.selection.includes(key)
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.exIndex != this.props.nowIndex) {
            this.setState({
                selectAll: false,
                selection: '',
                exIndex: this.props.nowIndex,
            })
        }
        if (this.context.locale.abbr !== prevState.locale) {
            this.getMonitorConfig()
            this.setState({
                locale: this.context.locale.abbr,
            })
        }
    }

    render() {
        const { selectedRowData, selectAll, selectType } = this.state

        const { toggleSelection, toggleAll, isSelected } = this

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType,
        }

        let { locale } = this.context

        let { type } = this.props

        let { isEdited } = this.state

        let areaOptions = Object.values(config.mapConfig.AREA_MODULES).map(
            (area, index) => {
                return {
                    value: area.name,
                    label: locale.texts[area.name],
                    id: area.id,
                }
            }
        )

        let title = `edit ${type}`.toUpperCase().replace(/ /g, '_')
        return (
            <div>
                <div className="d-flex justify-content-start">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <PrimaryButton
                                className="mr-2 mb-1"
                                name="add rule"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ADD_RULE}
                            </PrimaryButton>
                            <PrimaryButton
                                className="mr-2 mb-1"
                                name="delete"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr />
                <SelectTable
                    keyField="id"
                    data={this.state.data}
                    columns={this.state.columns}
                    ref={(r) => (this.selectTable = r)}
                    className="-highlight"
                    minRows={0}
                    {...extraProps}
                    {...styleConfig.reactTable}
                    onSortedChange={(e) => {
                        this.setState({ selectAll: false, selection: '' })
                    }}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.setState({
                                    selectedData: rowInfo.row._original,
                                    show: true,
                                    isEdited: true,
                                    path: 'put',
                                })
                            },
                        }
                    }}
                />
                <EditMonitorConfigForm
                    handleShowPath={this.show}
                    selectedData={this.state.selectedData}
                    show={this.state.show}
                    handleClose={this.handleClose}
                    title={title}
                    type={config.monitorSettingUrlMap[this.props.type]}
                    handleSubmit={this.handleSubmit}
                    areaOptions={areaOptions}
                    isEdited={isEdited}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation}
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default MonitorSettingBlock
