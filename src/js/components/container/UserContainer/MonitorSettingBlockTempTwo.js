/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MonitorSettingBlockTempTwo.js

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
import { AppContext } from '../../../context/AppContext'
import { Row, Col } from 'react-bootstrap'
import Switcher from '../Switcher'
import axios from 'axios'
import dataSrc from '../../../dataSrc'
import config from '../../../config'
import DateTimePicker from '../DateTimePicker'

class MonitorSettingBlock extends React.Component {
    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
    }

    componentDidMount = () => {
        this.getMonitorConfig()
    }

    getMonitorConfig = () => {
        const { auth } = this.context
        axios
            .post(dataSrc.getMonitorConfig, {
                type: config.monitorSettingUrlMap[this.props.type],
                areasId: auth.user.areas_id,
            })
            .then((res) => {
                const data = res.data.reduce((toReturn, item) => {
                    toReturn[item.id] = item
                    return toReturn
                }, {})
                this.setState({
                    data,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleTimeChange = (time, name, id) => {
        let endTime = name == 'end' ? time.value : this.state.data[id].end_time
        const startTime =
            name == 'start' ? time.value : this.state.data[id].start_time
        if (
            name == 'start' &&
            endTime.split(':')[0] <= startTime.split(':')[0]
        ) {
            endTime = [
                parseInt(startTime.split(':')[0]) + 1,
                endTime.split(':')[1],
            ].join(':')
        }

        const monitorConfigPackage = {
            type: config.monitorSettingUrlMap[this.props.type],
            ...this.state.data[id],
            start_time: startTime,
            end_time: endTime,
        }
        axios
            .post(dataSrc.setMonitorConfig, {
                monitorConfigPackage,
            })
            .then((res) => {
                this.setState({
                    data: {
                        ...this.state.data,
                        [id]: monitorConfigPackage,
                    },
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleSwitcherChange = (e) => {
        const target = e.target
        const id = target.id.split(':')[1]

        const monitorConfigPackage = {
            type: config.monitorSettingUrlMap[this.props.type],
            ...this.state.data[id],
            enable: parseInt(target.value),
        }

        axios
            .post(dataSrc.setMonitorConfig, {
                monitorConfigPackage,
            })
            .then((res) => {
                this.setState({
                    data: {
                        ...this.state.data,
                        [id]: monitorConfigPackage,
                    },
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const style = {
            container: {
                minHeight: '100vh',
            },
            type: {
                fontWeight: 600,
                fontSize: '1.2rem',
            },
            subtype: {
                color: '#6c757d',
                fontSize: '1.2rem',
            },
            hr: {
                width: '95%',
            },
        }
        const { type } = this.props
        const { locale } = this.context

        return (
            <div>
                {Object.keys(this.state.data).length != 0 ? (
                    <>
                        <Row>
                            <Col>
                                <div style={style.type}>
                                    {
                                        locale.texts[
                                            type
                                                .toUpperCase()
                                                .replace(/ /g, '_')
                                        ]
                                    }
                                </div>
                            </Col>
                        </Row>
                        {Object.values(this.state.data).map((item, index) => {
                            return (
                                <div key={index}>
                                    {index > 0 && <hr style={style.hr} />}
                                    <Row className="mx-4">
                                        <Col xl={9}>
                                            <div style={style.subtype}>
                                                {config.mapConfig.areaOptions[
                                                    item.area_id
                                                ]
                                                    ? locale.texts[
                                                          config.mapConfig
                                                              .areaOptions[
                                                              item.area_id
                                                          ]
                                                      ]
                                                    : null}
                                            </div>
                                            <Row className="my-3" noGutters>
                                                <Col
                                                    className="d-flex justify-content-around"
                                                    xl={6}
                                                >
                                                    <Col
                                                        className="d-flex align-items-center justify-content-start px-0"
                                                        xl={3}
                                                    >
                                                        <div>
                                                            {
                                                                locale.texts
                                                                    .ENABLE_START_TIME
                                                            }
                                                            :
                                                        </div>
                                                    </Col>
                                                    <Col className="" xl={9}>
                                                        <DateTimePicker
                                                            id={item.id}
                                                            value={
                                                                item.start_time
                                                            }
                                                            getValue={
                                                                this
                                                                    .handleTimeChange
                                                            }
                                                            name="start"
                                                            start="0"
                                                            end="23"
                                                        />
                                                    </Col>
                                                </Col>
                                                <Col
                                                    className="d-flex justify-content-around"
                                                    xl={6}
                                                >
                                                    <Col
                                                        className="d-flex align-items-center justify-content-start px-0"
                                                        xl={3}
                                                    >
                                                        <div>
                                                            {
                                                                locale.texts
                                                                    .ENABLE_END_TIME
                                                            }
                                                            :
                                                        </div>
                                                    </Col>
                                                    <Col className="" xl={9}>
                                                        <DateTimePicker
                                                            id={item.id}
                                                            value={
                                                                item.end_time
                                                            }
                                                            getValue={
                                                                this
                                                                    .handleTimeChange
                                                            }
                                                            name="end"
                                                            start={
                                                                parseInt(
                                                                    item.start_time.split(
                                                                        ':'
                                                                    )[0]
                                                                ) + 1
                                                            }
                                                            end="24"
                                                        />
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col
                                            xl={3}
                                            className="d-flex justify-content-end"
                                        >
                                            <Switcher
                                                leftLabel="on"
                                                rightLabel="off"
                                                onChange={
                                                    this.handleSwitcherChange
                                                }
                                                status={item.enable}
                                                type={this.props.type}
                                                subId={item.id}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })}
                        <hr />
                    </>
                ) : null}
            </div>
        )
    }
}

export default MonitorSettingBlock
