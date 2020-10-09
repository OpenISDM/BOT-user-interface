/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        AddableList.js

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
import ListGroup from 'react-bootstrap/ListGroup'
const Fragment = React.Fragment

class AddableList extends React.Component {
    constructor() {
        super()
        this.state = {
            title: 'title',
            itemList: [],
        }
        this.addNewItem = this.addNewItem.bind(this)
        this.addListByEnter = this.addListByEnter.bind(this)
        this.removeItem = this.removeItem.bind(this)

        this.validation = (item) => {
            return true
        }

        this.itemLayout = (item) => {
            if (typeof item == 'string') {
                return <Fragment>{item}</Fragment>
            }
            console.error(
                'the item is an object so you have to set your own itemLayout'
            )
            return

        }

        this.API = {
            // setTitle: (title) => {
            //     this.setState({
            //         title: title
            //     })
            // },
            // getTitle: (title) => {
            //     return this.state.title
            // },
            getItem: () => {
                return this.state.itemList
            },
            setList: (list) => {
                if (typeof list == 'object') {
                    this.setState({
                        itemList: list,
                    })
                }
            },
            removeItem: (item) => {
                this.setState({
                    // itemList: _.without(this.state.itemList, item)
                })
                this.Update('remove', item)
            },
            pushItem: (itemValue) => {
                this.setState({
                    itemList: this.state.itemList.push(itemValue),
                })
            },
            addItem: () => {
                const { itemList } = this.state
                if (itemList[itemList.length - 1] != 'add') {
                    itemList.push('add')
                    this.setState({})
                }
            },
            addItemCheck: (item) => {
                const { itemList } = this.state
                if (itemList[itemList.length - 1] == 'add') {
                    const validationValue = this.validation(item)
                    if (validationValue) {
                        itemList.pop()
                        itemList.push(validationValue)
                        this.setState({})
                        this.Update('add', validationValue)
                    }
                }
            },
            whenUpdate: (func) => {
                this.Update = func
            },
            setValidation: (func) => {
                this.validation = func
            },
            setOnClick: (func) => {
                this.onClick = func
            },
            setItemLayout: (func) => {
                this.itemLayout = func
            },
        }
    }

    componentDidMount() {
        if (this.props.getAPI) {
            this.props.getAPI(this.API)
        } else {
            console.error(
                'please set attributes called "getAPI" for UserSettingContainer'
            )
        }
    }

    addNewItem() {
        this.API.addItem()
    }
    addListByEnter(e) {
        if (event.key == 'Enter') {
            const newACN = e.target.value
            this.API.addItemCheck(newACN)
        }
    }
    removeItem(e) {
        const ACN = e.target.getAttribute('name')
        this.API.removeItem(ACN)
    }
    render() {
        const style = {
            item: {
                cursor: 'pointer',
            },
        }
        return (
            <Fragment>
                <ListGroup
                    className="overflow-hidden-scroll custom-scrollbar"
                    variant="flush"
                >
                    {this.state.itemList != null
                        ? (() => {
                            const { itemList } = this.state
                            const Html = []
                            const acnList = Object.keys(itemList)

                            for (const acn of acnList) {
                                let html = []
                                const item = itemList[acn],
                                    index = item.asset_control_number

                                if (item == 'add') {
                                    html = (
                                        <div
                                            className="py-1 pr-2"
                                            key={index}
                                        >
                                            <input
                                                type="text"
                                                className="form-control h5 float-left w-75 border-0"
                                                onKeyPress={
                                                    this.addListByEnter
                                                }
                                            ></input>
                                            <h4
                                                className="float-right"
                                                name="add"
                                                onClick={this.removeItem}
                                            >
                                                  x
                                            </h4>
                                        </div>
                                    )
                                } else {
                                    html = (
                                        <ListGroup.Item
                                            key={index}
                                            onClick={this.onClick}
                                            name={index}
                                            action
                                            className="cursor-pointer"
                                            style={style.item}
                                        >
                                            {this.itemLayout(item, index)}
                                        </ListGroup.Item>
                                    )
                                }
                                Html.push(html)
                            }
                            return Html
                        })()
                        : null}
                </ListGroup>
            </Fragment>
        )
    }
}

export default AddableList
