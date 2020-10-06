import React from 'react'
import { Col, Row, Button, ButtonToolbar, Modal, Form } from 'react-bootstrap'
import axios from 'axios'
import dataSrc from '../../../dataSrc'
// import AddableList from './AddableList'
import { AppContext } from '../../../context/AppContext'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { getName, getType, getACN } from '../../../helper/descriptionGenerator'
import apiHelper from '../../../helper/apiHelper'
import { PrimaryButton } from '../../BOTComponent/styleComponent'

import DualListBox from './DualListBox'
import messageGenerator from '../../../helper/messageGenerator'
import { SAVE_SUCCESS } from '../../../config/wordMap'
import EditListForm from '../../presentational/form/EditListForm'

const style = {
    list: {
        // wordBreak: 'keep-all',
        zIndex: 1,
    },
    item: {
        minWidth: 35,
    },
}

class DeviceGroupManager extends React.Component {
    static contextType = AppContext

    reNameRef = React.createRef()

    state = {
        selectedDeviceGroup: null,
        renameGroup: false,
    }
    componentDidMount = () => {
        this.getObjectData()
        this.getDeviceGroup('Mount')
        this.getAreaTable()
    }

    reload = () => {
        this.getObjectData()
        this.getDeviceGroup()
    }

    newDeviceGroup = (values) => {
        apiHelper.deviceGroupListApis
            .addDeviceGroupList({
                name: values.name,
                area_id: values.area.id,
            })
            .then((res) => {
                let callback = () => {
                    messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                }
                this.setState(
                    {
                        // selectedDeviceGroup: {id:res.data}
                        renameGroup: false,
                    },
                    callback
                )
                this.reload()
            })
            .catch((err) => {
                console.log(`add list failed ${err}`)
            })
    }

    addDeviceToGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id

        apiHelper.deviceGroupListApis
            .modifyDeviceGroupList({
                groupId: this.state.selectedDeviceGroup.id,
                mode: 0,
                itemACN: item.asset_control_number,
                item_id: item.id,
            })
            .then((res) => {
                this.reload()
            })
            .catch((err) => console.log(err))
    }

    removeDeviceFromGroup = (item) => {
        const groupId = this.state.selectedDeviceGroup.id

        apiHelper.deviceGroupListApis
            .modifyDeviceGroupList({
                groupId: this.state.selectedDeviceGroup.id,
                mode: 1,
                itemACN: item.asset_control_number,
                item_id: item.id,
            })
            .then((res) => {
                this.reload()
            })
            .catch((err) => console.log(err))
    }

    renameGroup = (newName) => {
        const groupId = this.state.selectedDeviceGroup.id

        apiHelper.deviceGroupListApis
            .modifyDeviceGroupList({
                groupId: this.state.selectedDeviceGroup.id,
                mode: 2,
                newName: newName,
            })
            .then((res) => {
                this.reload()
                this.setState({
                    renameGroup: false,
                })
            })
            .catch((err) => console.log(err))
    }

    deleteGroup = () => {
        apiHelper.deviceGroupListApis
            .deleteGroup({
                groupId: this.state.selectedDeviceGroup.id,
            })
            .then((res) => {
                this.reload()
            })
            .catch((err) => console.log(err))
    }

    selectDeviceGroup = (deviceGroup) => {
        this.setState({
            selectedDeviceGroup: deviceGroup ? deviceGroup.value : null,
        })
    }

    getObjectData = (isMount) => {
        let { locale, auth } = this.context
        apiHelper.objectApiAgent
            .getObjectTable({
                locale: locale.abbr,
                areas_id: auth.user.areas_id,
                objectType: [0],
            })
            .then((res) => {
                this.setState({
                    allDevices: res.data.rows,
                })
            })
    }

    getAreaTable = () => {
        let { locale } = this.context

        apiHelper.areaApiAgent
            .getAreaTable()
            .then((res) => {
                let areaOptions = res.data.rows.map((area) => {
                    return {
                        id: area.id,
                        value: area.name,
                        label: locale.texts[area.name],
                    }
                })
                this.setState({
                    areaOptions,
                })
            })
            .catch((err) => {
                console.log(`get area table failed ${err}`)
            })
    }

    getDeviceGroup = () => {
        apiHelper.deviceGroupListApis
            .getDeviceGroupList()
            .then((res) => {
                const data = res.data.map((group) => {
                    return {
                        ...group,
                        devices: group.devices || [],
                    }
                })

                let deviceGroupListOptions = res.data.map((item) => {
                    return {
                        label: item.name,
                        value: item,
                    }
                })

                const updatedSelectedDeviceGroup = this.state
                    .selectedDeviceGroup
                    ? data.filter((group) => {
                          return group.id == this.state.selectedDeviceGroup.id
                      })[0]
                    : null

                this.setState({
                    // deviceGroupList: data,
                    deviceGroupListOptions,
                    selectedDeviceGroup: updatedSelectedDeviceGroup,
                })
            })
            .catch((err) => {
                console.log('err when get device group ', err)
            })
    }

    handleClose = () => {
        this.setState({
            renameGroup: false,
        })
    }

    render() {
        const { locale } = this.context

        let {
            areaOptions,
            deviceGroupListOptions,
            selectedDeviceGroup,
        } = this.state

        return (
            <div
                className="text-capitalize"
                style={{
                    height: this.state.selectedDeviceGroup ? '80vh' : '10vh',
                }}
            >
                <div className="d-flex">
                    <Select
                        className="flex-grow-1"
                        isClearable
                        onChange={this.selectDeviceGroup}
                        options={deviceGroupListOptions}
                    />
                    <PrimaryButton
                        variant="primary"
                        className="text-capitalize ml-2"
                        name="add"
                        onClick={() => {
                            this.setState({
                                renameGroup: true,
                            })
                        }}
                    >
                        {locale.texts.CREATE_DEVICE_GROUP}
                    </PrimaryButton>
                </div>

                {this.state.selectedDeviceGroup ? (
                    <DualListBox
                        allItems={this.state.allDevices || []}
                        selectedItemList={selectedDeviceGroup}
                        selectedTitle="Devices In List"
                        unselectedTitle="Other Devices"
                        onSelect={this.addDeviceToGroup}
                        onUnselect={this.removeDeviceFromGroup}
                    />
                ) : null}

                {/* <ButtonToolbar
                        className='my-2'
                    >
                        <PrimaryButton
                            variant='primary'
                            className='text-capitalize mr-2'
                            name='secondaryArea'
                            onClick={() => {this.setState({renameGroup: true})}}
                        >
                            {locale.texts.EDIT_DEVICE_GROUP_NAME}
                        </PrimaryButton>

                        <PrimaryButton
                            variant='primary'
                            className='text-capitalize mr-2'
                            name='password'
                            onClick={this.deleteGroup}
                        >
                            {locale.texts.REMOVE_DEVICE_GROUP}
                        </PrimaryButton>

                    </ButtonToolbar> */}
                <EditListForm
                    show={this.state.renameGroup}
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
