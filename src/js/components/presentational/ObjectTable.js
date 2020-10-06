/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ObjectTable.js

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
import { ButtonToolbar, Row } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import ReactTable from 'react-table'
import styleConfig from '../../config/styleConfig'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import EditObjectForm from './form/EditObjectForm'
import BindForm from '../presentational/form/BindForm'
import DissociationForm from '../container/DissociationForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import Select from 'react-select'
import axios from 'axios'
import BOTInput from '../presentational/BOTInput'
import dataSrc from '../../dataSrc'
const SelectTable = selecTableHOC(ReactTable)
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import messageGenerator from '../../helper/messageGenerator'
import { objectTableColumn } from '../../config/tables'
import config from '../../config'
import apiHelper from '../../helper/apiHelper'
import { transferMonitorTypeToString } from '../../helper/dataTransfer'
import moment from 'moment'
import {
    ADD,
    BIND,
    UNBIND,
    DELETE,
    DEVICE,
    SAVE_SUCCESS,
    DISASSOCIATE,
} from '../../config/wordMap'
import { JSONClone } from '../../helper/utilities'

class ObjectTable extends React.Component {
    static contextType = AppContext

    selectTableRef = React.createRef()

    state = {
        tabIndex: '',
        isShowEdit: false,
        selectedRowData: '',
        selection: [],
        selectAll: false,
        isShowBind: false,
        showDeleteConfirmation: false,
        isShowEditImportTable: false,
        bindCase: 0,
        warningSelect: 0,
        selectAll: false,
        formPath: '',
        formTitle: '',
        disableASN: false,
        done: false,
        data: [],
        columns: [],
        areaTable: [],
        objectTable: [],
        objectFilter: [],
        importData: [],
        filteredData: [],
        filterSelection: {},
        apiMethod: '',
        idleMacaddrSet: [],
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => {
        this.getData()
        this.getAreaTable()
        this.getIdleMacaddrSet()
        // this.getImportData()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getRefresh()
        }
    }

    getRefresh = () => {
        this.getAreaTable()
        this.getIdleMacaddrSet()

        let columns = JSONClone(objectTableColumn)

        let { locale } = this.context

        columns.map((field) => {
            field.Header =
                locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
        })

        this.state.data.map((item) => {
            item.area_name.label = locale.texts[item.area_name.value]
            item.registered_timestamp = moment(item.registered_timestamp._i)
                .locale(this.context.locale.abbr)
                .format('lll')
            item.area_name.label == undefined
                ? (item.area_name.label = '*site module error*')
                : null
        })

        this.state.filteredData.map((item) => {
            item.area_name.label = locale.texts[item.area_name.value]

            item.registered_timestamp = moment(item.registered_timestamp._i)
                .locale(this.context.locale.abbr)
                .format('lll')
            item.area_name.label == undefined
                ? (item.area_name.label = '*site module error*')
                : null
        })

        this.setState({
            columns,
            locale: this.context.locale.abbr,
        })
    }

    getAreaTable = () => {
        let { locale } = this.context

        apiHelper.areaApiAgent
            .getAreaTable()
            .then((res) => {
                let areaSelection = res.data.rows.map((area) => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name],
                    }
                })
                this.setState({
                    areaTable: res.data.rows,
                    areaSelection,
                    filterSelection: {
                        ...this.state.filterSelection,
                        areaSelection,
                    },
                })
            })
            .catch((err) => {
                console.log(`get area table failed ${err}`)
            })
    }

    getData = (callback) => {
        let { locale, auth } = this.context

        apiHelper.objectApiAgent
            .getObjectTable({
                locale: locale.abbr,
                areas_id: auth.user.areas_id,
                objectType: [0, 1, 2],
            })
            .then((res) => {
                let columns = JSONClone(objectTableColumn)
                let typeList = {}

                columns.map((field) => {
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })

                let data = res.data.rows
                    .filter((item) => item.object_type == 0)
                    .map((item) => {
                        item.monitor_type = transferMonitorTypeToString(
                            item,
                            'object'
                        )

                        item.status = {
                            value: item.status,
                            label: item.status
                                ? locale.texts[item.status.toUpperCase()]
                                : null,
                        }
                        item.transferred_location = item.transferred_location
                            .id && {
                            value: `${item.transferred_location.name}-${item.transferred_location.department}`,
                            label: `${item.transferred_location.name}-${item.transferred_location.department}`,
                        }

                        item.isBind = item.mac_address ? 1 : 0
                        item.mac_address = item.mac_address
                            ? item.mac_address
                            : locale.texts.NON_BINDING

                        if (!Object.keys(typeList).includes(item.type)) {
                            typeList[item.type] = {
                                value: item.type,
                                label: item.type,
                            }
                        }

                        item.area_name = {
                            value: item.area_name,
                            label: locale.texts[item.area_name],
                            id: item.area_id,
                        }

                        return item
                    })

                this.getIdleMacaddrSet()

                this.setState(
                    {
                        data,
                        isShowEdit: false,
                        isShowBind: false,
                        showDeleteConfirmation: false,
                        disableASN: false,
                        filteredData: data,
                        columns,
                        objectTable: res.data.rows,
                        filterSelection: {
                            ...this.state.filterSelection,
                            typeList,
                        },
                    },
                    callback
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getIdleMacaddrSet = async () => {
        await apiHelper.objectApiAgent
            .getIdleMacaddr()
            .then((res) => {
                let idleMacaddrSet = res.data.rows[0].mac_set
                let macOptions = idleMacaddrSet.map((mac) => {
                    return {
                        label: mac,
                        value: mac.replace(/:/g, ''),
                    }
                })
                this.setState({
                    idleMacaddrSet,
                    macOptions,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getImportData = (callback) => {
        let { locale } = this.context

        apiHelper.importedObjectApiAgent
            .getImportedObjectTable({
                locale: locale.abbr,
            })
            .then((res) => {
                this.setState(
                    {
                        importData: res.data.rows,
                    },
                    callback
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleClose = () => {
        this.setState({
            isShowBind: false,
            showDeleteConfirmation: false,
            isShowEditImportTable: false,
            isShowEdit: false,
            disableASN: false,
        })
    }

    objectMultipleDelete = () => {
        switch (this.state.action) {
            case DISASSOCIATE:
                apiHelper.objectApiAgent
                    .disassociate({
                        formOption: {
                            id: this.state.selectedRowData.id,
                        },
                    })
                    .then((res) => {
                        let callback = () => {
                            messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                        }
                        this.getData(callback)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                break

            case DELETE:
                let formOption = []
                var deleteArray = []
                var deleteCount = 0

                this.state.data.map((item) => {
                    this.state.selection.map((itemSelect) => {
                        itemSelect === item.id
                            ? deleteArray.push(deleteCount.toString())
                            : null
                    })
                    deleteCount += 1
                })

                this.setState({ selectAll: false })

                deleteArray.map((item) => {
                    this.state.data[item] === undefined
                        ? null
                        : formOption.push({
                              id: this.state.data[item].id,
                              mac_address: this.state.data[item].isBind
                                  ? this.state.data[item].mac_address
                                  : null,
                          })
                })

                apiHelper.objectApiAgent
                    .deleteObject({
                        formOption,
                    })
                    .then((res) => {
                        let callback = () => {
                            messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                        }
                        this.getData(callback)
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                this.setState({ selectAll: false, selection: [] })

                break
        }
    }

    handleSubmitForm = (formOption, cb) => {
        let { apiMethod } = this.state

        apiHelper.objectApiAgent[apiMethod]({
            formOption,
            mode: DEVICE,
        })
            .then((res) => {
                let callback = () => {
                    messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                }
                this.getData(callback)
            })
            .catch((error) => {
                console.log(error)
            })
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
            // const currentRecords = wrappedInstance.props.data
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

    handleClickButton = (e) => {
        let { name } = e.target
        let { locale } = this.context

        switch (name) {
            case ADD:
                this.setState({
                    isShowEdit: true,
                    formTitle: name,
                    selectedRowData: [],
                    formPath: dataSrc.addObject,
                    disableASN: false,
                    apiMethod: 'post',
                })
                break
            case BIND:
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                    apiMethod: 'post',
                })
                break
            case UNBIND:
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                    apiMethod: 'post',
                })
                break
            case DELETE:
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect: 1,
                    action: DELETE,
                    message: locale.texts.ARE_YOU_SURE_TO_DELETE,
                })
                break

            // case DISASSOCIATE:
            //     this.setState({
            //         formTitle: name,
            //         isShowEditImportTable: true
            //     })
            //     break;

            case DISASSOCIATE:
                this.setState({
                    showDeleteConfirmation: true,
                    action: DISASSOCIATE,
                    message: locale.texts.ARE_YOU_SURE_TO_DISASSOCIATE,
                })
                break
        }
    }

    filterData = (data, key, filteredAttribute) => {
        const { locale } = this.context
        key = key.toLowerCase()
        let filteredData = data.filter((obj) => {
            if (filteredAttribute.includes('name')) {
                let keyRex = new RegExp(key)
                if (obj.name.toLowerCase().match(keyRex)) {
                    return true
                }
            }
            if (filteredAttribute.includes('type')) {
                let keyRex = new RegExp(key)

                if (obj.type.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('acn')) {
                let keyRex = new RegExp(key)
                if (obj.asset_control_number.toLowerCase().match(keyRex))
                    return true
            }

            if (filteredAttribute.includes('status')) {
                let keyRex = new RegExp(key.toLowerCase())

                if (obj.status.label.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('area')) {
                let keyRex = new RegExp(key)
                if (obj.area_name.label != undefined) {
                    if (obj.area_name.label.match(keyRex)) {
                        return true
                    }
                }
            }

            if (filteredAttribute.includes('monitor')) {
                let keyRex = new RegExp(key)
                if (obj.monitor_type.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('macAddress')) {
                let keyRex = key.replace(/:/g, '')
                if (
                    obj.mac_address
                        .replace(/:/g, '')
                        .toLowerCase()
                        .match(keyRex)
                )
                    return true
            }

            if (filteredAttribute.includes('sex')) {
                if (obj.object_type == key) {
                    return true
                }
            }

            if (filteredAttribute.includes('physician_name')) {
                let keyRex = new RegExp(key)

                if (
                    obj.physician_name &&
                    obj.physician_name.toLowerCase().match(keyRex)
                ) {
                    return true
                }
            }

            return false
        })

        return filteredData
    }

    addObjectFilter = (key, attribute, source) => {
        this.state.objectFilter = this.state.objectFilter.filter(
            (filter) => source != filter.source
        )

        this.state.objectFilter.push({
            key,
            attribute,
            source,
        })
        this.filterObjects()
    }

    removeObjectFilter = (source) => {
        this.state.objectFilter = this.state.objectFilter.filter(
            (filter) => source != filter.source
        )
        this.filterObjects()
    }

    filterObjects = () => {
        let filteredData = this.state.objectFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.data)

        this.setState({
            filteredData,
        })
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

        const { locale } = this.context
        let typeSelection = this.state.filterSelection.typeList
            ? Object.values(this.state.filterSelection.typeList)
            : null

        return (
            <div>
                <Row className="d-flex justify-content-between my-4">
                    <div className="d-flex justify-content-start">
                        <BOTInput
                            className="mx-2 w-30-view min-height-regular"
                            placeholder={locale.texts.SEARCH}
                            getSearchKey={(key) => {
                                this.addObjectFilter(
                                    key,
                                    [
                                        'name',
                                        'type',
                                        'area',
                                        'status',
                                        'macAddress',
                                        'acn',
                                    ],
                                    'search bar'
                                )
                            }}
                            clearSearchResult={null}
                        />
                        <AccessControl
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Select
                                name="Select Type"
                                className="mx-2 w-30-view min-height-regular"
                                styles={styleConfig.reactSelectFilter}
                                onChange={(value) => {
                                    if (value) {
                                        this.addObjectFilter(
                                            value.label,
                                            ['type'],
                                            'type select'
                                        )
                                    } else {
                                        this.removeObjectFilter('type select')
                                    }
                                }}
                                options={typeSelection}
                                isClearable={true}
                                isSearchable={true}
                                placeholder={locale.texts.TYPE}
                            />
                            <Select
                                name="Select Area"
                                className="mx-2 w-30-view min-height-regular"
                                styles={styleConfig.reactSelectFilter}
                                onChange={(value) => {
                                    if (value) {
                                        this.addObjectFilter(
                                            value.label,
                                            ['area'],
                                            'area select'
                                        )
                                    } else {
                                        this.removeObjectFilter('area select')
                                    }
                                }}
                                options={
                                    this.state.filterSelection.areaSelection
                                }
                                isClearable={true}
                                isSearchable={true}
                                placeholder={locale.texts.AREA}
                            />
                            <Select
                                name="Select Status"
                                className="mx-2 w-30-view min-height-regular"
                                styles={styleConfig.reactSelectFilter}
                                onChange={(value) => {
                                    if (value) {
                                        this.addObjectFilter(
                                            value.label,
                                            ['status'],
                                            'status select'
                                        )
                                    } else {
                                        this.removeObjectFilter('status select')
                                    }
                                }}
                                options={
                                    this.state.filterSelection.statusOptions
                                }
                                isClearable={true}
                                isSearchable={true}
                                placeholder={locale.texts.STATUS}
                            />
                        </AccessControl>
                    </div>
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <PrimaryButton
                                name={BIND}
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.BIND}
                            </PrimaryButton>
                            <PrimaryButton
                                name={ADD}
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ADD_DEVICE}
                            </PrimaryButton>
                            {/* <PrimaryButton
                                name={UNBIND}
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.UNBIND}
                            </PrimaryButton> */}
                            <PrimaryButton
                                name={DELETE}
                                onClick={this.handleClickButton}
                                disabled={this.state.selection.length == 0}
                            >
                                {locale.texts.DELETE_DEVICE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </Row>
                <hr />
                <SelectTable
                    keyField="id"
                    data={this.state.filteredData}
                    columns={this.state.columns}
                    ref={(r) => (this.selectTable = r)}
                    className="-highlight text-none"
                    style={{ maxHeight: '70vh' }}
                    onPageChange={(e) => {
                        this.setState({ selectAll: false, selection: '' })
                    }}
                    onSortedChange={(e) => {
                        this.setState({ selectAll: false, selection: '' })
                    }}
                    {...extraProps}
                    {...styleConfig.reactTable}
                    NoDataComponent={() => null}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {
                                if (!e.target.type) {
                                    this.setState({
                                        isShowEdit: true,
                                        selectedRowData: rowInfo.original,
                                        formTitle: 'edit object',
                                        disableASN: true,
                                        apiMethod: 'put',
                                    })
                                }
                            },
                        }
                    }}
                />
                <EditObjectForm
                    show={this.state.isShowEdit}
                    title={this.state.formTitle}
                    selectedRowData={selectedRowData || ''}
                    handleClick={this.handleClickButton}
                    handleSubmit={this.handleSubmitForm}
                    handleClose={this.handleClose}
                    formPath={this.state.formPath}
                    data={this.state.data}
                    objectTable={this.state.objectTable}
                    disableASN={this.state.disableASN}
                    areaTable={this.state.areaTable}
                    // idleMacaddrSet={this.state.idleMacaddrSet}
                    macOptions={this.state.macOptions}
                />
                <BindForm
                    show={this.state.isShowBind}
                    bindCase={this.state.bindCase}
                    title={this.state.formTitle}
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable}
                    ImportData={this.state.importData}
                    areaTable={this.state.areaTable}
                    macOptions={this.state.macOptions}
                    data={this.state.importData.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item
                        return dataMap
                    }, {})}
                />
                <DissociationForm
                    show={this.state.isShowEditImportTable}
                    title={this.state.formTitle}
                    selectedRowData={
                        this.state.selectedRowData || 'handleAllDelete'
                    }
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={'xx'}
                    objectTable={this.state.objectTable}
                    refreshData={this.state.refreshData}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                    }, {})}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation}
                    handleClose={this.handleClose}
                    message={this.state.message}
                    handleSubmit={this.objectMultipleDelete}
                />
            </div>
        )
    }
}
export default ObjectTable
