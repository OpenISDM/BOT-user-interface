import React, { Fragment } from 'react'
import {
    getObjectTable,
    getAreaTable,
    getUserList,
    getLbeaconTable,
    getImportTable,
    getImportPatient,
    getTransferredLocation,
} from '../../../dataSrc'
import axios from 'axios'
import 'react-table/react-table.css'
import { Button, Container } from 'react-bootstrap'
import {
    objectTableColumn,
    patientTableColumn,
    importTableColumn,
} from '../../../config/tables'
import config from '../../../config'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'
import ImportObjectTable from '../../presentational/ImportObjectTable'
import ImportPatientTable from '../../presentational/ImportPatientTable'
import DissociationForm from '../DissociationForm'
import apiHelper from '../../helper/apiHelper'

class ObjectManagementContainer extends React.Component {
    static contextType = AppContext

    state = {
        column: [], //設備列表的欄位設定
        columnImport: [], //匯入的欄位設定
        columnPatient: [], //病人列表的欄位設定
        data: [], //object data
        dataImport: [], //object import data
        dataPatient: [], //patient data
        dataImportPatient: [], // patient import data
        objectTable: [], //ＤＢ抓出來的object table data
        locale: this.context.locale.abbr,
        tabIndex: 0,
        roomOptions: {},
        transferredLocationList: [],
        filterSelection: {
            statusOptions: config.statusOptions.map((item) => {
                return {
                    value: item,
                    label: this.context.locale.texts[
                        item.replace(/ /g, '_').toUpperCase()
                    ],
                }
            }),
            monitorTypeOptions: config.monitorOptions.map((item) => {
                return {
                    value: item,
                    label: item,
                }
            }),
        },
        objectFilter: [],
        patientFilter: [],
        formTitle: '',
        areaTable: [],
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr != prevState.locale) {
            this.getData()
            this.getDataImport()
            this.setState({
                locale: this.context.locale.abbr,
            })
        }
    }

    componentDidMount = () => {
        this.getTransferredLocation()
        this.getDataImport()
        this.getPhysicianList()
        this.getLbeaconData()
        this.getAreaTable()
    }

    getAreaTable = () => {
        const { locale } = this.context

        apiHelper.areaApiAgent
            .getAreaTable()
            .then((res) => {
                const areaSelection = res.data.rows.map((area) => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name],
                    }
                })
                this.setState({
                    areaTable: res.data.rows,
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

    getPhysicianList = () => {
        const { locale } = this.context
        axios
            .post(getUserList, {
                locale: locale.abbr,
            })
            .then((res) => {
                const physicianList = res.data.rows.filter((user) => {
                    return user.role_type.includes('care_provider')
                })

                this.setState({
                    physicianList,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getDataImport = () => {
        const { locale } = this.context
        axios
            .post(getImportTable, {
                locale: locale.abbr,
            })
            .then((res) => {
                const columnImport = JSONClone(importTableColumn)
                columnImport.map((field) => {
                    field.headerStyle = {
                        textAlign: 'left',
                    }
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })

                res.data.rows.map((item) => {
                    item.status = {
                        value: item.status,
                        label: item.status
                            ? locale.texts[item.status.toUpperCase()]
                            : null,
                    }
                    item.transferred_location = item.transferred_location
                        ? {
                            value: item.transferred_location,
                            label:
                                  locale.texts[
                                      item.transferred_location
                                          .toUpperCase()
                                          .replace(/ /g, '_')
                                  ],
                            label: item.transferred_location
                                .toUpperCase()
                                .split(',')
                                .map((item) => {
                                    return locale.texts[item]
                                })
                                .join(),
                        }
                        : ''
                    item.area_name = {
                        value: config.mapConfig.areaOptions[item.area_id],
                        label:
                            locale.texts[
                                config.mapConfig.areaOptions[item.area_id]
                            ],
                    }
                })

                this.setState({
                    dataImport: res.data.rows,
                    columnImport,
                })
            })
            .catch((err) => {
                console.log(err)
            })

        axios
            .post(getImportPatient, {
                locale: locale.abbr,
            })
            .then((res) => {
                this.setState({
                    dataImportPatient: res.data.rows,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getTransferredLocation = () => {
        const { locale } = this.context
        axios.get(getTransferredLocation).then((res) => {
            const transferredLocationOptions = res.data.map((branch) => {
                return {
                    label: branch.branch_name,
                    value: branch,
                    options: branch.department.map((department, index) => {
                        return {
                            label: `${department},${branch.branch_name}`,
                            value: {
                                branch,
                                departmentId: index,
                            },
                        }
                    }),
                    id: branch.id,
                }
            })
            this.setState({
                transferredLocationList: transferredLocationOptions,
            })
            this.getData()
        })
    }

    getData = () => {
        const { locale, auth } = this.context

        apiHelper.objectApiAgent
            .getObjectTable({
                locale: locale.abbr,
                areas_id: auth.user.areas_id,
                objectType: [0, 1, 2],
            })
            .then((res) => {
                const column = objectTableColumn
                const columnPatient = patientTableColumn
                const data = []
                const dataPatient = []
                const typeList = {}
                column.push({
                    Header: '',
                    accessor: 'Delete Option',
                    minWidth: 60,
                    Cell: (props) => (
                        <Button
                            variant="outline-danger"
                            className="text-capitalize ml-3 mr-2 py-0"
                            style={{ background: 'none' }}
                            onClick={() => this.handleRemove(props)}
                        >
                            {locale.texts.REMOVE}
                        </Button>
                    ),
                })

                column.map((field) => {
                    field.headerStyle = {
                        textAlign: 'left',
                    }
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })

                columnPatient.map((field) => {
                    field.headerStyle = {
                        textAlign: 'left',
                    }
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })

                res.data.rows.map((item) => {
                    if (item.object_type != 0) {
                        item.monitor_type = this.getMonitorTypeArray(
                            item,
                            'patient'
                        ).join('/')
                        item.object_type =
                            locale.texts.genderSelect[item.object_type]
                        dataPatient.push(item)
                    } else {
                        item.monitor_type = this.getMonitorTypeArray(
                            item,
                            'object'
                        ).join('/')

                        item.status = {
                            value: item.status,
                            label: item.status
                                ? locale.texts[item.status.toUpperCase()]
                                : null,
                        }

                        if (item.transferred_location) {
                            const ids = item.transferred_location.split(',')
                            const branchId = ids[0],
                                departmentId = ids[1]
                            if (item.transferred_location) {
                                const branch = this.state.transferredLocationList.filter(
                                    (branch) => {
                                        if (branch.id == branchId) {
                                            return true
                                        }
                                        return false
                                    }
                                )
                                const department = branch[0]
                                    ? branch[0].options[departmentId]
                                    : null
                                item.transferred_location = department
                            }
                        }

                        if (!Object.keys(typeList).includes(item.type)) {
                            typeList[item.type] = {
                                value: item.type,
                                label: item.type,
                            }
                        }
                        data.push(item)
                    }
                    item.area_name = {
                        value: item.area_name,
                        label: locale.texts[item.area_name],
                        id: item.area_id,
                    }
                })

                this.setState({
                    data,
                    filteredData: data,
                    column,
                    dataPatient,
                    filteredPatient: dataPatient,
                    columnPatient,
                    objectTable: res.data.rows,
                    filterSelection: {
                        ...this.state.filterSelection,
                        typeList,
                    },
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getMonitorTypeArray = (item, type) => {
        return Object.keys(config.monitorType).reduce(
            (checkboxGroup, index) => {
                if (item.monitor_type & index) {
                    checkboxGroup.push(config.monitorType[index])
                }
                return checkboxGroup
            },
            []
        )
    }

    getLbeaconData = () => {
        const { locale } = this.context

        apiHelper.lbeaconApiAgent
            .getLbeaconTable({
                locale: locale.abbr,
            })
            .then((res) => {
                const roomOptions = []
                res.data.rows.map((item) => {
                    if (item.room) {
                        roomOptions.push({
                            value: item.id,
                            label: item.room,
                        })
                    }
                })
                this.setState({
                    roomOptions,
                })
            })
            .catch((err) => {
                console.log('get lbeacon data fail : ' + err)
            })
    }

    refreshData = () => {
        //重整用
        if (this.state.tabIndex >= 2) {
            this.setState({
                tabIndex: this.state.tabIndex - 1,
            })
            this.setState({
                tabIndex: this.state.tabIndex + 1,
            })
        }

        setTimeout(this.getData, 500)
        setTimeout(this.getDataPatient, 500)
        setTimeout(this.getDataImport, 500)
    }

    handleRemove = (key) => {
        //button在欄位裡，欄位在OBJECT MANAGER裡創的
        this.setState({
            selectedObjectData: key.original,
            isShowEditImportTable: true,
            formTitle: 'dissociation',
        })
    }
    handleClose = () => {
        this.setState({
            selectedObjectData: '',
            isShowEditImportTable: false,
            formTitle: '',
        })
    }

    filterData = (data, key, filteredAttribute) => {
        const { locale } = this.context
        key = key.toLowerCase()
        const filteredData = data.filter((obj) => {
            if (filteredAttribute.includes('name')) {
                const keyRex = new RegExp(key)
                if (obj.name.toLowerCase().match(keyRex)) {
                    return true
                }
            }
            if (filteredAttribute.includes('type')) {
                const keyRex = new RegExp(key)

                if (obj.type.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('acn')) {
                const keyRex = new RegExp(key)
                if (obj.asset_control_number.toLowerCase().match(keyRex))
                    return true
            }

            if (filteredAttribute.includes('status')) {
                const keyRex = new RegExp(key.toLowerCase())

                if (obj.status.label.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('area')) {
                const keyRex = new RegExp(key)
                if (obj.area_name.label.match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('monitor')) {
                const keyRex = new RegExp(key)
                if (obj.monitor_type.toLowerCase().match(keyRex)) {
                    return true
                }
            }

            if (filteredAttribute.includes('macAddress')) {
                const keyRex = key.replace(/:/g, '')
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
                const keyRex = new RegExp(key)

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
        const filteredData = this.state.objectFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.data)

        this.setState({
            filteredData,
        })
    }

    addPatientFilter = (key, attribute, source) => {
        this.state.patientFilter = this.state.patientFilter.filter(
            (filter) => source != filter.source
        )
        this.state.patientFilter.push({
            key,
            attribute,
            source,
        })

        this.filterPatients()
    }

    removePatientFilter = (source) => {
        this.state.patientFilter = this.state.patientFilter.filter(
            (filter) => source != filter.source
        )
        this.filterPatients()
    }

    filterPatients = () => {
        const filteredPatient = this.state.patientFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.dataPatient)
        this.setState({
            filteredPatient,
        })
    }

    tabList = [
        {
            name: 'object table',
            component: (props) => <ObjectTable {...props} />,
            platform: ['browser'],
        },
        {
            name: 'patient table',
            component: (props) => <PatientTable {...props} />,
        },
        {
            name: 'import object table',
            component: (props) => <ImportObjectTable {...props} />,
        },
        {
            name: 'import patient table',
            component: (props) => <ImportPatientTable {...props} />,
        },
    ]

    defaultActiveKey = 'Edit_Object_Management'

    render() {
        const { filterSelection } = this.state

        const { locale } = this.context

        const style = {
            sidenav: {
                width: 150,
            },
            sidemain: {
                marginLeft: 150,
            },
            container: {
                overflowX: 'hide',
            },
        }

        const typeSelection = filterSelection.typeList
            ? Object.values(filterSelection.typeList)
            : null

        return (
            <Container
                fluid
                className="mt-5 text-capitalize"
                style={style.container}
            >
                <Tabs
                    selectedIndex={this.state.tabIndex}
                    onSelect={(tabIndex) => {
                        this.setState({ tabIndex })
                    }}
                    direction="rtl"
                >
                    <TabList>
                        <Tab>{locale.texts.DEVICE_FORM}</Tab>
                        <Tab>{locale.texts.PATIENT_FORM}</Tab>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                        >
                            <Tab>{locale.texts.IMPORT_DEVICES_DATA}</Tab>
                        </AccessControl>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                        >
                            <Tab>{locale.texts.IMPORT_PATIENTS_DATA}</Tab>
                        </AccessControl>
                    </TabList>

                    <TabPanel>
                        <ObjectTable
                            data={this.state.filteredData}
                            columns={this.state.column}
                            refreshData={this.refreshData}
                            importData={this.state.dataImport}
                            objectTable={this.state.objectTable}
                            addObjectFilter={this.addObjectFilter}
                            removeObjectFilter={this.removeObjectFilter}
                            typeSelection={typeSelection}
                            filterSelection={this.state.filterSelection}
                            areaTable={this.state.areaTable}
                        />
                    </TabPanel>

                    <TabPanel>
                        <PatientTable
                            data={this.state.filteredPatient}
                            columns={this.state.columnPatient}
                            refreshData={this.refreshData}
                            importData={this.state.dataImport}
                            objectTable={this.state.objectTable}
                            addPatientFilter={this.addPatientFilter}
                            removePatientFilter={this.removePatientFilter}
                            typeSelection={typeSelection}
                            filterSelection={this.state.filterSelection}
                            dataImportPatient={this.state.dataImportPatient}
                            physicianList={this.state.physicianList}
                            roomOptions={this.state.roomOptions}
                            areaTable={this.state.areaTable}
                        />
                    </TabPanel>

                    <TabPanel>
                        <ImportObjectTable
                            dataImport={this.state.dataImport}
                            columnImport={this.state.columnImport}
                            refreshData={this.refreshData}
                        />
                    </TabPanel>

                    <TabPanel>
                        <ImportPatientTable
                            dataImportPatient={this.state.dataImportPatient}
                            columnImport={this.state.columnImport}
                            refreshData={this.refreshData}
                        />
                    </TabPanel>
                </Tabs>
                <DissociationForm
                    show={this.state.isShowEditImportTable}
                    title={this.state.formTitle}
                    selectedObjectData={
                        this.state.selectedObjectData || 'handleAllDelete'
                    }
                    refreshData={this.refreshData}
                    formPath={this.state.formPath}
                    objectTable={this.state.objectTable}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                    }, {})}
                />
            </Container>
        )
    }
}

export default ObjectManagementContainer
