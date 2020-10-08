/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GeneralSettings.js

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
import { Button, ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../../../context/AppContext'
import axios from 'axios'
import EditAreasForm from '../../presentational/form/EditAreasForm'
import EditPwdForm from '../../presentational/form/EditPwdForm'
import messageGenerator from '../../../helper/messageGenerator'
import dataSrc from '../../../dataSrc'
import { Title } from '../../BOTComponent/styleComponent'
import NumberPicker from '../NumberPicker'
import apiHelper from '../../../helper/apiHelper'
import ReactTable from 'react-table'
import styleConfig from '../../../config/styleConfig'
import { objectAliasColumn } from '../../../config/tables'
import { JSONClone } from '../../../helper/utilities'

const checkinAlias = (type, type_alias) => {
    apiHelper.objectApiAgent
        .editAlias({
            objectType: type,
            alias: type_alias,
        })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(`checkin alias failed ${err}`)
        })
}

class GeneralSettings extends React.Component {
    static contextType = AppContext

    state = {
        data: [],
        columns: [],
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        const { locale } = this.context

        apiHelper.objectApiAgent
            .getAlias()
            .then((res) => {
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
                                    className="border-none"
                                    value={props.original.type_alias}
                                    onChange={(e) => {
                                        const data = this.state.data
                                        data[props.index].type_alias =
                                            e.target.value
                                        this.setState({
                                            data,
                                        })
                                    }}
                                    onKeyPress={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            e.target.value !==
                                                props.original.type_alias
                                        ) {
                                            const {
                                                type,
                                                type_alias,
                                            } = props.original
                                            this.checkinAlias(type, type_alias)
                                        }
                                    }}
                                />
                            )
                        },
                    },
                ]

                columns.map((field) => {
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })

                this.setState({
                    data: res.data.rows,
                    columns,
                })
            })
            .catch((err) => {
                console.log(`get object alias failed ${err}`)
            })
    }

    render() {
        const { locale, auth } = this.context

        const { areaTable } = this.state

        return (
            <div className="d-flex flex-column">
                <div className="mb-">
                    <div className="color-black mb-2 font-size-120-percent">
                        {locale.texts.EDIT_DEVICE_ALIAS}
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

export default GeneralSettings
