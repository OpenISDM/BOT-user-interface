import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
} from "react-bootstrap"
import Switcher from "../Switcher";
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import DateTimePicker from '../DateTimePicker';

class MonitorSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: []
    }

    componentDidMount = () => {
        this.getMonitorConfig()
    }

    getMonitorConfig = () => {
        let { auth } = this.context
        axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[this.props.type],
            areasId: auth.user.areas_id
        })
        .then(res => {
            let data = res.data.reduce((toReturn, item) => {
                toReturn[item.id] = item
                return toReturn
            }, {})
            this.setState({
                data,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    handleTimeChange = (time, name, id) => {

        let endTime = name == 'end' ? time.value : this.state.data[id].end_time;
        let startTime = name == 'start' ? time.value : this.state.data[id].start_time;
        if (name == 'start' && endTime.split(':')[0] <= startTime.split(':')[0]) {
            endTime = [parseInt(startTime.split(':')[0]) + 1, endTime.split(':')[1]].join(':')
        }
        
        let monitorConfigPackage = {
            type: config.monitorSettingUrlMap[this.props.type],
            ...this.state.data[id],
            start_time: startTime,
            end_time: endTime
        }
        axios.post(dataSrc.setMonitorConfig, {
            monitorConfigPackage
        })
        .then(res => {
            this.setState({
                data: {
                    ...this.state.data,
                    [id]: monitorConfigPackage
                }
            })
        })
        .catch(err => { 
            console.log(err)
        })
    }
    
    handleSwitcherChange = (e) => {
        let target = e.target
        let id = target.id.split(':')[1]

        let monitorConfigPackage = {
            type: config.monitorSettingUrlMap[this.props.type],
            ...this.state.data[id],
            enable: parseInt(target.value)
        }

        axios.post(dataSrc.setMonitorConfig, {
            monitorConfigPackage
        })
        .then(res => {
            this.setState({
                data: {
                    ...this.state.data,
                    [id]: monitorConfigPackage
                }
            })
        })
        .catch(err => { 
            console.log(err)
        })
    }


    render() {
        let style = {
            container: {
                minHeight: "100vh"
            },
            type: {
                fontWeight: 600,
                fontSize: '1.2rem',
            },
            subtype: {
                color: "#6c757d",
                fontSize: '1.2rem',
            },
            hr: {
                width: "95%"
            }
        }
        let {
            type
        } = this.props
        let { locale } = this.context

        return (
            <div>
                {Object.keys(this.state.data).length !== 0 
                    ?   <>
                            <Row>
                                <Col>
                                    <div style={style.type}>
                                        {locale.texts[type.toUpperCase().replace(/ /g, '_')]}
                                    </div>
                                </Col>
                            </Row>
                            {Object.values(this.state.data).map((item,index) => {
                                return  (
                                    <div key={index}>
                                        {index > 0 && <hr style={style.hr}/>}
                                        <Row
                                            className="mx-4"
                                        >
                                            <Col xl={9}>
                                                <div style={style.subtype}>
                                                    {config.mapConfig.areaOptions[item.area_id] 
                                                        ?   locale.texts[config.mapConfig.areaOptions[item.area_id]]
                                                        :   null
                                                    }
                                                </div>
                                                <Row 
                                                    className="my-3"
                                                    noGutters
                                                >
                                                    <Col
                                                        className="d-flex justify-content-around"
                                                        xl={6}
                                                    >
                                                        <Col 
                                                            className="d-flex align-items-center justify-content-start px-0"                                
                                                            xl={3}
                                                        >
                                                            <div>                                
                                                                {locale.texts.ENABLE_START_TIME}:
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <DateTimePicker
                                                                id={item.id}
                                                                value={item.start_time}
                                                                getValue={this.handleTimeChange}
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
                                                                {locale.texts.ENABLE_END_TIME}:
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <DateTimePicker
                                                                id={item.id}
                                                                value={item.end_time}
                                                                getValue={this.handleTimeChange}
                                                                name="end"
                                                                start={parseInt(item.start_time.split(':')[0]) + 1}
                                                                end="24"
                                                            />
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={3} className="d-flex justify-content-end">
                                                <Switcher
                                                    leftLabel="on"
                                                    rightLabel="off"
                                                    onChange={this.handleSwitcherChange}
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
                    :   null
                }
            </div>
        )
    }
}

export default MonitorSettingBlock